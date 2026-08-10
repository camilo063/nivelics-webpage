"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { track } from "@/lib/analytics/track";
import { waUrl } from "@/lib/utils/whatsapp";

const DISMISS_KEY = "nv-wa-fab-dismissed";

interface WhatsAppFabProps {
  /** `site_config.phone_whatsapp` — se administra en Admin → Configuración. */
  phone?: string | null;
  message?: string;
  ariaLabel?: string;
  closeLabel?: string;
}

/**
 * FAB de WhatsApp global para páginas de marketing (CRO §1.2).
 * - Bottom-left para no chocar con el widget Dapta (bottom-right).
 * - En mobile se eleva para no tapar el StickyMobileCta (barra inferior).
 * - Cerrable: la preferencia persiste en localStorage.
 * (La variante de landing pages es components/lp/LpWhatsApp — bottom-right,
 *  las LP no montan Dapta.)
 */
export function WhatsAppFab({
  phone,
  message = "Hola, quiero más información sobre Nivelics",
  ariaLabel = "Chatear por WhatsApp",
  closeLabel = "Ocultar botón de WhatsApp",
}: WhatsAppFabProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Diferido a rAF: lectura de localStorage post-hidratación sin setState
    // síncrono en el cuerpo del effect (react-hooks/set-state-in-effect).
    const id = requestAnimationFrame(() => {
      try {
        if (localStorage.getItem(DISMISS_KEY) !== "1") setVisible(true);
      } catch {
        setVisible(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!visible) return null;

  const url = waUrl(phone, message);

  return (
    <div className="fixed bottom-20 left-4 z-40 md:bottom-6 md:left-6 group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        onClick={() => track("whatsapp_click", { path: pathname ?? "" })}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 motion-reduce:hover:scale-100"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </a>
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => {
          setVisible(false);
          try {
            localStorage.setItem(DISMISS_KEY, "1");
          } catch {
            /* noop */
          }
        }}
        className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-bg-base text-text-70 hover:text-text-100 group-hover:flex focus-visible:flex"
      >
        <X size={11} aria-hidden="true" />
      </button>
    </div>
  );
}
