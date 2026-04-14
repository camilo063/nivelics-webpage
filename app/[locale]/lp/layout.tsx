import Link from "next/link";

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Minimal nav — logo + single CTA */}
      <nav className="sticky top-0 z-40 h-14 border-b border-white/8 bg-[#0A0A0F]/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-black tracking-tight text-white"
            aria-label="Ir a nivelics.com"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#00D4FF] to-[#0099CC] font-black text-black"
              aria-hidden="true"
            >
              N
            </span>
            Nivelics
          </Link>
          <a
            href="#formulario"
            className="inline-flex h-9 items-center rounded-full bg-[#00D4FF] px-4 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Hablemos →
          </a>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
