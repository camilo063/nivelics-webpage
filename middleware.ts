import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback-dev-secret-change-in-production",
);

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — handle auth protection (skip i18n)
  if (pathname.startsWith("/admin")) {
    // Allow login page and auth API without token
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
      return NextResponse.next();
    }

    // Check JWT cookie
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const valid = await verifyAdminToken(token);
    if (!valid) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.next();
  }

  // Admin API routes — skip i18n
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // All other routes — apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api/(?!admin)|_next|_vercel|.*\\..*).*)", "/admin/:path*", "/api/admin/:path*"],
};
