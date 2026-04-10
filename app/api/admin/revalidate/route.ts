import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path, scope } = body;

    if (scope === "all") {
      revalidatePath("/", "layout");
      return NextResponse.json({ revalidated: true, scope: "all", timestamp: Date.now() });
    }

    if (!path) {
      return NextResponse.json({ error: "Path or scope is required" }, { status: 400 });
    }

    // Revalidate both ES and EN versions
    revalidatePath(path);
    revalidatePath(`/en${path}`);

    return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
