import { analyzeExtractedText, extractTextFromPdfLikeBytes } from "@/lib/parsing/course-analysis";

export async function POST(req: Request) {
  const body = await req.json();
  const fileName = String(body.fileName ?? "document");
  const fileType = String(body.fileType ?? "");
  const text = String(body.text ?? "");
  const base64 = String(body.base64 ?? "");

  let extractedText = text;
  if (!extractedText && base64) {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    extractedText = fileType.includes("pdf") ? extractTextFromPdfLikeBytes(bytes) : new TextDecoder().decode(bytes);
  }

  const analysis = analyzeExtractedText(extractedText);

  return Response.json({
    fileName,
    ...analysis
  });
}
