import assert from "node:assert/strict";

// Run against a local server: node scripts/check-motion.mjs http://localhost:3003
const base = process.argv[2] ?? "http://localhost:3003";
for (const path of ["/", "/work/tampiloka", "/about", "/resume"]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} must render`);
  const html = await response.text();
  assert.match(html, /<main[^>]+id="main-content"/, `${path} must retain its main landmark`);
  assert.match(html, /<h1[ >]/, `${path} must render readable content before JavaScript`);
  assert.doesNotMatch(html, /class="motion-ready"/, "Server content must not depend on animation to become visible");
  if (path === "/") {
    const triggers = [...html.matchAll(/<button[^>]+aria-expanded="(true|false)"[^>]+aria-controls="([^"]+-panel-\d+)"/g)];
    assert.ok(triggers.length > 1, "Capability disclosures must render accessible triggers");
    assert.equal(triggers.filter(([, expanded]) => expanded === "true").length, 1);
    for (const [, , id] of triggers) assert.ok(html.includes(`id="${id}" role="region"`), `Missing disclosure panel ${id}`);
    assert.match(html, /aria-haspopup="dialog"/, "Project previews must retain native dialog access");
  }
}
console.log("Motion route and disclosure checks passed.");
