"use server";

import { db } from "@/lib/db";
import {
  blogPosts,
  casosExito,
  servicios,
  industrias,
  homeContent,
  teamMembers,
  certificaciones,
} from "@/lib/db/schema/admin";
import { count, eq, isNull, and } from "drizzle-orm";

interface TranslationStats {
  section: string;
  total: number;
  complete: number;
  auto: number;
  partial: number;
  pending: number;
}

export async function getTranslationStats(): Promise<TranslationStats[]> {
  if (!db) return [];

  const stats: TranslationStats[] = [];

  // Blog
  const [blogTotal, blogComplete, blogAuto, blogPartial, blogPending] = await Promise.all([
    db.select({ count: count() }).from(blogPosts).where(isNull(blogPosts.deletedAt)),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.translationStatusEn, "complete"))),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.translationStatusEn, "auto"))),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.translationStatusEn, "partial"))),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.translationStatusEn, "pending"))),
  ]);
  stats.push({
    section: "Blog",
    total: blogTotal[0].count,
    complete: blogComplete[0].count,
    auto: blogAuto[0].count,
    partial: blogPartial[0].count,
    pending: blogPending[0].count,
  });

  // Casos
  const [casosTotal, casosComplete, casosAuto, casosPartial, casosPending] = await Promise.all([
    db.select({ count: count() }).from(casosExito).where(isNull(casosExito.deletedAt)),
    db
      .select({ count: count() })
      .from(casosExito)
      .where(and(isNull(casosExito.deletedAt), eq(casosExito.translationStatusEn, "complete"))),
    db
      .select({ count: count() })
      .from(casosExito)
      .where(and(isNull(casosExito.deletedAt), eq(casosExito.translationStatusEn, "auto"))),
    db
      .select({ count: count() })
      .from(casosExito)
      .where(and(isNull(casosExito.deletedAt), eq(casosExito.translationStatusEn, "partial"))),
    db
      .select({ count: count() })
      .from(casosExito)
      .where(and(isNull(casosExito.deletedAt), eq(casosExito.translationStatusEn, "pending"))),
  ]);
  stats.push({
    section: "Casos de Éxito",
    total: casosTotal[0].count,
    complete: casosComplete[0].count,
    auto: casosAuto[0].count,
    partial: casosPartial[0].count,
    pending: casosPending[0].count,
  });

  // Servicios
  const [svcTotal, svcComplete, svcAuto, svcPartial, svcPending] = await Promise.all([
    db.select({ count: count() }).from(servicios).where(isNull(servicios.deletedAt)),
    db
      .select({ count: count() })
      .from(servicios)
      .where(and(isNull(servicios.deletedAt), eq(servicios.translationStatusEn, "complete"))),
    db
      .select({ count: count() })
      .from(servicios)
      .where(and(isNull(servicios.deletedAt), eq(servicios.translationStatusEn, "auto"))),
    db
      .select({ count: count() })
      .from(servicios)
      .where(and(isNull(servicios.deletedAt), eq(servicios.translationStatusEn, "partial"))),
    db
      .select({ count: count() })
      .from(servicios)
      .where(and(isNull(servicios.deletedAt), eq(servicios.translationStatusEn, "pending"))),
  ]);
  stats.push({
    section: "Servicios",
    total: svcTotal[0].count,
    complete: svcComplete[0].count,
    auto: svcAuto[0].count,
    partial: svcPartial[0].count,
    pending: svcPending[0].count,
  });

  // Industrias
  const [indTotal, indComplete, indAuto, indPartial, indPending] = await Promise.all([
    db.select({ count: count() }).from(industrias).where(isNull(industrias.deletedAt)),
    db
      .select({ count: count() })
      .from(industrias)
      .where(and(isNull(industrias.deletedAt), eq(industrias.translationStatusEn, "complete"))),
    db
      .select({ count: count() })
      .from(industrias)
      .where(and(isNull(industrias.deletedAt), eq(industrias.translationStatusEn, "auto"))),
    db
      .select({ count: count() })
      .from(industrias)
      .where(and(isNull(industrias.deletedAt), eq(industrias.translationStatusEn, "partial"))),
    db
      .select({ count: count() })
      .from(industrias)
      .where(and(isNull(industrias.deletedAt), eq(industrias.translationStatusEn, "pending"))),
  ]);
  stats.push({
    section: "Industrias",
    total: indTotal[0].count,
    complete: indComplete[0].count,
    auto: indAuto[0].count,
    partial: indPartial[0].count,
    pending: indPending[0].count,
  });

  return stats;
}
