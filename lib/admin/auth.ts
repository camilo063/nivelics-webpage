import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema/admin";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback-dev-secret-change-in-production",
);
const SESSION_DURATION = parseInt(process.env.ADMIN_SESSION_DURATION || "604800", 10);

export interface AdminJWTPayload {
  sub: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  iat: number;
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: {
  sub: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; email: string; name: string; role: string; mustChangePassword: boolean };
  error?: string;
}> {
  if (!db) return { success: false, error: "Database not configured" };

  const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (user.length === 0) {
    return { success: false, error: "Credenciales incorrectas" };
  }

  const adminUser = user[0];

  if (!adminUser.isActive) {
    return { success: false, error: "Cuenta desactivada" };
  }

  const valid = await verifyPassword(password, adminUser.passwordHash);
  if (!valid) {
    return { success: false, error: "Credenciales incorrectas" };
  }

  // Update last login
  await db.update(adminUsers).set({ lastLogin: new Date() }).where(eq(adminUsers.id, adminUser.id));

  const token = await createToken({
    sub: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  });

  return {
    success: true,
    token,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      mustChangePassword: adminUser.mustChangePassword,
    },
  };
}

export async function seedInitialAdmin(): Promise<void> {
  if (!db) return;

  const email = process.env.ADMIN_INITIAL_EMAIL || "admin@nivelics.com";
  const password = process.env.ADMIN_INITIAL_PASSWORD || "NivelicsAdmin2026!";

  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (existing.length > 0) return;

  const passwordHash = await hashPassword(password);

  await db.insert(adminUsers).values({
    email,
    passwordHash,
    name: "Admin Nivelics",
    role: "admin",
    isActive: true,
    mustChangePassword: true,
  });
}
