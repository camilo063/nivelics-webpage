import { connection } from "next/server";
import { getUsuarios } from "@/lib/admin/actions/usuarios.actions";
import UsuariosClient from "@/components/admin/forms/UsuariosClient";

export default async function UsuariosPage() {
  await connection();
  const usuarios = await getUsuarios();

  return <UsuariosClient initialUsers={usuarios} />;
}
