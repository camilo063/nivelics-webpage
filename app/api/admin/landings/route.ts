import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { getLandingPages, createLandingPage } from "@/lib/admin/actions/landings.actions";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalido" }, { status: 401 });

  const url = request.nextUrl;
  const page = parseInt(url.searchParams.get("page") || "1");
  const status = url.searchParams.get("status") || "all";

  const result = await getLandingPages({ page, status });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalido" }, { status: 401 });

  try {
    const body = await request.json();
    const landing = await createLandingPage(body);
    return NextResponse.json(landing, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al crear" },
      { status: 400 },
    );
  }
}
