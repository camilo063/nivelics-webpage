import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
const useFallbacks = process.env.USE_DB_FALLBACKS === "true";

if (useFallbacks) {
  console.log("[DB] Modo fallback activo — sin conexión a Neon");
}

export const db =
  !useFallbacks && databaseUrl
    ? drizzle(databaseUrl, { schema })
    : (null as unknown as ReturnType<typeof drizzle>);
