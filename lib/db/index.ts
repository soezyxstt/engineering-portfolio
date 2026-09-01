import { createClient, type Client as LibsqlClient } from "@libsql/client";
import { DEFAULT_FILES } from "@/data/default-files";

export interface DbQueryResult {
  rows: Record<string, unknown>[];
  rowsAffected: number;
}

export interface GenericDbClient {
  execute(query: string | { sql: string; args?: unknown[] }): Promise<DbQueryResult>;
}

// -------------------------------------------------------------------
// 1. Cloudflare D1 HTTP Client Adapter
// -------------------------------------------------------------------
class CloudflareD1Client implements GenericDbClient {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;

  constructor(accountId: string, databaseId: string, apiToken: string) {
    this.accountId = accountId;
    this.databaseId = databaseId;
    this.apiToken = apiToken;
  }

  async execute(query: string | { sql: string; args?: unknown[] }): Promise<DbQueryResult> {
    const sql = typeof query === "string" ? query : query.sql;
    const params = typeof query === "string" ? [] : query.args || [];

    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudflare D1 Query Failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    if (!data.success) {
      const msg = data.errors?.map((e: { message: string }) => e.message).join(", ") || "Unknown D1 error";
      throw new Error(`Cloudflare D1 Error: ${msg}`);
    }

    const firstResult = data.result?.[0];
    return {
      rows: firstResult?.results || [],
      rowsAffected: firstResult?.meta?.changes || 0,
    };
  }
}

// -------------------------------------------------------------------
// 2. LibSQL / SQLite Client Adapter (Local or Turso)
// -------------------------------------------------------------------
class LibsqlDbClientAdapter implements GenericDbClient {
  private client: LibsqlClient;

  constructor(url: string, authToken?: string) {
    this.client = createClient({
      url,
      authToken,
    });
  }

  async execute(query: string | { sql: string; args?: unknown[] }): Promise<DbQueryResult> {
    const sql = typeof query === "string" ? query : query.sql;
    const args = typeof query === "string" ? [] : query.args || [];
    const res = await this.client.execute({ sql, args: args as any });
    return {
      rows: res.rows as unknown as Record<string, unknown>[],
      rowsAffected: res.rowsAffected,
    };
  }
}

let dbInstance: GenericDbClient | null = null;
let initialized = false;

export function getDbClient(): GenericDbClient {
  if (dbInstance) return dbInstance;

  const url = process.env.DATABASE_URL || "file:local.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  const accountId = process.env.R2_ACCOUNT_ID;
  const d1DatabaseId = process.env.D1_DATABASE_ID;

  // Check if configured for Cloudflare D1
  if ((url.includes("api.cloudflare.com") || d1DatabaseId) && accountId && authToken) {
    const dbId = d1DatabaseId || url.split("/database/")[1]?.split("/")[0]?.split("?")[0];
    if (dbId) {
      dbInstance = new CloudflareD1Client(accountId, dbId, authToken);
      return dbInstance;
    }
  }

  // Fallback to LibSQL / SQLite (file:local.db or Turso)
  dbInstance = new LibsqlDbClientAdapter(url, authToken);
  return dbInstance;
}

export async function initDatabase(): Promise<GenericDbClient> {
  const db = getDbClient();
  if (initialized) return db;

  // Create tables if they do not exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      target_key TEXT NOT NULL,
      content_type TEXT NOT NULL,
      is_public INTEGER NOT NULL DEFAULT 1,
      cache_control TEXT,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS file_access_tokens (
      token TEXT PRIMARY KEY,
      file_slug TEXT NOT NULL,
      recipient_label TEXT,
      max_uses INTEGER,
      use_count INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT NOT NULL,
      is_revoked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS file_access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_slug TEXT NOT NULL,
      token_used TEXT,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
      accessed_at TEXT NOT NULL
    );
  `);

  // Seed default files if table is empty
  const countResult = await db.execute("SELECT COUNT(*) as count FROM files;");
  const count = Number(countResult.rows[0]?.count ?? 0);

  if (count === 0) {
    const now = new Date().toISOString();
    for (const file of DEFAULT_FILES) {
      const id = crypto.randomUUID();
      await db.execute({
        sql: `INSERT OR IGNORE INTO files (id, slug, target_key, content_type, is_public, cache_control, description, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          file.slug,
          file.targetKey,
          file.contentType,
          file.isPublic ? 1 : 0,
          file.cacheControl || "public, max-age=3600",
          file.description,
          now,
          now,
        ],
      });
    }
  }

  initialized = true;
  return db;
}
