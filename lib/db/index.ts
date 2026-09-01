import { createClient, type Client } from "@libsql/client";
import { DEFAULT_FILES } from "@/data/default-files";

let clientInstance: Client | null = null;
let initialized = false;

export function getDbClient(): Client {
  if (!clientInstance) {
    const url = process.env.DATABASE_URL || "file:local.db";
    const authToken = process.env.DATABASE_AUTH_TOKEN;
    clientInstance = createClient({
      url,
      authToken,
    });
  }
  return clientInstance;
}

export async function initDatabase(): Promise<Client> {
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
