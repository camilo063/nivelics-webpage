import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { updateHistoriaItem, deleteHistoriaItem } from "@/lib/admin/actions/nosotros.actions";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const item = await updateHistoriaItem(id, body);
    return NextResponse.json(item);
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
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { id } = await params;
  await deleteHistoriaItem(id);
  return NextResponse.json({ success: true });
}
