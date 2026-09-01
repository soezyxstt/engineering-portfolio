import { initDatabase } from "../lib/db/index";
import { 
  getAllFiles, 
  getFileBySlug, 
  createAccessToken, 
  validateAndConsumeToken, 
  revokeToken, 
  logFileAccess, 
  getAccessStats 
} from "../lib/db/queries";
import { fetchFileFromStorage } from "../lib/storage/r2";

async function runVerification() {
  console.log("==================================================");
  console.log("🧪 RUNNING FILE SERVER VERIFICATION SUITE");
  console.log("==================================================");

  // 1. Initialize Database & Seed
  console.log("\n1. Testing Database Initialization & Seeding...");
  const db = await initDatabase();
  if (!db) throw new Error("Failed to initialize database");
  const files = await getAllFiles();
  console.log(`✅ Database ready. Found ${files.length} registered files/aliases.`);
  if (files.length === 0) throw new Error("Seed files failed to populate.");

  // 2. Test File Alias Lookup
  console.log("\n2. Testing Alias Resolution (/f/resume.pdf)...");
  const resumeFile = await getFileBySlug("resume.pdf");
  if (!resumeFile) throw new Error("Failed to find resume.pdf in DB");
  console.log(`✅ Resolved "resume.pdf" -> "${resumeFile.target_key}"`);

  // 3. Test Storage Layer (Local Fallback for resume PDF)
  console.log("\n3. Testing Storage File Fetch & MIME detection...");
  const fileResult = await fetchFileFromStorage(resumeFile.target_key);
  if (!fileResult) throw new Error(`Failed to fetch file for target key: ${resumeFile.target_key}`);
  console.log(`✅ File fetched successfully.`);
  console.log(`   - Source: ${fileResult.source}`);
  console.log(`   - Content-Type: ${fileResult.contentType}`);
  console.log(`   - Size: ${fileResult.contentLength} bytes`);

  if (fileResult.contentType !== "application/pdf") {
    throw new Error(`Expected application/pdf, got ${fileResult.contentType}`);
  }

  // 4. Test Token Lifecycle (Creation, Multi-use limit, Revocation)
  console.log("\n4. Testing Private Token Lifecycle...");
  const token = await createAccessToken({
    file_slug: "resume.pdf",
    recipient_label: "Test HR Recruiter",
    expires_in_hours: 24,
    max_uses: 2,
  });
  console.log(`✅ Created token: ${token.token.slice(0, 16)}... for "${token.recipient_label}"`);

  // First use
  const use1 = await validateAndConsumeToken(token.token, "resume.pdf");
  if (!use1.valid) throw new Error(`Use 1 failed: ${use1.reason}`);
  console.log("✅ Token validation 1/2 succeeded.");

  // Second use
  const use2 = await validateAndConsumeToken(token.token, "resume.pdf");
  if (!use2.valid) throw new Error(`Use 2 failed: ${use2.reason}`);
  console.log("✅ Token validation 2/2 succeeded.");

  // Third use (should exceed limit)
  const use3 = await validateAndConsumeToken(token.token, "resume.pdf");
  if (use3.valid) throw new Error("Expected token to fail max_uses limit, but it passed.");
  console.log(`✅ Max-uses limit enforced successfully: "${use3.reason}"`);

  // Revocation test
  console.log("\n5. Testing Token Revocation...");
  const singleToken = await createAccessToken({
    file_slug: "resume.pdf",
    recipient_label: "Revocation Test",
    expires_in_hours: 24,
  });
  await revokeToken(singleToken.token);
  const revokeValidation = await validateAndConsumeToken(singleToken.token, "resume.pdf");
  if (revokeValidation.valid) throw new Error("Revoked token should not be valid.");
  console.log(`✅ Revoked token blocked successfully: "${revokeValidation.reason}"`);

  // 6. Test Analytics & Access Logging
  console.log("\n6. Testing Access Analytics Logging...");
  await logFileAccess({
    file_slug: "resume.pdf",
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0 Test Browser",
    referer: "https://linkedin.com",
  });
  await logFileAccess({
    file_slug: "automation-resume.pdf",
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0 Test Browser",
    referer: "https://github.com",
  });

  const stats = await getAccessStats();
  console.log(`✅ Analytics recorded: Total Requests = ${stats.totalRequests}, Unique Files = ${stats.uniqueFilesCount}`);
  if (stats.totalRequests < 2) throw new Error("Analytics log count mismatch");

  console.log("\n==================================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runVerification().catch((err) => {
  console.error("❌ VERIFICATION FAILED:", err);
  process.exit(1);
});
