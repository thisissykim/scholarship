import type { ParsedCourse } from "@/lib/types";

const aiKeywords = ["인공지능", "머신러닝", "딥러닝", "데이터마이닝", "컴퓨터비전", "자연어처리", "AI", "Machine Learning", "Deep Learning", "NLP"];

export function extractTextFromPdfLikeBytes(bytes: Uint8Array) {
  const text = new TextDecoder("latin1", { fatal: false }).decode(bytes);
  const chunks = [...text.matchAll(/\(([^()]{2,120})\)/g)].map((m) => m[1]).join("\n");
  const ascii = [...text.matchAll(/([A-Za-z0-9\u3131-\u318E\uAC00-\uD7A3][A-Za-z0-9\u3131-\u318E\uAC00-\uD7A3 \-\/]{3,80})/g)].map((m) => m[1]).join("\n");
  return [chunks, ascii].filter(Boolean).join("\n");
}

export function parseCoursesFromText(extractedText: string) {
  const lines = extractedText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const courses: ParsedCourse[] = [];

  for (const line of lines) {
    const creditMatch = line.match(/(\d(?:\.\d)?)\s*학점|(\d(?:\.\d)?)/);
    const credits = creditMatch ? Number(creditMatch[1] ?? creditMatch[2]) : NaN;
    if (!Number.isFinite(credits) || credits <= 0 || credits > 6) continue;

    const name = line
      .replace(/(\d(?:\.\d)?)\s*학점/g, "")
      .replace(/^\d+\s*/, "")
      .trim()
      .slice(0, 80);

    if (name.length < 2) continue;

    const aiRelevant = aiKeywords.some((keyword) => name.toLowerCase().includes(keyword.toLowerCase()));
    courses.push({ name, credits, aiRelevant });
  }

  return dedupeCourses(courses);
}

function dedupeCourses(courses: ParsedCourse[]) {
  const seen = new Set<string>();
  return courses.filter((course) => {
    const key = `${course.name}-${course.credits}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function analyzeExtractedText(extractedText: string) {
  const courses = parseCoursesFromText(extractedText);
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const aiRelevantCourses = courses.filter((course) => course.aiRelevant);
  const warnings: string[] = [];

  if (!courses.length) warnings.push("과목명과 학점을 안정적으로 찾지 못했어요. 원본 PDF가 스캔본이면 OCR이 필요할 수 있어요.");
  if (!aiRelevantCourses.length) warnings.push("AI 관련 과목은 아직 감지되지 않았어요.");

  return { extractedText, courses, totalCredits, aiRelevantCourses, warnings };
}
