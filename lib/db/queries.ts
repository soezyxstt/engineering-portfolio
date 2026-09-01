import { initDatabase } from "./index";

export interface FileRecord {
  id: string;
  slug: string;
  target_key: string;
  content_type: string;
  is_public: number;
  cache_control: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface FileAccessToken {
  token: string;
  file_slug: string;
  recipient_label: string | null;
  max_uses: number | null;
  use_count: number;
  expires_at: string;
  is_revoked: number;
  created_at: string;
}

export interface FileAccessLog {
  id: number;
  file_slug: string;
  token_used: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referer: string | null;
  accessed_at: string;
}

export interface AccessStats {
  totalRequests: number;
  uniqueFilesCount: number;
  topFiles: { file_slug: string; count: number }[];
  recentLogs: FileAccessLog[];
}

// ----------------------------------------------------
// File Operations
// ----------------------------------------------------

export async function getAllFiles(): Promise<FileRecord[]> {
  const db = await initDatabase();
  const res = await db.execute("SELECT * FROM files ORDER BY slug ASC;");
  return res.rows as unknown as FileRecord[];
}

export async function getFileBySlug(slug: string): Promise<FileRecord | null> {
  const db = await initDatabase();
  const res = await db.execute({
    sql: "SELECT * FROM files WHERE slug = ? LIMIT 1;",
    args: [slug],
  });
  if (res.rows.length === 0) return null;
  return res.rows[0] as unknown as FileRecord;
}

export async function upsertFile(file: {
  slug: string;
  target_key: string;
  content_type: string;
  is_public: boolean;
  cache_control?: string;
  description?: string;
}): Promise<FileRecord> {
  const db = await initDatabase();
  const now = new Date().toISOString();
  const existing = await getFileBySlug(file.slug);

  if (existing) {
    await db.execute({
      sql: `UPDATE files 
            SET target_key = ?, content_type = ?, is_public = ?, cache_control = ?, description = ?, updated_at = ?
            WHERE slug = ?;`,
      args: [
        file.target_key,
        file.content_type,
        file.is_public ? 1 : 0,
        file.cache_control ?? "public, max-age=3600",
        file.description ?? "",
        now,
        file.slug,
      ],
    });
    return (await getFileBySlug(file.slug))!;
  } else {
    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO files (id, slug, target_key, content_type, is_public, cache_control, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      args: [
        id,
        file.slug,
        file.target_key,
        file.content_type,
        file.is_public ? 1 : 0,
        file.cache_control ?? "public, max-age=3600",
        file.description ?? "",
        now,
        now,
      ],
    });
    return (await getFileBySlug(file.slug))!;
  }
}

export async function deleteFileBySlug(slug: string): Promise<boolean> {
  const db = await initDatabase();
  const res = await db.execute({
    sql: "DELETE FROM files WHERE slug = ?;",
    args: [slug],
  });
  return res.rowsAffected > 0;
}

// ----------------------------------------------------
// Token Operations
// ----------------------------------------------------

export async function createAccessToken(params: {
  file_slug: string;
  recipient_label?: string;
  max_uses?: number | null;
  expires_in_hours?: number;
}): Promise<FileAccessToken> {
  const db = await initDatabase();
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const now = new Date();
  const hours = params.expires_in_hours && params.expires_in_hours > 0 ? params.expires_in_hours : 168; // default 7 days
  const expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

  await db.execute({
    sql: `INSERT INTO file_access_tokens (token, file_slug, recipient_label, max_uses, use_count, expires_at, is_revoked, created_at)
          VALUES (?, ?, ?, ?, 0, ?, 0, ?);`,
    args: [
      token,
      params.file_slug,
      params.recipient_label ?? null,
      params.max_uses ?? null,
      expiresAt,
      now.toISOString(),
    ],
  });

  const res = await db.execute({
    sql: "SELECT * FROM file_access_tokens WHERE token = ? LIMIT 1;",
    args: [token],
  });
  return res.rows[0] as unknown as FileAccessToken;
}

