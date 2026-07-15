import { analyzeExtractedText } from "@/lib/parsing/course-analysis";
import { parseMarkdownTranscript } from "@/lib/markdownTableParser";

export async function POST(req: Request) {
  const body = await req.json();
  const markdown = String(body.markdown ?? "");
  const text = String(body.text ?? "");

  const source = markdown || text;
  const courses = markdown ? parseMarkdownTranscript(markdown) : [];
  const analysis = analyzeExtractedText(source);
  return Response.json({
    markdown,
    text,
    courses: courses.length ? courses : analysis.courses,
    totalCredits: courses.length ? courses.reduce((sum, c) => sum + c.credits, 0) : analysis.totalCredits,
    aiRelevantCourses: courses.length ? courses.filter((c) => /인공지능|머신러닝|딥러닝|데이터사이언스|자연어처리/i.test(c.name)) : analysis.aiRelevantCourses,
    warnings: analysis.warnings
  });
}
