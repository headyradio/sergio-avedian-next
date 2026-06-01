import type { NextRequest } from "next/server";

// Server-side anti-spam: Cloudflare Turnstile verification + honeypot + timing trap.
// All three layers fail "open" only when Turnstile is unconfigured, so the forms
// keep working before the keys are added; once TURNSTILE_SECRET_KEY is set the
// CAPTCHA check is enforced.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Reject submissions that arrive implausibly fast for a human (bots post instantly).
const MIN_ELAPSED_MS = 1000;

export function getClientIp(request: NextRequest): string | undefined {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[anti-spam] TURNSTILE_SECRET_KEY not set — skipping Turnstile verification");
    return true; // not configured → don't block real users
  }
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append("remoteip", ip);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean; ["error-codes"]?: string[] };
    if (!data.success) {
      console.warn("[anti-spam] Turnstile verification failed:", data["error-codes"]);
    }
    return !!data.success;
  } catch (e) {
    console.error("[anti-spam] Turnstile verification error:", e);
    return false;
  }
}

export interface AntiSpamInput {
  turnstileToken?: string;
  hp_field?: unknown;
  elapsedMs?: unknown;
  ip?: string;
}

export type AntiSpamReason = "honeypot" | "timing" | "turnstile";
export interface AntiSpamResult {
  ok: boolean;
  reason?: AntiSpamReason;
}

export async function checkAntiSpam(input: AntiSpamInput): Promise<AntiSpamResult> {
  // 1. Honeypot — a hidden field that real users never see or fill.
  if (typeof input.hp_field === "string" && input.hp_field.trim().length > 0) {
    return { ok: false, reason: "honeypot" };
  }

  // 2. Timing — block instant submissions (only when we got a numeric signal).
  if (typeof input.elapsedMs === "number" && input.elapsedMs >= 0 && input.elapsedMs < MIN_ELAPSED_MS) {
    return { ok: false, reason: "timing" };
  }

  // 3. Turnstile token verification.
  const turnstileOk = await verifyTurnstile(input.turnstileToken, input.ip);
  if (!turnstileOk) return { ok: false, reason: "turnstile" };

  return { ok: true };
}
