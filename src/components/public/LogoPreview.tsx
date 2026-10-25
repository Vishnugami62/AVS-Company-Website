"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

/** Lets a visitor preview their logo on a gift box (client-side only; nothing
 * is uploaded — the file stays in the browser until they place an order). */
export function LogoPreview() {
  const [url, setUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (url) URL.revokeObjectURL(url);
    setUrl(URL.createObjectURL(file));
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="relative grid aspect-square place-items-center rounded-card bg-navy-gradient p-8">
        {/* isometric box */}
        <svg viewBox="0 0 240 220" className="w-full max-w-[260px]" aria-hidden>
          <polygon points="40,70 120,25 200,70 120,115" fill="#E2BF72" />
          <polygon points="40,70 120,115 120,200 40,155" fill="#1B336E" />
          <polygon points="200,70 120,115 120,200 200,155" fill="#0E1D45" />
        </svg>
        <div className="absolute left-1/2 top-[38%] h-20 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/20 bg-white/90 p-2">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Your logo preview" className="h-full w-full object-contain" />
          ) : (
            <div className="grid h-full place-items-center text-center text-[10px] font-bold uppercase tracking-wide text-navy/50">
              Your logo here
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold">Preview your logo on the box</h3>
        <p className="mt-2 text-[15px] text-muted">
          Upload your logo to see it placed on a sample gift box. PNG, SVG or PDF — we&apos;ll
          check it before printing.
        </p>
        <button className="btn btn-gold mt-5 w-fit" onClick={() => inputRef.current?.click()}>
          <UploadCloud className="h-4 w-4" /> Upload your logo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,application/pdf"
          className="hidden"
          onChange={pick}
        />
        <p className="mt-3 text-xs text-muted">
          Your file stays in your browser until you place an order.
        </p>
      </div>
    </div>
  );
}
