// scripts/generateCertsList.js
// Run with: node scripts/generateCertsList.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certsDir = path.join(__dirname, "..", "public", "certs");
console.log("Looking in:", certsDir);

if (!fs.existsSync(certsDir)) {
  console.error("❌ public/certs directory not found.");
  process.exit(1);
}

const files = fs.readdirSync(certsDir).filter(f => {
  return f !== "thumbs" && f !== "certs.json";
}).map(f => {
  const ext = path.extname(f).toLowerCase().slice(1);
  return {
    file: `/certs/${f}`,
    id: f.replace(/\W+/g, "-").toLowerCase(),
    title: f.replace(/[-_]/g, " ").replace(/\.\w+$/, ""),
    kind: ext === "pdf" ? "pdf" : (["png","jpg","jpeg","gif","webp"].includes(ext) ? "image" : "other"),
  };
});

console.log("Found files:", files);

const out = path.join(certsDir, "certs.json");
fs.writeFileSync(out, JSON.stringify(files, null, 2));
console.log(`✅ Wrote ${out} with ${files.length} entries.`);