export async function validateAndConsumeToken(tokenString: string, requestedSlug: string): Promise<{
  valid: boolean;
  reason?: string;
  token?: FileAccessToken;
}> {
  const db = await initDatabase();
  const res = await db.execute({
    sql: "SELECT * FROM file_access_tokens WHERE token = ? LIMIT 1;",
    args: [tokenString],
  });

  if (res.rows.length === 0) {
    return { valid: false, reason: "Token not found" };
  }

  const token = res.rows[0] as unknown as FileAccessToken;

  if (token.is_revoked === 1) {
    return { valid: false, reason: "Token has been revoked by owner", token };
  }

  if (token.file_slug !== requestedSlug) {
    return { valid: false, reason: "Token is not valid for this file", token };
  }

  const now = new Date();
  const expiresAt = new Date(token.expires_at);
  if (now > expiresAt) {
    return { valid: false, reason: "Token has expired", token };
  }

  if (token.max_uses !== null && token.use_count >= token.max_uses) {
    return { valid: false, reason: "Download limit exceeded for this token", token };
  }

  // Increment usage count
  await db.execute({
    sql: "UPDATE file_access_tokens SET use_count = use_count + 1 WHERE token = ?;",
    args: [tokenString],
  });

  return { valid: true, token };
}

export async function revokeToken(tokenString: string): Promise<boolean> {
  const db = await initDatabase();
  const res = await db.execute({
    sql: "UPDATE file_access_tokens SET is_revoked = 1 WHERE token = ?;",
    args: [tokenString],
  });
  return res.rowsAffected > 0;
}

export async function getAllTokens(): Promise<FileAccessToken[]> {
  const db = await initDatabase();
  const res = await db.execute("SELECT * FROM file_access_tokens ORDER BY created_at DESC;");
  return res.rows as unknown as FileAccessToken[];
}

// ----------------------------------------------------
// Analytics Operations
// ----------------------------------------------------

export async function logFileAccess(params: {
  file_slug: string;
  token_used?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
}): Promise<void> {
  try {
    const db = await initDatabase();
    // Simple SHA-256 IP hash for privacy
    let ipHash: string | null = null;
    if (params.ip) {
      const buffer = new TextEncoder().encode(params.ip + (process.env.FILE_SIGNING_SECRET || "salt"));
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      ipHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
    }

    await db.execute({
      sql: `INSERT INTO file_access_logs (file_slug, token_used, ip_hash, user_agent, referer, accessed_at)
            VALUES (?, ?, ?, ?, ?, ?);`,
      args: [
        params.file_slug,
        params.token_used ?? null,
        ipHash,
        params.userAgent?.slice(0, 255) ?? null,
        params.referer?.slice(0, 255) ?? null,
        new Date().toISOString(),
      ],
    });
  } catch (err) {
    console.error("Failed to log file access:", err);
  }
}

export async function getAccessStats(): Promise<AccessStats> {
  const db = await initDatabase();
  
  const totalRes = await db.execute("SELECT COUNT(*) as total FROM file_access_logs;");
  const totalRequests = Number(totalRes.rows[0]?.total ?? 0);

  const uniqueFilesRes = await db.execute("SELECT COUNT(DISTINCT file_slug) as uniqueCount FROM file_access_logs;");
  const uniqueFilesCount = Number(uniqueFilesRes.rows[0]?.uniqueCount ?? 0);

  const topRes = await db.execute(`
    SELECT file_slug, COUNT(*) as count 
    FROM file_access_logs 
    GROUP BY file_slug 
    ORDER BY count DESC 
    LIMIT 10;
  `);
  const topFiles = topRes.rows.map((row) => ({
    file_slug: String(row.file_slug),
    count: Number(row.count),
  }));

  const logsRes = await db.execute(`
    SELECT * FROM file_access_logs 
    ORDER BY accessed_at DESC 
    LIMIT 50;
  `);
  const recentLogs = logsRes.rows as unknown as FileAccessLog[];

  return {
    totalRequests,
    uniqueFilesCount,
    topFiles,
    recentLogs,
  };
}
