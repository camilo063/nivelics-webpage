import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import {
  createPresignedUpload,
  isS3Configured,
  S3_BUCKET,
  S3_REGION,
  S3_PUBLIC_URL,
} from "@/lib/admin/s3";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as fs from "fs/promises";
import * as path from "path";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function sanitizeFolder(folder: string): string {
  return folder.replace(/[^a-zA-Z0-9-_/]/g, "").slice(0, 50) || "general";
}

function extensionFor(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  return map[mime] || "bin";
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";

  // ─── Multipart upload (dev local + prod S3 via server) ─────
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = form.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file requerido" }, { status: 400 });
    }
    if (typeof folderRaw !== "string") {
      return NextResponse.json({ error: "folder requerido" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: `Tipo no soportado: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Archivo muy grande. Máx ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    const folder = sanitizeFolder(folderRaw);
    const ext = extensionFor(file.type);
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const filename = `${timestamp}-${random}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      if (isS3Configured()) {
        // ─── Production: upload to S3 ───
        const client = new S3Client({
          region: S3_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });
        const key = `${folder}/${filename}`;
        await client.send(
          new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            CacheControl: "public, max-age=31536000, immutable",
          }),
        );
        return NextResponse.json({
          url: `${S3_PUBLIC_URL}/${key}`,
          mode: "s3",
          key,
        });
      } else {
        // ─── Development: save to public/uploads ───
        const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        return NextResponse.json({
          url: `/uploads/${folder}/${filename}`,
          mode: "local",
          key: `${folder}/${filename}`,
        });
      }
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Error al subir" },
        { status: 500 },
      );
    }
  }

  // ─── JSON → presigned URL (prod, direct browser → S3) ─────
  try {
    const body = await request.json();
    const { folder, contentType: mimeType, sizeBytes } = body;

    if (!folder || typeof folder !== "string") {
      return NextResponse.json({ error: "folder requerido" }, { status: 400 });
    }
    if (!mimeType || typeof mimeType !== "string") {
      return NextResponse.json({ error: "contentType requerido" }, { status: 400 });
    }

    if (!isS3Configured()) {
      // Signal to client to use multipart mode instead
      return NextResponse.json({ mode: "local", message: "Use multipart upload" }, { status: 200 });
    }

    const result = await createPresignedUpload({
      folder,
      contentType: mimeType,
      sizeBytes: typeof sizeBytes === "number" ? sizeBytes : undefined,
    });

    return NextResponse.json({ ...result, mode: "s3" });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 });
  }
}
