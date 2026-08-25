"use client";

import { MessageCircle } from "lucide-react";
import { waUrl } from "@/lib/utils/whatsapp";

interface LpWhatsAppProps {
  message?: string;
  /** Número configurado en Admin → Configuración (site_config.phone_whatsapp). */
  phone?: string | null;
}

export function LpWhatsApp({
  message = "Hola, quiero más información sobre Nivelics",
  phone,
}: LpWhatsAppProps) {
  const url = waUrl(phone, message);

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
