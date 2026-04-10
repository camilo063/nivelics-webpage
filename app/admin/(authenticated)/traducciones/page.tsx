import { connection } from "next/server";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export default async function TraduccionesEditorPage() {
  await connection();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editor de Traducciones</h1>
        <p className="text-text-70">Gestiona las traducciones ES → EN de todo el contenido</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/traducciones/estado"
          className="group rounded-xl border border-border bg-bg-surface p-6 hover:border-border-hover transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Dashboard de Estado</h3>
            </div>
            <ArrowRight className="h-4 w-4 text-text-40 group-hover:text-primary transition-colors" />
          </div>
          <p className="mt-2 text-sm text-text-40">
            Ver el progreso de traducción por sección y detectar campos pendientes
          </p>
        </Link>

        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <h3 className="font-semibold">Traducción por sección</h3>
          <p className="mt-2 text-sm text-text-40">
            Para editar traducciones, ve directamente a cada sección (Blog, Servicios, etc.) y usa
            el BilingualEditor con el botón &quot;Auto-traducir&quot;
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "Blog", href: "/admin/blog" },
              { label: "Casos", href: "/admin/casos" },
              { label: "Servicios", href: "/admin/servicios" },
              { label: "Industrias", href: "/admin/industrias" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-70 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
