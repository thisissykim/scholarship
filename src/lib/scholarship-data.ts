import fs from "node:fs";
import path from "node:path";
import type { ScholarshipEligibility } from "@/types/scholarship";

const dir = path.join(process.cwd(), "data", "scholarships");

export function loadScholarships(): ScholarshipEligibility[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as ScholarshipEligibility);
}
