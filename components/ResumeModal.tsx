"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { ArrowUpRight, DownloadIcon } from "./Icons";

/** Stylized résumé preview in a modal, with download / open-in-new actions. */
export function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="resume-modal fixed inset-0 z-[10001] grid place-items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Résumé preview"
      onClick={onClose}
    >
      <div className="resume-backdrop absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        className="resume-panel relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line-strong bg-[#121217] shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </span>
            <p className="font-mono text-xs tracking-[0.14em] text-muted">RÉSUMÉ · DERRICK RATNAHARAN</p>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={site.resume}
              download
              className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
            >
              <DownloadIcon className="size-3.5" /> Download
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
            >
              <ArrowUpRight className="size-3.5" /> Open
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-fg"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-[#0c0c10] p-4 sm:p-6">
          <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/10">
            <Image
              src="/resume-preview.jpg"
              alt="Derrick Ratnaharan's résumé"
              width={1082}
              height={1400}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-line p-4 sm:hidden">
          <a href={site.resume} download className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong py-2.5 text-sm">
            <DownloadIcon className="size-4" /> Download
          </a>
          <a href={site.resume} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-medium text-white">
            Open <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
