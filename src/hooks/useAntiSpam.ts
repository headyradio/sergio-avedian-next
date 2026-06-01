"use client";

import { useCallback, useRef, useState } from "react";
import { turnstileEnabled } from "@/components/TurnstileWidget";

export interface AntiSpamPayload {
  turnstileToken: string;
  hp_field: string;
  elapsedMs: number;
}

// Bundles the client-side anti-spam state (Turnstile token, honeypot value,
// form-render timestamp) and produces the payload appended to form submissions.
export function useAntiSpam() {
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [widgetKey, setWidgetKey] = useState(0);
  const mountedAtRef = useRef<number>(Date.now());

  const handleVerify = useCallback((t: string) => setToken(t), []);
  const handleExpire = useCallback(() => setToken(""), []);

  const buildPayload = useCallback(
    (): AntiSpamPayload => ({
      turnstileToken: token,
      hp_field: honeypot,
      elapsedMs: Date.now() - mountedAtRef.current,
    }),
    [token, honeypot]
  );

  // Clear token/honeypot and force the Turnstile widget to remount for a fresh,
  // single-use token after a successful submission.
  const reset = useCallback(() => {
    setToken("");
    setHoneypot("");
    setWidgetKey((k) => k + 1);
    mountedAtRef.current = Date.now();
  }, []);

  // Submission allowed when Turnstile is unconfigured, or a token has been issued.
  const verified = !turnstileEnabled || token.length > 0;

  return {
    turnstileEnabled,
    widgetKey,
    honeypotValue: honeypot,
    setHoneypotValue: setHoneypot,
    handleVerify,
    handleExpire,
    buildPayload,
    reset,
    verified,
  };
}
