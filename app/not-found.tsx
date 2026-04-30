import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// Root not-found — fully static safety net for URLs that escape the
// next-intl middleware (e.g. /admin/* unmatched). The localized 404
// lives at app/[locale]/not-found.tsx and renders the rich version.
//
// Includes <html><body> because the root layout is a passthrough — the
// actual <html><body> in app/[locale]/layout.tsx isn't reached here.

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | Nivelics" },
  description: "La URL que buscas no existe en nivelics.com.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function NotFound() {
  return (
    <html lang="es">
      <body className="min-h-full flex flex-col antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] px-6 py-16 text-center">
          <p
            className="select-none text-[80px] font-semibold leading-none"
            style={{ color: "rgba(255,255,255,0.06)" }}
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="mt-2 text-[20px] font-medium text-text-100">Página no encontrada</h1>
          <p className="mt-2 max-w-[380px] text-[13px] leading-relaxed text-text-70">
            La URL que buscas no existe en nivelics.com.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-md bg-primary px-5 py-2.5 text-[12px] font-medium text-[#0d1117] hover:bg-[#22d3ee]"
          >
            ← Ir al inicio
          </Link>
        </main>
      </body>
    </html>
  );
}
