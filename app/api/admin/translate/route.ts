import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  // Verify auth
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, sourceField, contentType } = body;

    if (!text) {
      return NextResponse.json({ error: "El texto es requerido" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurada" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `You are a professional translator for Nivelics, a B2B technology company specializing in AI, Cloud, Staff Augmentation, and Digital Development, based in Bogota, Colombia and Miami, FL.

Translate the following Spanish text to English. Maintain the professional, technical tone appropriate for a B2B technology company website. Keep any HTML tags, markdown formatting, or special characters as-is. Do not add explanations — return ONLY the translated text.

Context: This is the "${sourceField}" field of a "${contentType}" content type on the nivelics.com website.

Text to translate:
${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Error de traducción" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const translation = data.content?.[0]?.type === "text" ? data.content[0].text : "";

    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
