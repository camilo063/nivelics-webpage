import Link from "next/link";

interface LpFooterMinProps {
  whatsappMessage?: string;
}

export function LpFooterMin({}: LpFooterMinProps) {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0F] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-xl font-black tracking-tight text-white">
            Nivelics
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Política de privacidad
            </Link>
            <Link href="/soporte" className="hover:text-white transition-colors">
              Soporte
            </Link>
            <a
              href="https://wa.me/573103926621"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Nivelics. Bogotá · Miami.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LpFooterMin;
