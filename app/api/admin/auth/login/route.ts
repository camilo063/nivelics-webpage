import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, seedInitialAdmin } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }

    // Seed initial admin on first login attempt
    await seedInitialAdmin();

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const response = NextResponse.json({
      user: result.user,
    });

    // Set httpOnly cookie with JWT
    response.cookies.set("admin_token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.ADMIN_SESSION_DURATION || "604800", 10),
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
