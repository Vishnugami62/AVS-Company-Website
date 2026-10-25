"use client";

// A tiny client-only "quote list": items the visitor wants quoted, kept in
// localStorage and synced across components/tabs via a storage + custom event.
// It holds no prices — AVS confirms pricing in the quote.

export type QuoteItem = { sku: string; name: string; qty: number; pack?: string };

const KEY = "avs_quote_list";
const EVENT = "avs-quote-change";

export function readCart(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuoteItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: QuoteItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

export function addToCart(item: Omit<QuoteItem, "qty">, qty = 1) {
  const items = readCart();
  const existing = items.find((i) => i.sku === item.sku);
  if (existing) existing.qty += qty;
  else items.push({ ...item, qty });
  write(items);
}

export function setQty(sku: string, qty: number) {
  const items = readCart()
    .map((i) => (i.sku === sku ? { ...i, qty: Math.max(1, qty) } : i))
    .filter((i) => i.qty > 0);
  write(items);
}

export function removeFromCart(sku: string) {
  write(readCart().filter((i) => i.sku !== sku));
}

export function clearCart() {
  write([]);
}

export function onCartChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export { EVENT as QUOTE_EVENT, KEY as QUOTE_KEY };
