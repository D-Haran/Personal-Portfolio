"use client";

import { useState } from "react";
import { MailIcon } from "../Icons";

/** Primary email button: opens the mail client, with a one-click copy beside it. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="inline-flex items-center rounded-full bg-accent p-1 shadow-[0_14px_36px_-12px_rgb(53_112_230/0.9)]">
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium text-white transition-colors hover:bg-white/10"
      >
        <MailIcon /> <span className="sm:hidden">Email me</span>
        <span className="hidden sm:inline">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="relative min-w-[4.5rem] rounded-full bg-white/15 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/25"
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
