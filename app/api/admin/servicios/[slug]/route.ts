import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { getServicio, updateServicio, deleteServicio } from "@/lib/admin/actions/servicios.actions";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { slug } = await params;
  const servicio = await getServicio(slug);

  if (!servicio) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(servicio);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  try {
    const { slug } = await params;
    const body = await request.json();
    const servicio = await updateServicio(slug, body);
    return NextResponse.json(servicio);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al actualizar" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  try {
    const { slug } = await params;
    await deleteServicio(slug);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al eliminar" },
      { status: 400 },
    );
  }
}
