import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const CSV_PATH = join(process.cwd(), "docs/seo/legacy-urls-gsc-2026-04-12.csv");
const OUT_DIR = join(process.cwd(), "docs/seo/buckets");

const csv = readFileSync(CSV_PATH, "utf-8").trim().split("\n").slice(1);

type Row = { url: string; path: string; lastCrawl: string };
const rows: Row[] = csv.map((line) => {
  const [url, lastCrawl] = line.split(",");
  let path = url.replace(/^https?:\/\/[^/]+/, "");
  if (path === "") path = "/";
  return { url, path, lastCrawl };
});

const buckets: Record<string, Row[]> = {
  home: [],
  "blog-es": [],
  "blog-en": [],
  "servicios-es": [],
  "servicios-en": [],
  "casos-es": [],
  "casos-en": [],
  "nosotros-es": [],
  "nosotros-en": [],
  contacto: [],
  "es-legacy": [],
  "external-subdomain": [],
  huerfanas: [],
};

for (const row of rows) {
  const { url, path } = row;

  if (url.startsWith("https://ai.nivelics.com")) {
    buckets["external-subdomain"].push(row);
    continue;
  }

  if (path === "/" || path === "/en" || path === "/en/") {
    buckets["home"].push(row);
    continue;
  }

  if (path.startsWith("/es/")) {
    buckets["es-legacy"].push(row);
    continue;
  }

  if (path.startsWith("/en/blog/") || path === "/en/blogs") {
    buckets["blog-en"].push(row);
    continue;
  }
  if (path.startsWith("/blog/")) {
    buckets["blog-es"].push(row);
    continue;
  }

  if (path.startsWith("/en/services/")) {
    buckets["servicios-en"].push(row);
    continue;
  }
  if (path.startsWith("/servicios/") || path === "/servicios") {
    buckets["servicios-es"].push(row);
    continue;
  }

  if (path.startsWith("/en/success-stories")) {
    buckets["casos-en"].push(row);
    continue;
  }
  if (path.startsWith("/casos-de-exito")) {
    buckets["casos-es"].push(row);
    continue;
  }

  if (path === "/en/about-us" || path === "/en/how-do-we-work" || path === "/en/timeline") {
    buckets["nosotros-en"].push(row);
    continue;
  }
  if (path === "/quienes-somos" || path === "/como-trabajamos" || path === "/linea-del-tiempo") {
    buckets["nosotros-es"].push(row);
    continue;
  }

  if (path === "/contacto" || path === "/en/contact-us-at") {
    buckets["contacto"].push(row);
    continue;
  }

  buckets["huerfanas"].push(row);
}

mkdirSync(OUT_DIR, { recursive: true });

let totalBucketed = 0;
const summary: string[] = [];
for (const [name, items] of Object.entries(buckets)) {
  const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));
  const lines = sorted.map((r) => `${r.path}\t${r.lastCrawl}`);
  writeFileSync(join(OUT_DIR, `${name}.txt`), lines.join("\n") + "\n");
  summary.push(`  ${name.padEnd(22)} ${items.length}`);
  totalBucketed += items.length;
}

console.log(`Total rows parsed: ${rows.length}`);
console.log(`Total bucketed:    ${totalBucketed}`);
console.log("");
console.log("Bucket counts:");
summary.forEach((s) => console.log(s));

if (buckets["huerfanas"].length > 0) {
  console.log("\nHuérfanas:");
  buckets["huerfanas"].forEach((r) => console.log(`  ${r.path}`));
}
