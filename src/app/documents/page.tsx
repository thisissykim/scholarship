"use client";

import { useMemo, useState } from "react";
import { analyzeExtractedText } from "@/lib/parsing/course-analysis";
import { preprocessImageForOcr } from "@/lib/parsing/image-preprocess";
import { demoStudent, scholarships } from "@/lib/mock-data";
import { mergeAnalysisIntoStudent, saveStoredProfile } from "@/lib/student-store";
import { evaluateEligibility, sortByMatch } from "@/lib/matching/evaluateEligibility";
import { getStoredProfile } from "@/lib/student-store";

type ParsedCourse = { name: string; credits: number; aiRelevant: boolean };
type AnalysisResult = { fileName: string; extractedText: string; courses: ParsedCourse[]; totalCredits: number; aiRelevantCourses: ParsedCourse[]; warnings: string[] };

const aiKeywords = ["인공지능", "머신러닝", "딥러닝", "데이터마이닝", "컴퓨터비전", "자연어처리"];

async function fileToPayload(file: File) {
  const fileType = file.type || file.name.split(".").pop() || "";
  const isText = fileType.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".csv") || file.name.endsWith(".json");
  if (isText) return { fileName: file.name, fileType, text: await file.text(), base64: "" };
  const bytes = new Uint8Array(await file.arrayBuffer());
  return { fileName: file.name, fileType, text: "", base64: btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join("")) };
}

