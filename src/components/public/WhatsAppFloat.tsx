import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/settings";

export function WhatsAppFloat({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, "Hi AVS Company, I'd like a quote for office supplies.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AVS Company on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-pill bg-whatsapp px-4 py-3 text-white shadow-lift transition hover:brightness-110"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden text-sm font-bold sm:inline">WhatsApp</span>
    </a>
  );
}
