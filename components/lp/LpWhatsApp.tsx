"use client";

import { MessageCircle } from "lucide-react";

interface LpWhatsAppProps {
  message?: string;
  phone?: string;
}

const DEFAULT_PHONE = "573103926621";

export function LpWhatsApp({
  message = "Hola, quiero más información sobre Nivelics",
  phone,
}: LpWhatsAppProps) {
  const resolvedPhone =
    phone ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    (process.env.NEXT_PUBLIC_WHATSAPP ? process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g, "") : "") ||
    DEFAULT_PHONE;

  const url = `https://wa.me/${resolvedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}

export default LpWhatsApp;
