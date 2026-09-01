import { createClient, type Client as LibsqlClient } from "@libsql/client/web";
import { DEFAULT_FILES } from "@/data/default-files";

export interface DbQueryResult {
  rows: Record<string, unknown>[];
  rowsAffected: number;
}

export interface GenericDbClient {
  execute(query: string | { sql: string; args?: unknown[] }): Promise<DbQueryResult>;
}

// -------------------------------------------------------------------
// 1. Cloudflare D1 HTTP Client Adapter (REST API)
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
    const rawSql = typeof query === "string" ? query : query.sql;
    const params = typeof query === "string" ? [] : query.args || [];
    const sql = rawSql.trim();

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
// 2. LibSQL / Turso Web Client Adapter (Pure JS HTTP/WebSocket)
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

// -------------------------------------------------------------------
// 3. In-Memory Mock Fallback Client (Zero Native Dependencies)
// -------------------------------------------------------------------
class InMemoryDbClient implements GenericDbClient {
  private files: Map<string, Record<string, unknown>> = new Map();
  private tokens: Map<string, Record<string, unknown>> = new Map();
  private logs: Array<Record<string, unknown>> = [];

  constructor() {
    const now = new Date().toISOString();
    for (const f of DEFAULT_FILES) {
      this.files.set(f.slug, {
        id: crypto.randomUUID(),
        slug: f.slug,
        target_key: f.targetKey,
        content_type: f.contentType,
        is_public: f.isPublic ? 1 : 0,
        cache_control: f.cacheControl || "public, max-age=3600",
        description: f.description,
        created_at: now,
        updated_at: now,
      });
    }
  }

