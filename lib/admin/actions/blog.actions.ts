"use server";

import { db } from "@/lib/db";
import { blogPosts, blogCategories, adminActivityLog } from "@/lib/db/schema/admin";
import { blogPostSchema, type BlogPostInput } from "@/lib/admin/validations/blog.schema";
import { getAdminSession } from "@/lib/admin/session";
import { eq, desc, and, isNull, ilike, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function getBlogPosts(options?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  if (!db) return { posts: [], total: 0 };

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  const conditions = [isNull(blogPosts.deletedAt)];

  if (options?.status && options.status !== "all") {
    conditions.push(eq(blogPosts.status, options.status as "draft" | "published" | "scheduled"));
  }

  if (options?.search) {
    conditions.push(ilike(blogPosts.titleEs, `%${options.search}%`));
  }

  const [posts, totalResult] = await Promise.all([
    db
      .select()
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(...conditions)),
  ]);

  return { posts, total: totalResult[0].count };
}

export async function getBlogPost(id: string) {
  if (!db) return null;

  const result = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt)))
    .limit(1);

  return result[0] || null;
}

export async function createBlogPost(input: BlogPostInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = blogPostSchema.parse(input);

  const [post] = await db
    .insert(blogPosts)
    .values({
      ...parsed,
      categoryId: parsed.categoryId || null,
      readingTimeMinutes: parsed.readingTimeMinutes || null,
      authorId: session.sub,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "blog_post",
    entityId: post.id,
    details: { title: parsed.titleEs },
  });

  revalidatePath("/admin/blog");
  await revalidatePublicPages([`/blog/${parsed.slug}`, "/blog"]);
  return post;
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = blogPostSchema.partial().parse(input);

  const [post] = await db
    .update(blogPosts)
    .set({
      ...parsed,
      categoryId: parsed.categoryId ?? undefined,
      readingTimeMinutes: parsed.readingTimeMinutes ?? undefined,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "blog_post",
    entityId: id,
    details: { title: parsed.titleEs },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  if (post?.slug) await revalidatePublicPages([`/blog/${post.slug}`, "/blog"]);
  return post;
}

export async function deleteBlogPost(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.update(blogPosts).set({ deletedAt: new Date() }).where(eq(blogPosts.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "blog_post",
    entityId: id,
  });

  revalidatePath("/admin/blog");
}

export async function publishBlogPost(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db
    .update(blogPosts)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "publish",
    entityType: "blog_post",
    entityId: id,
  });

  revalidatePath("/admin/blog");
}

export async function getBlogCategories() {
  if (!db) return [];
  return db.select().from(blogCategories).orderBy(blogCategories.nameEs);
}

export async function createBlogCategory(input: {
  slug: string;
  nameEs: string;
  nameEn?: string;
  color?: string;
  icon?: string;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const [category] = await db
    .insert(blogCategories)
    .values({
      slug: input.slug,
      nameEs: input.nameEs,
      nameEn: input.nameEn || null,
      color: input.color || null,
      icon: input.icon || null,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "blog_category",
    entityId: category.id,
    details: { name: input.nameEs },
  });

  revalidatePath("/admin/blog/categorias");
  return category;
}

export async function updateBlogCategory(
  id: string,
  input: {
    slug?: string;
    nameEs?: string;
    nameEn?: string;
    color?: string;
    icon?: string;
  },
) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const values: Record<string, string | null | undefined> = {};
  if (input.slug !== undefined) values.slug = input.slug;
  if (input.nameEs !== undefined) values.nameEs = input.nameEs;
  if (input.nameEn !== undefined) values.nameEn = input.nameEn;
  if (input.color !== undefined) values.color = input.color;
  if (input.icon !== undefined) values.icon = input.icon;

  const [category] = await db
    .update(blogCategories)
    .set(values)
    .where(eq(blogCategories.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "blog_category",
    entityId: id,
    details: { name: input.nameEs },
  });

  revalidatePath("/admin/blog/categorias");
  return category;
}

export async function deleteBlogCategory(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.delete(blogCategories).where(eq(blogCategories.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "blog_category",
    entityId: id,
  });

  revalidatePath("/admin/blog/categorias");
}
