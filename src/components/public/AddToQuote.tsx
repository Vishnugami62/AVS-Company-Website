"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { addToCart } from "@/lib/quote-cart";
import { cn } from "@/lib/utils";

export function AddToQuote({
  sku,
  name,
  pack,
  qty = 1,
  className,
  block = false,
}: {
  sku: string;
  name: string;
  pack?: string;
  qty?: number;
  className?: string;
  block?: boolean;
}) {
  const [added, setAdded] = useState(false);

  function add() {
    addToCart({ sku, name, pack }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={add}
      className={cn(
        "btn btn-sm",
        added ? "btn-whatsapp" : "btn-outline",
        block && "w-full",
        className,
      )}
      aria-live="polite"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> Add to quote
        </>
      )}
    </button>
  );
}