  async execute(query: string | { sql: string; args?: unknown[] }): Promise<DbQueryResult> {
    const sql = (typeof query === "string" ? query : query.sql).trim();
    const args = (typeof query === "string" ? [] : query.args || []) as any[];

    // CREATE TABLE -> No-op
    if (/^CREATE\s+TABLE/i.test(sql)) {
      return { rows: [], rowsAffected: 0 };
    }

    // SELECT COUNT(*) as count FROM files
    if (/SELECT\s+COUNT\(\*\)\s+as\s+count\s+FROM\s+files/i.test(sql)) {
      return { rows: [{ count: this.files.size }], rowsAffected: 0 };
    }

    // SELECT * FROM files ORDER BY slug ASC
    if (/SELECT\s+\*\s+FROM\s+files\s+ORDER\s+BY\s+slug/i.test(sql)) {
      const rows = Array.from(this.files.values()).sort((a, b) =>
        String(a.slug).localeCompare(String(b.slug))
      );
      return { rows, rowsAffected: 0 };
    }

    // SELECT * FROM files WHERE slug = ? LIMIT 1
    if (/SELECT\s+\*\s+FROM\s+files\s+WHERE\s+slug\s*=\s*\?/i.test(sql)) {
      const slug = args[0];
      const file = this.files.get(slug);
      return { rows: file ? [file] : [], rowsAffected: 0 };
    }

    // INSERT OR IGNORE INTO files OR INSERT INTO files
    if (/INSERT\s+(OR\s+IGNORE\s+)?INTO\s+files/i.test(sql)) {
      const [id, slug, target_key, content_type, is_public, cache_control, description, created_at, updated_at] = args;
      if (!this.files.has(slug) || !/OR\s+IGNORE/i.test(sql)) {
        this.files.set(slug, {
          id: id || crypto.randomUUID(),
          slug,
          target_key,
          content_type,
          is_public,
          cache_control,
          description,
          created_at: created_at || new Date().toISOString(),
          updated_at: updated_at || new Date().toISOString(),
        });
        return { rows: [], rowsAffected: 1 };
      }
      return { rows: [], rowsAffected: 0 };
    }

    // UPDATE files SET ... WHERE slug = ?
    if (/UPDATE\s+files\s+SET/i.test(sql)) {
      const [target_key, content_type, is_public, cache_control, description, updated_at, slug] = args;
      const existing = this.files.get(slug);
      if (existing) {
        this.files.set(slug, {
          ...existing,
          target_key,
          content_type,
          is_public,
          cache_control,
          description,
          updated_at,
        });
        return { rows: [], rowsAffected: 1 };
      }
      return { rows: [], rowsAffected: 0 };
    }

    // DELETE FROM files WHERE slug = ?
    if (/DELETE\s+FROM\s+files\s+WHERE\s+slug\s*=\s*\?/i.test(sql)) {
      const slug = args[0];
      const deleted = this.files.delete(slug);
      return { rows: [], rowsAffected: deleted ? 1 : 0 };
    }

    // INSERT INTO file_access_tokens
    if (/INSERT\s+INTO\s+file_access_tokens/i.test(sql)) {
      const [token, file_slug, recipient_label, max_uses, expires_at, created_at] = args;
      this.tokens.set(token, {
        token,
        file_slug,
        recipient_label,
        max_uses,
        use_count: 0,
        expires_at,
        is_revoked: 0,
        created_at,
      });
      return { rows: [], rowsAffected: 1 };
    }

    // SELECT * FROM file_access_tokens WHERE token = ?
    if (/SELECT\s+\*\s+FROM\s+file_access_tokens\s+WHERE\s+token\s*=\s*\?/i.test(sql)) {
      const tokenStr = args[0];
      const token = this.tokens.get(tokenStr);
      return { rows: token ? [token] : [], rowsAffected: 0 };
    }

    // SELECT * FROM file_access_tokens ORDER BY created_at DESC
    if (/SELECT\s+\*\s+FROM\s+file_access_tokens/i.test(sql)) {
      const rows = Array.from(this.tokens.values()).sort(
        (a, b) => new Date(String(b.created_at)).getTime() - new Date(String(a.created_at)).getTime()
      );
      return { rows, rowsAffected: 0 };
    }

    // UPDATE file_access_tokens SET use_count = use_count + 1 WHERE token = ?
    if (/UPDATE\s+file_access_tokens\s+SET\s+use_count\s*=\s*use_count\s*\+\s*1/i.test(sql)) {
      const tokenStr = args[0];
      const token = this.tokens.get(tokenStr);
      if (token) {
        token.use_count = ((token.use_count as number) || 0) + 1;
        return { rows: [], rowsAffected: 1 };
      }
      return { rows: [], rowsAffected: 0 };
    }

    // UPDATE file_access_tokens SET is_revoked = 1 WHERE token = ?
    if (/UPDATE\s+file_access_tokens\s+SET\s+is_revoked\s*=\s*1/i.test(sql)) {
      const tokenStr = args[0];
      const token = this.tokens.get(tokenStr);
      if (token) {
        token.is_revoked = 1;
        return { rows: [], rowsAffected: 1 };
      }
      return { rows: [], rowsAffected: 0 };
    }

    // INSERT INTO file_access_logs
    if (/INSERT\s+INTO\s+file_access_logs/i.test(sql)) {
      const [file_slug, token_used, ip_hash, user_agent, referer, accessed_at] = args;
      this.logs.unshift({
        id: this.logs.length + 1,
        file_slug,
        token_used,
        ip_hash,
        user_agent,
        referer,
        accessed_at,
      });
      return { rows: [], rowsAffected: 1 };
    }

    // SELECT COUNT(*) as total FROM file_access_logs
    if (/SELECT\s+COUNT\(\*\)\s+as\s+total\s+FROM\s+file_access_logs/i.test(sql)) {
      return { rows: [{ total: this.logs.length }], rowsAffected: 0 };
    }

    // SELECT COUNT(DISTINCT file_slug) as uniqueCount FROM file_access_logs
    if (/SELECT\s+COUNT\(DISTINCT\s+file_slug\)\s+as\s+uniqueCount\s+FROM\s+file_access_logs/i.test(sql)) {
      const unique = new Set(this.logs.map((l) => l.file_slug)).size;
      return { rows: [{ uniqueCount: unique }], rowsAffected: 0 };
    }

    // SELECT file_slug, COUNT(*) as count FROM file_access_logs GROUP BY file_slug
    if (/SELECT\s+file_slug,\s*COUNT\(\*\)\s+as\s+count\s+FROM\s+file_access_logs/i.test(sql)) {
      const counts: Record<string, number> = {};
      for (const log of this.logs) {
        const slug = String(log.file_slug);
        counts[slug] = (counts[slug] || 0) + 1;
      }
      const sorted = Object.entries(counts)
        .map(([file_slug, count]) => ({ file_slug, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      return { rows: sorted, rowsAffected: 0 };
    }

    // SELECT * FROM file_access_logs ORDER BY accessed_at DESC
    if (/SELECT\s+\*\s+FROM\s+file_access_logs/i.test(sql)) {
      return { rows: this.logs.slice(0, 50), rowsAffected: 0 };
    }

    return { rows: [], rowsAffected: 0 };
  }
}

let dbInstance: GenericDbClient | null = null;
let initialized = false;

export function getDbClient(): GenericDbClient {
  if (dbInstance) return dbInstance;

  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID ||
    process.env.R2_ACCOUNT_ID ||
    process.env.D1_ACCOUNT_ID ||
    process.env.ACCOUNT_ID;

  const d1DatabaseId =
    process.env.D1_DATABASE_ID ||
    process.env.CLOUDFLARE_D1_DATABASE_ID ||
    process.env.CLOUDFLARE_DATABASE_ID ||
    process.env.DATABASE_ID;

  const apiToken =
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.CLOUDFLARE_D1_API_TOKEN ||
    process.env.D1_API_TOKEN ||
    process.env.DATABASE_AUTH_TOKEN ||
    process.env.TURSO_AUTH_TOKEN;

  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;

  // 1. Cloudflare D1 (HTTP REST API)
  if ((d1DatabaseId || url?.includes("api.cloudflare.com")) && accountId && apiToken) {
    const dbId = d1DatabaseId || url?.split("/database/")[1]?.split("/")[0]?.split("?")[0];
    if (dbId) {
      dbInstance = new CloudflareD1Client(accountId, dbId, apiToken);
      return dbInstance;
    }
  }

  // 2. LibSQL / Turso remote (libsql://, https://, http://, wss://)
  if (url && (url.startsWith("libsql://") || url.startsWith("https://") || url.startsWith("http://") || url.startsWith("wss://"))) {
    dbInstance = new LibsqlDbClientAdapter(url, apiToken);
    return dbInstance;
  }

  // 3. Fallback in-memory client
  dbInstance = new InMemoryDbClient();
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
