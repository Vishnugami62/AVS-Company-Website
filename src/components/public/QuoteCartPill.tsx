"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { onCartChange, readCart } from "@/lib/quote-cart";

export function QuoteCartPill() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readCart().reduce((n, i) => n + i.qty, 0));
    update();
    return onCartChange(update);
  }, []);

  if (count === 0) return null;

  return (
    <Link
      href="/quote"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-pill bg-navy px-4 py-3 text-white shadow-lift transition hover:bg-navy-700"
    >
      <ClipboardList className="h-5 w-5 text-gold-light" />
      <span className="text-sm font-bold">Quote list ({count})</span>
    </Link>
  );
}
