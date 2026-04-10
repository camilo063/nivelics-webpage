"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Award,
  Briefcase,
  Factory,
  Rocket,
  Home,
  Users,
  Navigation,
  Globe,
  Languages,
  Settings,
  UserCog,
  Image,
  CheckSquare,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: null,
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/casos", label: "Casos de Éxito", icon: Award },
      { href: "/admin/servicios", label: "Servicios", icon: Briefcase },
      { href: "/admin/industrias", label: "Industrias", icon: Factory },
      { href: "/admin/landing-pages", label: "Landing Pages", icon: Rocket },
    ],
  },
  {
    label: "Sitio",
    items: [
      { href: "/admin/home", label: "Home", icon: Home },
      { href: "/admin/nosotros", label: "Nosotros", icon: Users },
      { href: "/admin/navegacion", label: "Navegación", icon: Navigation },
    ],
  },
  {
    label: "Traducciones",
    items: [
      { href: "/admin/traducciones", label: "Editor", icon: Languages },
      { href: "/admin/traducciones/estado", label: "Estado EN", icon: CheckSquare },
    ],
  },
  {
    label: null,
    items: [
      { href: "/admin/media", label: "Media", icon: Image },
      { href: "/admin/seo", label: "SEO", icon: Globe },
      { href: "/admin/configuracion", label: "Configuración", icon: Settings },
      { href: "/admin/configuracion/usuarios", label: "Usuarios", icon: UserCog },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-bg-surface">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="text-xl font-bold text-primary">Nivelics</span>
        <span className="text-sm text-text-40">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {section.label && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-text-70 hover:bg-bg-elevated hover:text-text-100"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-text-40 hover:text-primary transition-colors"
        >
          <Image className="h-3.5 w-3.5" />
          Ver sitio público
        </Link>
      </div>
    </aside>
  );
}
