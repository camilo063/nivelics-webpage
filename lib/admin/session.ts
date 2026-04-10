import { cookies } from "next/headers";
import { verifyToken, type AdminJWTPayload } from "./auth";

export async function getAdminSession(): Promise<AdminJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
