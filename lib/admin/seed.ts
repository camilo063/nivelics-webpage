import { db } from "@/lib/db";
import { adminUsers, blogCategories } from "@/lib/db/schema/admin";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

export async function seedAdmin() {
  if (!db) {
    console.log("Database not configured, skipping seed");
    return;
  }

  const email = process.env.ADMIN_INITIAL_EMAIL || "admin@nivelics.com";
  const password = process.env.ADMIN_INITIAL_PASSWORD || "NivelicsAdmin2026!";

  // Seed admin user
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (existing.length === 0) {
    const passwordHash = await hashPassword(password);
    await db.insert(adminUsers).values({
      email,
      passwordHash,
      name: "Admin Nivelics",
      role: "admin",
      isActive: true,
      mustChangePassword: true,
    });
    console.log(`Admin user created: ${email}`);
  }

  // Seed default blog categories
  const categories = [
    {
      slug: "inteligencia-artificial",
      nameEs: "Inteligencia Artificial",
      nameEn: "Artificial Intelligence",
      color: "#8b5cf6",
      icon: "brain",
    },
    {
      slug: "cloud",
      nameEs: "Cloud & DevOps",
      nameEn: "Cloud & DevOps",
      color: "#1e40af",
      icon: "cloud",
    },
    {
      slug: "desarrollo",
      nameEs: "Desarrollo Digital",
      nameEn: "Digital Development",
      color: "#00d4ff",
      icon: "code",
    },
    {
      slug: "staffing",
      nameEs: "Staff Augmentation",
      nameEn: "Staff Augmentation",
      color: "#00e5a0",
      icon: "users",
    },
    { slug: "finops", nameEs: "FinOps", nameEn: "FinOps", color: "#f59e0b", icon: "dollar-sign" },
    {
      slug: "industria",
      nameEs: "Industria",
      nameEn: "Industry",
      color: "#64748b",
      icon: "factory",
    },
  ];

  for (const cat of categories) {
    const existingCat = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.slug, cat.slug))
      .limit(1);

    if (existingCat.length === 0) {
      await db.insert(blogCategories).values(cat);
    }
  }

  console.log("Seed completed");
}
