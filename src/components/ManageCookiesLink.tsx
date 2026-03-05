"use client";

export default function ManageCookiesLink() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("openCookiePreferences"))}
      className="text-primary underline hover:no-underline cursor-pointer"
    >
      Manage Cookie Preferences
    </button>
  );
}