async function ocrImage(file: File) {
  const { createWorker } = await import("tesseract.js");
  const optimized = await preprocessImageForOcr(file);
  const worker = await createWorker("eng+kor");
  try {
    const { data } = await worker.recognize(optimized);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export default function DocumentsPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const profile = useMemo(() => getStoredProfile(), []);
  const mergedStudent = useMemo(() => (analysis ? mergeAnalysisIntoStudent(demoStudent, analysis) : profile ?? demoStudent), [analysis, profile]);

  const recommended = useMemo(() => {
    return scholarships
      .map((s) => ({ ...s, evaluated: evaluateEligibility(mergedStudent, s.rules) }))
      .sort(sortByMatch)
      .slice(0, 3);
  }, [mergedStudent]);

  const uploadAndAnalyze = async (file?: File | null) => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      let result: AnalysisResult;
      if (file.type.startsWith("image/")) {
        result = { fileName: file.name, ...analyzeExtractedText(await ocrImage(file)) };
      } else {
        const payload = await fileToPayload(file);
        const response = await fetch("/api/documents/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("분석 요청에 실패했어요.");
        result = (await response.json()) as AnalysisResult;
      }

      setAnalysis(result);
      const profilePayload = {
        ...mergeAnalysisIntoStudent(demoStudent, result),
        name: mergedStudent.name,
        studentId: mergedStudent.studentId,
        email: mergedStudent.email
      };
      saveStoredProfile(profilePayload);
      await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          analysis: result,
          student: profilePayload
        })
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 처리 중 문제가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base px-4 py-6 text-white md:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-border pb-4">
          <div className="text-xl font-bold">SKKU <span className="text-brand">Scholarship</span> Mate</div>
          <p className="mt-2 text-secondary">성적증명서, 이수과목표, PDF 텍스트 파일을 업로드하면 과목과 학점을 자동 분석합니다.</p>
        </header>
        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-panel border border-border bg-surface p-6 shadow-heavy">
            <div className="mb-4">
              <div className="text-sm font-bold tracking-[1.6px] text-brand">DOCUMENT INGESTION</div>
              <h1 className="mt-3 text-4xl font-bold">파일을 올리면 과목과 학점을 자동으로 읽습니다.</h1>
              <p className="mt-3 text-secondary">업로드 후 별도 체크 없이 총 이수학점과 AI 관련 과목을 자동 추출해서 장학금 매칭에 반영할 수 있어요.</p>
            </div>
            <label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-border-light bg-surface-alt p-6 text-center transition hover:border-brand hover:bg-card">
              <input type="file" accept=".pdf,.txt,.csv,.json,.png,.jpg,.jpeg" className="hidden" onChange={(e) => uploadAndAnalyze(e.target.files?.[0])} />
              <div className="text-lg font-semibold">성적증명서 / 이수과목 파일 업로드</div>
              <div className="mt-2 text-sm text-secondary">PDF, TXT, CSV, 이미지 파일을 받아 처리합니다. 텍스트 파일은 즉시, PDF와 이미지는 OCR까지 시도합니다.</div>
              <div className="mt-5 rounded-pill bg-brand px-5 py-3 text-sm font-bold uppercase tracking-[1.6px] text-black">Upload file</div>
            </label>
            <div className="mt-5 rounded-card border border-border bg-card p-4 text-sm text-secondary">AI 관련 과목 키워드: {aiKeywords.join(", ")}.</div>
            {loading && <p className="mt-4 text-warning">분석 중이에요. 잠시만 기다려주세요.</p>}
            {error && <p className="mt-4 text-negative">{error}</p>}
          </div>
          <div className="space-y-4">
            <div className="rounded-card border border-border bg-surface p-5 shadow-medium">
              <div className="text-sm font-bold tracking-[1.6px] text-brand">SUMMARY</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-card bg-surface-alt p-4"><div className="text-secondary">총 이수학점</div><div className="mt-1 text-3xl font-bold">{analysis ? analysis.totalCredits : mergedStudent.totalCredits}</div></div>
                <div className="rounded-card bg-surface-alt p-4"><div className="text-secondary">AI 관련 과목</div><div className="mt-1 text-3xl font-bold">{analysis ? analysis.aiRelevantCourses.length : profile?.uploadedAnalysis?.aiRelevantCourses.length ?? 0}</div></div>
              </div>
            </div>
            <div className="rounded-card border border-border bg-surface p-5 shadow-medium">
              <div className="text-sm font-bold tracking-[1.6px] text-brand">AUTO DETECTED</div>
              <div className="mt-4 space-y-3">
                {analysis?.courses?.length ? analysis.courses.map((course) => (
                  <div key={`${course.name}-${course.credits}`} className="flex items-center justify-between rounded-card bg-surface-alt px-4 py-3">
                    <div><div className="font-semibold">{course.name}</div><div className="text-sm text-secondary">{course.credits}학점</div></div>
                    <span className={`rounded-badge px-2 py-1 text-[10.5px] font-semibold ${course.aiRelevant ? "bg-brand text-black" : "bg-surface text-secondary"}`}>{course.aiRelevant ? "AI 관련" : "일반 과목"}</span>
                  </div>
                )) : <div className="rounded-card bg-surface-alt p-4 text-secondary">아직 분석된 과목이 없어요.</div>}
              </div>
            </div>
            <div className="rounded-card border border-border bg-surface p-5 shadow-medium">
              <div className="text-sm font-bold tracking-[1.6px] text-brand">RECOMMENDED SCHOLARSHIPS</div>
              <div className="mt-4 space-y-3">
                {recommended.map((item) => (
                  <div key={item.id} className="rounded-card bg-surface-alt p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{item.name}</div>
                      <span className="rounded-badge bg-brand px-2 py-1 text-[10.5px] font-semibold text-black">{item.evaluated.status.toLowerCase()}</span>
                    </div>
                    <div className="mt-2 text-sm text-secondary">{item.evaluated.results.find((r) => !r.satisfied)?.reason ?? "모든 조건을 충족했어요"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-card border border-border bg-surface p-5 shadow-medium">
              <div className="text-sm font-bold tracking-[1.6px] text-brand">WARNINGS</div>
              <div className="mt-4 space-y-2">
                {analysis?.warnings?.length ? analysis.warnings.map((warn) => <div key={warn} className="rounded-card bg-surface-alt p-3 text-sm text-warning">{warn}</div>) : <div className="rounded-card bg-surface-alt p-3 text-sm text-secondary">업로드 후 분석 결과가 여기에 표시됩니다.</div>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
