import { NextResponse } from "next/server";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import * as fs from "fs";
import * as path from "path";

export const revalidate = 86400;

export async function GET() {
  try {
    const config = await getSiteConfigPublic();
    if (config?.llmsFullTxtContent) {
      return new NextResponse(config.llmsFullTxtContent, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  } catch {
    // fallback
  }

  try {
    const filePath = path.join(process.cwd(), "public", "llms-full.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("# Nivelics — Full Documentation", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
