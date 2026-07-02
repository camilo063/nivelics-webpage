"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface Props {
  url: string;
  title: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2h3.308l-7.23 8.26L22.94 22h-6.95l-4.62-5.926L5.94 22H2.63l7.77-8.87L2 2h7.15l4.19 5.46L18.244 2Zm-1.15 18h1.83L7.08 4h-1.96l11.974 16Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ShareButtons({ url, title, label, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const xHref = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable — fail silent
    }
  }

  const buttonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-text-70 transition-colors hover:bg-white/[0.1] hover:text-white";

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-40">{label}</p>
      <div className="flex gap-2">
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="LinkedIn"
        >
          <LinkedinIcon className="h-4 w-4" />
        </a>
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="X (Twitter)"
        >
          <XIcon className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={copy}
          className={buttonClass}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
      {copied ? <p className="mt-2 text-xs text-[var(--primary)]">{copiedLabel}</p> : null}
    </div>
  );
}
