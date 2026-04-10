"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labels: Record<string, string> = {
    admin: "Admin",
    blog: "Blog",
    casos: "Casos de Éxito",
    servicios: "Servicios",
    industrias: "Industrias",
    "landing-pages": "Landing Pages",
    home: "Home",
    nosotros: "Nosotros",
    navegacion: "Navegación",
    seo: "SEO",
    traducciones: "Traducciones",
    estado: "Estado",
    configuracion: "Configuración",
    usuarios: "Usuarios",
    nuevo: "Nuevo",
    nueva: "Nueva",
  };

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    crumbs.push({
      label: labels[segment] || segment,
      href: path,
    });
  }

  return crumbs;
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const crumbs = generateBreadcrumbs(pathname);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg-surface/80 backdrop-blur-sm px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-40" />}
            <span
              className={i === crumbs.length - 1 ? "font-medium text-text-100" : "text-text-40"}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* User info & actions */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-text-70">
            {user.name} <span className="text-text-40">({user.role})</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-70 hover:bg-bg-elevated hover:text-red-400 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
