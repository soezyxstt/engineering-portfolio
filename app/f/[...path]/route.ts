import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { getFileBySlug, logFileAccess } from "@/lib/db/queries";
import { fetchFileFromStorage } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("File path required", { status: 400 });
    }

    const requestedSlug = pathSegments.join("/");
    const filename = path.basename(requestedSlug);

    // 1. Check if slug exists in DB registry
    const fileRecord = await getFileBySlug(requestedSlug);

    if (fileRecord && fileRecord.is_public === 0) {
      return new NextResponse(
        "Forbidden: This file is private and requires a valid access token. Use /private/... with ?token=...",
        { status: 403 }
      );
    }

    const targetKey = fileRecord ? fileRecord.target_key : requestedSlug;
    const cacheControl =
      fileRecord?.cache_control ||
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

    // 2. Fetch file from R2 or local storage
    const fileResult = await fetchFileFromStorage(targetKey);

    if (!fileResult) {
      return new NextResponse(`File not found: ${requestedSlug}`, { status: 404 });
    }

    // 3. Fire-and-forget access log
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");

    logFileAccess({
      file_slug: requestedSlug,
      ip,
      userAgent,
      referer,
    }).catch((err) => console.error("Access log error:", err));

    // 4. Construct Response Headers
    const headers = new Headers();
    headers.set("Content-Type", fileResult.contentType);
    headers.set("Content-Disposition", `inline; filename="${encodeURIComponent(filename)}"`);
    headers.set("Cache-Control", cacheControl);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-File-Source", fileResult.source);

    if (fileResult.contentLength !== undefined) {
      headers.set("Content-Length", fileResult.contentLength.toString());
    }
    if (fileResult.etag) {
      headers.set("ETag", fileResult.etag);
    }
    if (fileResult.lastModified) {
      headers.set("Last-Modified", fileResult.lastModified);
    }

    return new Response(fileResult.body as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Public file delivery error:", err);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
