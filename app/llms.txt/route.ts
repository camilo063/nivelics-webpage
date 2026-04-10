import { NextResponse } from "next/server";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import * as fs from "fs";
import * as path from "path";

export const revalidate = 86400;

export async function GET() {
  try {
    const config = await getSiteConfigPublic();
    if (config?.llmsTxtContent) {
      return new NextResponse(config.llmsTxtContent, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  } catch {
    // fallback
  }

  // Fallback to static file
  try {
    const filePath = path.join(process.cwd(), "public", "llms.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("# Nivelics\n> B2B Digital Transformation", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
