import { 
  getAllFiles, 
  getAllTokens, 
  createAccessToken, 
  revokeToken, 
  getAccessStats 
} from "../lib/db/queries";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help") {
    console.log(`
Personal File Server CLI
=========================
Commands:
  bun ./scripts/file-cli.ts list
    -> List all registered file aliases and target keys

  bun ./scripts/file-cli.ts token <slug> [recipient-label] [hours-valid] [max-downloads]
    -> Create a shareable signed URL for a file
    -> Example: bun ./scripts/file-cli.ts token resume.pdf "Google HR" 168 5

  bun ./scripts/file-cli.ts tokens
    -> List all active and past access tokens

  bun ./scripts/file-cli.ts revoke <token>
    -> Revoke an access token immediately

  bun ./scripts/file-cli.ts stats
    -> View access analytics and top file metrics
`);
    return;
  }

  if (command === "list") {
    const files = await getAllFiles();
    console.log(`\nRegistered Files & Aliases (${files.length}):`);
    console.log("------------------------------------------------------------------");
    files.forEach((f) => {
      const type = f.is_public ? "[PUBLIC]" : "[PRIVATE]";
      console.log(`${type} /f/${f.slug.padEnd(28)} -> ${f.target_key}`);
      if (f.description) console.log(`        Description: ${f.description}`);
    });
    console.log("");
    return;
  }

  if (command === "token") {
    const slug = args[1];
    if (!slug) {
      console.error("Error: Please specify the file slug (e.g. resume.pdf)");
      process.exit(1);
    }
    const label = args[2] || "Recruiter";
    const hours = args[3] ? parseInt(args[3], 10) : 168; // default 7 days
    const maxUses = args[4] ? parseInt(args[4], 10) : null;

    const token = await createAccessToken({
      file_slug: slug,
      recipient_label: label,
      expires_in_hours: hours,
      max_uses: maxUses,
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const shareUrl = `${origin}/private/${slug}?token=${token.token}`;

    console.log("\n=======================================================");
    console.log("✅ ACCESS TOKEN GENERATED SUCCESSFULLY");
    console.log("=======================================================");
    console.log(`Recipient:   ${label}`);
    console.log(`Target:      /private/${slug}`);
    console.log(`Expires:     ${new Date(token.expires_at).toLocaleString()}`);
    console.log(`Max Uses:    ${maxUses ? maxUses : "Unlimited"}`);
    console.log(`Token Key:   ${token.token}`);
    console.log("-------------------------------------------------------");
    console.log(`Shareable URL:`);
    console.log(`👉 ${shareUrl}`);
    console.log("=======================================================\n");
    return;
  }

  if (command === "tokens") {
    const tokens = await getAllTokens();
    console.log(`\nGenerated Access Tokens (${tokens.length}):`);
    console.log("------------------------------------------------------------------");
    tokens.forEach((t) => {
      const isExpired = new Date() > new Date(t.expires_at);
      let status = "ACTIVE";
      if (t.is_revoked === 1) status = "REVOKED";
      else if (isExpired) status = "EXPIRED";
      else if (t.max_uses !== null && t.use_count >= t.max_uses) status = "LIMIT MET";

      console.log(`[${status}] ${t.recipient_label || "No Label"} -> /private/${t.file_slug}`);
      console.log(`  Token:    ${t.token}`);
      console.log(`  Usage:    ${t.use_count} / ${t.max_uses ?? "∞"}`);
      console.log(`  Expires:  ${new Date(t.expires_at).toLocaleDateString()}`);
      console.log("");
    });
    return;
  }

  if (command === "revoke") {
    const token = args[1];
    if (!token) {
      console.error("Error: Please provide the token string to revoke");
      process.exit(1);
    }
    const revoked = await revokeToken(token);
    if (revoked) {
      console.log(`✅ Token ${token} successfully revoked.`);
    } else {
      console.log(`❌ Token ${token} not found or already revoked.`);
    }
    return;
  }

  if (command === "stats") {
    const stats = await getAccessStats();
    console.log("\n=======================================================");
    console.log("📊 FILE SERVER ACCESS ANALYTICS");
    console.log("=======================================================");
    console.log(`Total Requests:       ${stats.totalRequests}`);
    console.log(`Unique Files Served:  ${stats.uniqueFilesCount}`);
    console.log("-------------------------------------------------------");
    console.log("Top Accessed Files:");
    if (stats.topFiles.length === 0) {
      console.log("  (No access requests recorded yet)");
    } else {
      stats.topFiles.forEach((top, idx) => {
        console.log(`  ${idx + 1}. /f/${top.file_slug.padEnd(25)} -> ${top.count} views`);
      });
    }
    console.log("-------------------------------------------------------");
    console.log(`Recent Requests (Last ${Math.min(stats.recentLogs.length, 10)}):`);
    if (stats.recentLogs.length === 0) {
      console.log("  (No recent logs)");
    } else {
      stats.recentLogs.slice(0, 10).forEach((log) => {
        const token = log.token_used ? `(Token: ${log.token_used.slice(0, 6)}...)` : "(Public)";
        console.log(`  ${new Date(log.accessed_at).toLocaleTimeString()} - /f/${log.file_slug} ${token}`);
      });
    }
    console.log("=======================================================\n");
    return;
  }

  console.log("Unknown command. Run `bun ./scripts/file-cli.ts help` for usage.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
