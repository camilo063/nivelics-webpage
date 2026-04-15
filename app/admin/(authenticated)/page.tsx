import { connection } from "next/server";
import { db } from "@/lib/db";
import {
  blogPosts,
  casosExito,
  servicios,
  landingPages,
  adminActivityLog,
  adminUsers,
} from "@/lib/db/schema/admin";
import { eq, count, isNull, and, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { GeoIcon } from "@/lib/icons/geometric";

async function getDashboardStats() {
  if (!db) {
    return {
      blog: { total: 0, published: 0, draft: 0 },
      casos: { total: 0, published: 0 },
      translationPending: 0,
      landings: { total: 0, published: 0 },
      recentActivity: [] as Array<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        createdAt: Date;
      }>,
    };
  }

  const [blogStats, casosStats, landingStats, pendingTranslations, activity] = await Promise.all([
    db.select({ count: count() }).from(blogPosts).where(isNull(blogPosts.deletedAt)),
    db.select({ count: count() }).from(casosExito).where(isNull(casosExito.deletedAt)),
    db.select({ count: count() }).from(landingPages),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.translationStatusEn, "pending"))),
    db.select().from(adminActivityLog).orderBy(desc(adminActivityLog.createdAt)).limit(10),
  ]);

  const publishedBlog = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")));

  const publishedCasos = await db
    .select({ count: count() })
    .from(casosExito)
    .where(and(isNull(casosExito.deletedAt), eq(casosExito.status, "published")));

  const publishedLandings = await db
    .select({ count: count() })
    .from(landingPages)
    .where(eq(landingPages.status, "published"));

  return {
    blog: {
      total: blogStats[0].count,
      published: publishedBlog[0].count,
      draft: blogStats[0].count - publishedBlog[0].count,
    },
    casos: {
      total: casosStats[0].count,
      published: publishedCasos[0].count,
    },
    translationPending: pendingTranslations[0].count,
    landings: {
      total: landingStats[0].count,
      published: publishedLandings[0].count,
    },
    recentActivity: activity,
  };
}

export default async function AdminDashboard() {
  await connection();
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Blog",
      icon: "file-text",
      value: stats.blog.total,
      detail: `${stats.blog.published} pub / ${stats.blog.draft} borr`,
      href: "/admin/blog",
      color: "text-primary",
    },
    {
      title: "Casos de Éxito",
      icon: "award",
      value: stats.casos.total,
      detail: `${stats.casos.published} publicados`,
      href: "/admin/casos",
      color: "text-staffing",
    },
    {
      title: "Traducciones EN",
      icon: "languages",
      value: `${stats.translationPending}`,
      detail: "pendientes",
      href: "/admin/traducciones/estado",
      color: "text-finops",
    },
    {
      title: "Landing Pages",
      icon: "rocket",
      value: stats.landings.total,
      detail: `${stats.landings.published} activas`,
      href: "/admin/landing-pages",
      color: "text-ia",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-70">Bienvenido al panel de administración de Nivelics</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-70 hover:border-border-hover hover:text-text-100 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver sitio
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-border bg-bg-surface p-6 transition-all hover:border-border-hover hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between">
              <GeoIcon name={card.icon} size={18} color="cyan" />
              <span className="text-2xl font-bold">{card.value}</span>
            </div>
            <h3 className="mt-3 text-sm font-medium text-text-100">{card.title}</h3>
            <p className="text-xs text-text-40">{card.detail}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/nuevo"
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo artículo
          </Link>
          <Link
            href="/admin/casos/nuevo"
            className="flex items-center gap-2 rounded-lg bg-staffing/10 px-4 py-2.5 text-sm font-medium text-staffing hover:bg-staffing/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo caso
          </Link>
          <Link
            href="/admin/landing-pages/nueva"
            className="flex items-center gap-2 rounded-lg bg-ia/10 px-4 py-2.5 text-sm font-medium text-ia hover:bg-ia/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva landing
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Actividad reciente</h2>
        <div className="rounded-xl border border-border bg-bg-surface">
          {stats.recentActivity.length === 0 ? (
            <div className="px-6 py-8 text-center text-text-40">
              No hay actividad registrada aún
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-text-70">
                    <span className="font-medium text-text-100">{activity.action}</span> en{" "}
                    <span className="text-primary">{activity.entityType}</span>
                  </span>
                  <span className="text-xs text-text-40">
                    {new Date(activity.createdAt).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
