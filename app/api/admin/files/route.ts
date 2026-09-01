import { NextRequest, NextResponse } from "next/server";
import {
  getAllFiles,
  upsertFile,
  deleteFileBySlug,
  getAllTokens,
  createAccessToken,
  revokeToken,
  getAccessStats,
} from "@/lib/db/queries";

export const runtime = "nodejs";

function verifyAdminAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "adi-admin-2026";
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("authorization");
  const cookiePass = request.cookies.get("admin_session")?.value;

  if (authHeader && (authHeader === adminPassword || authHeader === `Bearer ${adminPassword}`)) {
    return true;
  }
  if (cookiePass && cookiePass === adminPassword) {
    return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [files, tokens, stats] = await Promise.all([
      getAllFiles(),
      getAllTokens(),
      getAccessStats(),
    ]);

    return NextResponse.json({
      files,
      tokens,
      stats,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Login action doesn't require prior auth
    if (action === "login") {
      const adminPassword = process.env.ADMIN_PASSWORD || "adi-admin-2026";
      const { password } = body;
      if (password === adminPassword) {
        const response = NextResponse.json({ success: true, message: "Authenticated successfully" });
        response.cookies.set("admin_session", adminPassword, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
        return response;
      }
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // All other actions require admin auth
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("admin_session");
      return response;
    }

    if (action === "upsert_file") {
      const { slug, target_key, content_type, is_public, cache_control, description } = body;
      if (!slug || !target_key) {
        return NextResponse.json({ error: "slug and target_key are required" }, { status: 400 });
      }
      const saved = await upsertFile({
        slug,
        target_key,
        content_type: content_type || "application/pdf",
        is_public: is_public ?? true,
        cache_control,
        description,
      });
      return NextResponse.json({ success: true, file: saved });
    }

    if (action === "delete_file") {
      const { slug } = body;
      if (!slug) {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
      }
      const deleted = await deleteFileBySlug(slug);
      return NextResponse.json({ success: deleted });
    }

    if (action === "create_token") {
      const { file_slug, recipient_label, max_uses, expires_in_hours } = body;
      if (!file_slug) {
        return NextResponse.json({ error: "file_slug is required" }, { status: 400 });
      }
      const token = await createAccessToken({
        file_slug,
        recipient_label,
        max_uses: max_uses ? Number(max_uses) : null,
        expires_in_hours: expires_in_hours ? Number(expires_in_hours) : 168,
      });
      return NextResponse.json({ success: true, token });
    }

    if (action === "revoke_token") {
      const { token } = body;
      if (!token) {
        return NextResponse.json({ error: "token is required" }, { status: 400 });
      }
      const revoked = await revokeToken(token);
      return NextResponse.json({ success: revoked });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
