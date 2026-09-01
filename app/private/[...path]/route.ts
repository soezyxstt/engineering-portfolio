import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { getFileBySlug, validateAndConsumeToken, logFileAccess } from "@/lib/db/queries";
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
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "A valid access token is required to access private documents (?token=...)",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 1. Validate and consume token in DB
    const validation = await validateAndConsumeToken(token, requestedSlug);
    if (!validation.valid) {
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden",
          message: validation.reason || "Invalid access token",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Resolve file record or target key
    const fileRecord = await getFileBySlug(requestedSlug);
    const targetKey = fileRecord ? fileRecord.target_key : requestedSlug;

    // 3. Fetch file from R2 or local disk
    const fileResult = await fetchFileFromStorage(targetKey);

    if (!fileResult) {
      return new NextResponse(`Private file not found: ${requestedSlug}`, { status: 404 });
    }

    // 4. Log access
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");

    logFileAccess({
      file_slug: requestedSlug,
      token_used: token,
      ip,
      userAgent,
      referer,
    }).catch((err) => console.error("Access log error:", err));

    // 5. Construct Strict Private Headers (No Caching, No Indexing)
    const headers = new Headers();
    headers.set("Content-Type", fileResult.contentType);
    headers.set("Content-Disposition", `inline; filename="${encodeURIComponent(filename)}"`);
    headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate, max-age=0");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-File-Source", fileResult.source);

    if (fileResult.contentLength !== undefined) {
      headers.set("Content-Length", fileResult.contentLength.toString());
    }

    return new Response(fileResult.body as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Private file delivery error:", err);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
