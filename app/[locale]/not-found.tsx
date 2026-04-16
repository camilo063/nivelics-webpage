import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | Nivelics" },
  description: "La URL que buscas no existe en nivelics.com.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function NotFound() {
  const locale = ((await getLocale()) as Locale) ?? "es";
  const en = locale === "en";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] px-6 py-16 text-center">
      <p
        className="select-none text-[80px] font-semibold leading-none"
        style={{ color: "rgba(255,255,255,0.06)" }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="mt-2 text-[20px] font-medium text-text-100">
        {en ? "Page not found" : "Página no encontrada"}
      </h1>

      <p className="mt-2 max-w-[380px] text-[13px] leading-relaxed text-text-70">
        {en
          ? "The URL you're looking for doesn't exist on nivelics.com."
          : "La URL que buscas no existe en nivelics.com."}
      </p>

      <Link
        href={en ? "/en" : "/"}
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-[12px] font-medium text-[#0d1117] hover:bg-[#22d3ee]"
      >
        ← {en ? "Go to home" : "Ir al inicio"}
      </Link>
    </main>
  );
}
