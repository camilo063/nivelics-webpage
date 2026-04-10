import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import {
  getLandingPage,
  updateLandingPage,
  deleteLandingPage,
} from "@/lib/admin/actions/landings.actions";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalido" }, { status: 401 });

  const { id } = await params;
  const landing = await getLandingPage(id);

  if (!landing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(landing);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalido" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const landing = await updateLandingPage(id, body);
    return NextResponse.json(landing);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al actualizar" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalido" }, { status: 401 });

  const { id } = await params;
  await deleteLandingPage(id);
  return NextResponse.json({ success: true });
}
