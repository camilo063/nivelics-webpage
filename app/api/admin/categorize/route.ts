import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { classifyPost } from "@/lib/admin/categorize";
import { getBlogCategories, getBlogPost } from "@/lib/admin/actions/blog.actions";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurada" }, { status: 500 });
  }

  let body: {
    postId?: string;
    title?: string;
    excerpt?: string;
    content?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  let title = (body.title || "").trim();
  let excerpt = body.excerpt || "";
  let content = body.content || "";

  if (body.postId && !title) {
    const post = await getBlogPost(body.postId);
    if (!post) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    title = post.titleEs || "";
    excerpt = post.excerptEs || "";
    content = post.contentEs || "";
  }

  if (!title) {
    return NextResponse.json({ error: "Se requiere título" }, { status: 400 });
  }

  const categories = await getBlogCategories();
  if (categories.length === 0) {
    return NextResponse.json({ error: "No hay categorías configuradas" }, { status: 400 });
  }

  try {
    const result = await classifyPost(
      apiKey,
      categories.map((c) => ({ slug: c.slug, nameEs: c.nameEs, nameEn: c.nameEn })),
      { title, excerpt, content },
    );

    if (!result.slug) {
      return NextResponse.json({ category: null, confidence: "none" });
    }

    const match = categories.find((c) => c.slug === result.slug);
    if (!match) {
      return NextResponse.json({ category: null, confidence: "none" });
    }

    return NextResponse.json({
      categoryId: match.id,
      categorySlug: match.slug,
      categoryName: match.nameEs,
      confidence: result.confidence,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
