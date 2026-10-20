import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(`Hi ${SITE.name}, I have a question about your cars.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#25D366]/90 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md transition hover:scale-105 hover:bg-[#25D366] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
    >
      <MessageCircle size={26} />
    </a>
  );
}
