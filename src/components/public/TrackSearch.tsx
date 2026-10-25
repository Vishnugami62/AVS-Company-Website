"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function TrackSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (v.length < 4) return;
    router.push(`/track/${encodeURIComponent(v)}`);
  }

  return (
    <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
      <input
        className="field flex-1"
        placeholder="Enter PO number or AVS order number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        aria-label="PO number or AVS order number"
        maxLength={60}
      />
      <button type="submit" className="btn btn-gold">
        <Search className="h-4 w-4" /> Track Order
      </button>
    </form>
  );
}
