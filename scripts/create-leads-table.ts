import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre varchar(255) NOT NULL,
      empresa varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      servicio varchar(100),
      fuente varchar(100) NOT NULL,
      status varchar(50) NOT NULL DEFAULT 'nuevo',
      mensaje text,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS leads_fuente_idx ON leads(fuente)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC)`);
  console.log("Table leads created");
  process.exit(0);
}

main().catch(console.error);
