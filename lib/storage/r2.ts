import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

let s3Client: S3Client | null = null;

export function getR2Client(): S3Client | null {
  if (s3Client) return s3Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (accountId && accessKeyId && secretAccessKey) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return s3Client;
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".glb": "model/gltf-binary",
    ".gltf": "model/gltf+json",
    ".json": "application/json",
    ".zip": "application/zip",
    ".txt": "text/plain; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
  };
  return mimeMap[ext] || "application/octet-stream";
}

export interface FileStreamResult {
  body: ReadableStream | Uint8Array;
  contentType: string;
  contentLength?: number;
  etag?: string;
  lastModified?: string;
  source: "r2" | "local";
}

export async function fetchFileFromStorage(targetKey: string): Promise<FileStreamResult | null> {
  const bucketName = process.env.R2_BUCKET_NAME;
  const client = getR2Client();

  // Clean targetKey (remove leading slash if present)
  const normalizedKey = targetKey.replace(/^\/+/, "");

  // 1. Try Cloudflare R2 if configured
  if (client && bucketName) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: normalizedKey,
      });
      const response = await client.send(command);

      if (response.Body) {
        let webStream: ReadableStream | Uint8Array;
        if (typeof response.Body.transformToWebStream === "function") {
          webStream = response.Body.transformToWebStream();
        } else if (typeof response.Body.transformToByteArray === "function") {
          webStream = await response.Body.transformToByteArray();
        } else {
          const nodeStream = response.Body as unknown as Readable;
          webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
        }

        return {
          body: webStream,
          contentType: response.ContentType || getMimeType(normalizedKey),
          contentLength: response.ContentLength,
          etag: response.ETag,
          lastModified: response.LastModified ? response.LastModified.toUTCString() : undefined,
          source: "r2",
        };
      }
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      if (error.name !== "NoSuchKey" && error.name !== "NotFound") {
        console.warn(`R2 fetch warning for key "${normalizedKey}":`, error.message);
      }
    }
  }

  // 2. Fallback to local public/ directory
  try {
    const publicDir = path.join(process.cwd(), "public");
    const localFilePath = path.join(publicDir, normalizedKey);

    // Prevent directory traversal
    const relative = path.relative(publicDir, localFilePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return null;
    }

    if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
      const stats = fs.statSync(localFilePath);
      const fileBuffer = fs.readFileSync(localFilePath);

      return {
        body: fileBuffer,
        contentType: getMimeType(localFilePath),
        contentLength: stats.size,
        lastModified: stats.mtime.toUTCString(),
        source: "local",
      };
    }
  } catch (localErr) {
    console.warn(`Local fallback error for key "${normalizedKey}":`, localErr);
  }

  return null;
}
