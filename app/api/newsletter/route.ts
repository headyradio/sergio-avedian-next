import { NextRequest, NextResponse } from "next/server";
import { createSubscriber } from "@/lib/kit/client";
import { checkAntiSpam, getClientIp } from "@/lib/anti-spam";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, first_name, turnstileToken, hp_field, elapsedMs } = body;

    // Anti-spam: Turnstile CAPTCHA + honeypot + timing trap
    const spam = await checkAntiSpam({ turnstileToken, hp_field, elapsedMs, ip: getClientIp(request) });
    if (!spam.ok) {
      if (spam.reason === "turnstile") {
        return NextResponse.json(
          { error: "Verification failed. Please try again." },
          { status: 400 }
        );
      }
      // honeypot/timing → silently drop so bots get a success-looking response
      console.warn(`[newsletter] Dropped spam submission (reason: ${spam.reason})`);
      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to the newsletter!",
      });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create/update subscriber in Kit (ConvertKit)
    const result = await createSubscriber({
      email,
      first_name: first_name || undefined,
      state: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
      data: result,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
