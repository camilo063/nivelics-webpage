import Link from "next/link";
import { waUrl } from "@/lib/utils/whatsapp";

interface LpFooterMinProps {
  whatsappMessage?: string;
  /** Número configurado en Admin → Configuración (site_config.phone_whatsapp). */
  whatsappPhone?: string | null;
  locale?: "es" | "en";
}

export function LpFooterMin({ whatsappMessage, whatsappPhone, locale = "es" }: LpFooterMinProps) {
  const isEn = locale === "en";
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0F] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-xl font-black tracking-tight text-white">
            Nivelics
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-70">
            <Link href="/privacidad" className="hover:text-white transition-colors">
              {isEn ? "Privacy policy" : "Política de privacidad"}
            </Link>
            <Link href="/soporte" className="hover:text-white transition-colors">
              {isEn ? "Support" : "Soporte"}
            </Link>
            <a
              href={waUrl(whatsappPhone, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <p className="text-xs text-text-40">
            © {new Date().getFullYear()} Nivelics. Bogotá · Miami.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LpFooterMin;
