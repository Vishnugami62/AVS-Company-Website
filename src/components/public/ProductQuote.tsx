"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { addToCart } from "@/lib/quote-cart";

export function ProductQuote({
  sku,
  name,
  pack,
  unit = "units",
}: {
  sku: string;
  name: string;
  pack?: string;
  unit?: string;
}) {
  const [qty, setQty] = useState(10);
  const [added, setAdded] = useState(false);

  function add() {
    addToCart({ sku, name, pack }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-pill border border-navy/20 bg-white">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="grid h-11 w-11 place-items-center text-navy"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          className="w-14 border-0 bg-transparent text-center font-head font-bold text-navy outline-none"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))}
          aria-label={`Quantity in ${unit}`}
        />
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="grid h-11 w-11 place-items-center text-navy"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button type="button" onClick={add} className={`btn ${added ? "btn-whatsapp" : "btn-gold"}`}>
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added to quote
          </>
        ) : (
          "Add to quote list"
        )}
      </button>
    </div>
  );
}
