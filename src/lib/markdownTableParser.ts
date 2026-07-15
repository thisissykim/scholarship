import type { Course } from "@/types/scholarship";

export function parseMarkdownTranscript(markdown: string): Course[] {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  const tableLines = lines.filter((line) => /^\|.*\|$/.test(line));
  if (!tableLines.length) return [];

  const rows = tableLines
    .filter((line) => !/^\|[\s:-]+\|/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean));

  const header = rows.find((row) => row.some((cell) => /과목|학점|성적/.test(cell))) ?? [];
  const idx = {
    name: header.findIndex((h) => /과목|교과목/.test(h)),
    credits: header.findIndex((h) => /학점/.test(h)),
    category: header.findIndex((h) => /이수구분|구분|형태/.test(h)),
    grade: header.findIndex((h) => /성적|등급/.test(h)),
    code: header.findIndex((h) => /코드/.test(h))
  };

  return rows
    .filter((row) => row.length >= 2 && row !== header)
    .map((row) => ({
      name: row[idx.name] ?? row[0] ?? "",
      credits: Number.parseFloat(row[idx.credits] ?? "0") || 0,
      category: row[idx.category] || undefined,
      grade: row[idx.grade] || undefined,
      code: row[idx.code] || undefined
    }))
    .filter((course) => course.name && course.credits > 0);
}
