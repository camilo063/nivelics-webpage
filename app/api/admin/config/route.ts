import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { getSiteConfig, updateSiteConfig } from "@/lib/admin/actions/config.actions";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const config = await getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  try {
    const body = await request.json();
    await updateSiteConfig(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 });
  }
}
