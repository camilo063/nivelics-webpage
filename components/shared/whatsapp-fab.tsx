"use client";

import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function WhatsAppFAB() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace("+", "")}?text=${encodeURIComponent("Hola, me interesa conocer más sobre los servicios de Nivelics.")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle size={28} />
    </a>
  );
}
