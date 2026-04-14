import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3_BUCKET =
  process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME || "nivelics-media";
export const S3_REGION = process.env.AWS_REGION || "us-east-1";
// Always derive public URL from actual bucket name to avoid mismatches.
// Only use AWS_S3_PUBLIC_URL if it explicitly matches the bucket or is a CloudFront domain.
export const S3_PUBLIC_URL = (() => {
  const custom = process.env.AWS_S3_PUBLIC_URL;
  const defaultUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;
  if (!custom) return defaultUrl;
  // If custom URL contains the bucket name or is a CloudFront/CDN domain, use it
  if (custom.includes(S3_BUCKET) || (!custom.includes("s3.") && !custom.includes("s3-"))) {
    return custom;
  }
  // Mismatch: custom URL points to a different bucket — use derived URL
  return defaultUrl;
})();

let cachedClient: S3Client | null = null;

function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;
  cachedClient = new S3Client({
    region: S3_REGION,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
  return cachedClient;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function extensionFor(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

function sanitizeFolder(folder: string): string {
  return folder.replace(/[^a-zA-Z0-9-_/]/g, "").slice(0, 50) || "general";
}

export async function createPresignedUpload(input: {
  folder: string;
  contentType: string;
  sizeBytes?: number;
}): Promise<PresignedUploadResult> {
  if (!ALLOWED_MIME.has(input.contentType)) {
    throw new Error(`Unsupported content type: ${input.contentType}`);
  }
  if (input.sizeBytes && input.sizeBytes > MAX_SIZE) {
    throw new Error(`File too large. Max ${MAX_SIZE / 1024 / 1024}MB`);
  }

  const folder = sanitizeFolder(input.folder);
  const ext = extensionFor(input.contentType);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  const key = `${folder}/${timestamp}-${random}.${ext}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: input.contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = `${S3_PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl, key, expiresIn: 300 };
}

export function isS3Configured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}
