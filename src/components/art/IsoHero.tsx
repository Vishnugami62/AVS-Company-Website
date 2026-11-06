"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Box = {
  x: number; y: number;          // position on the floor plane
  w: number; d: number; h: number; // width / depth / height
  z?: number;                     // stack height
  delay: number;                  // float offset
  sheet?: boolean;                // paper-thin, light coloured
};

/** Stacked cartons, a pallet and a floating docket — navy & gold, per the style guide. */
const BOXES: Box[] = [
  { x: 86, y: 86, w: 118, d: 118, h: 80, z: 0, delay: 0 },
  { x: 104, y: 104, w: 82, d: 82, h: 54, z: 80, delay: 0.5 },
  { x: 0, y: 152, w: 72, d: 72, h: 48, z: 0, delay: 1.0 },
  { x: 214, y: 122, w: 76, d: 76, h: 56, z: 0, delay: 1.5 },
  { x: 152, y: 2, w: 64, d: 64, h: 38, z: 0, delay: 2.0 },
  { x: 104, y: 72, w: 86, d: 64, h: 5, z: 158, delay: 0.8, sheet: true },
];

export function IsoHero({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.setProperty("--mx", `${Math.max(-1, Math.min(1, dx)) * 12}deg`);
        el.style.setProperty("--my", `${Math.max(-1, Math.min(1, dy)) * -7}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={stage}
      className={cn("iso-stage relative grid h-[400px] w-full place-items-center", className)}
      aria-hidden
    >
      {/* soft gold glow + ground shadow for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side at 50% 48%, rgba(226,191,114,.38), rgba(226,191,114,0) 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[66%] h-16 w-64 -translate-x-1/2 rounded-[50%] blur-xl"
        style={{ background: "rgba(19,39,90,.22)" }}
      />

      <div className="iso-world h-[300px] w-[300px]">
        {BOXES.map((b, i) => (
          <div
            key={i}
            className={cn("cub", b.sheet && "sheet")}
            style={
              {
                left: `${b.x}px`,
                top: `${b.y}px`,
                "--w": `${b.w}px`,
                "--d": `${b.d}px`,
                "--h": `${b.h}px`,
                "--z": `${b.z ?? 0}px`,
                animationDelay: `${b.delay}s`,
              } as React.CSSProperties
            }
          >
            <i className="ft" />
            <i className="fs" />
            <i className="fe" />
          </div>
        ))}
      </div>
    </div>
  );
}
