import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { db } from "@/lib/db";
import { blogPosts, casosExito, landingPages } from "@/lib/db/schema/admin";
import { count, eq, and, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "DB no configurada" }, { status: 500 });
  }

  const [blogTotal, blogPublished, casosTotal, casosPublished, landingsTotal] = await Promise.all([
    db.select({ count: count() }).from(blogPosts).where(isNull(blogPosts.deletedAt)),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published"))),
    db.select({ count: count() }).from(casosExito).where(isNull(casosExito.deletedAt)),
    db
      .select({ count: count() })
      .from(casosExito)
      .where(and(isNull(casosExito.deletedAt), eq(casosExito.status, "published"))),
    db.select({ count: count() }).from(landingPages),
  ]);

  return NextResponse.json(
    {
      blog: { total: blogTotal[0].count, published: blogPublished[0].count },
      casos: { total: casosTotal[0].count, published: casosPublished[0].count },
      landings: { total: landingsTotal[0].count },
    },
    {
      headers: {
        "Cache-Control": "private, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
