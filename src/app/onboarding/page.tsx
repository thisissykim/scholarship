"use client";

import { useMemo, useRef, useState } from "react";
import { PillButton } from "@/components/ui";
import { useRouter } from "next/navigation";
import { preprocessImageForOcr } from "@/lib/parsing/image-preprocess";
import { analyzeExtractedText } from "@/lib/parsing/course-analysis";
import { mergeAnalysisIntoStudent, saveStoredProfile } from "@/lib/student-store";
import { demoStudent } from "@/lib/mock-data";
import MinimalFollowUpForm from "@/components/MinimalFollowUpForm";
import { inferOnboardingFromCourses } from "@/lib/onboardingInference";
import { matchAllScholarships } from "@/lib/scholarshipMatcher";
import { scholarshipBank } from "@/lib/scholarship-bank";

const colleges = ["인문사회과학캠퍼스", "자연과학캠퍼스", "학부과정(계열제)", "예술대학", "글로벌융합"];
const departmentsByCollege: Record<string, string[]> = {
  인문사회과학캠퍼스: ["경영학과", "경제학과", "국어국문학과", "영어영문학과", "독어독문학과", "불어불문학과", "중어중문학과", "사학과", "철학과", "유학동양학과", "심리학과", "사회학과", "정치외교학과", "행정학과", "신문방송학과", "교육학과", "한문교육과", "수학교육과", "가정교육과", "아동학과"],
  자연과학캠퍼스: ["수학과", "물리학과", "화학과", "생명과학과", "전자전기공학부", "건축학과", "기계공학부", "신소재공학부", "화학공학과", "고분자공학과", "시스템경영공학과", "건설환경공학부", "컴퓨터교육과", "소프트웨어학과", "반도체시스템공학과"],
  "학부과정(계열제)": ["자유전공계열", "인문계열", "사회과학계열", "자연과학계열", "공학계열", "예체능계열"],
  예술대학: ["의상학과", "영상학과", "미술학과", "무용학과", "연기예술학과", "디자인학과"],
  글로벌융합: ["글로벌경영학과", "글로벌경제학과", "소프트웨어학과", "융합생명공학과", "글로벌리더학부", "자유전공학부"]
};

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [grade, setGrade] = useState(1);
  const [college, setCollege] = useState(colleges[0]);
  const [uploadState, setUploadState] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeExtractedText> | null>(null);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "",
    enrollmentStatus: "REGULAR",
    gpa: "",
    creditsLastSem: "",
    incomeQuintile: "",
    nationalScholarshipApplied: false,
    activity: ""
  });

  const departmentOptions = departmentsByCollege[college] ?? [];
  const canSubmit = useMemo(() => form.name && form.studentId && form.email && form.department && form.gpa && form.creditsLastSem, [form]);
  const inference = analysis ? inferOnboardingFromCourses(analysis.courses) : null;
  const matchResults = analysis ? matchAllScholarships(analysis.courses, Number(form.gpa || demoStudent.gpa), scholarshipBank) : [];

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

  async function handleUpload(file?: File | null) {
    if (!file) return;
    setUploadFileName(file.name);
    setUploadState("업로드한 파일을 분석 중이에요...");
    try {
      let analysis;
      if (file.type.startsWith("image/")) {
        analysis = analyzeExtractedText(await ocrImage(file));
      } else {
        const text = await file.text();
        const response = await fetch("/api/parse-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        const parsed = await response.json();
        analysis = {
          extractedText: text,
          courses: parsed.courses ?? [],
          totalCredits: parsed.totalCredits ?? 0,
          aiRelevantCourses: parsed.aiRelevantCourses ?? [],
          warnings: parsed.warnings ?? []
        };
      }
      setAnalysis(analysis);
      saveStoredProfile(mergeAnalysisIntoStudent(demoStudent, { fileName: file.name, ...analysis }));
      setUploadState(`분석 완료: 총 ${analysis.totalCredits}학점, AI 관련 ${analysis.aiRelevantCourses.length}과목`);
    } catch {
      setUploadState("파일 분석에 실패했어요. 서류함에서 다시 시도해 주세요.");
    }
  }

  return (
    <main className="min-h-screen bg-base px-4 py-6 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <div className="text-xl font-bold">SKKU <span className="text-brand">Scholarship</span> Mate</div>
          <div className="text-sm text-secondary">성균관대 맞춤 장학금 추천</div>
        </header>

        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-bold tracking-[1.8px] text-brand">● SCHOLARSHIP MATCHING, MADE CLEAR</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">온보딩 질문을 먼저 입력하고, 내게 맞는 장학금을 바로 확인해요.</h1>
          <p className="mt-4 max-w-2xl text-secondary">홈 화면에서도 질문이 바로 보이도록 카드형으로 배치하고, 학년·단과대학·학과는 토글 중심으로 고르게 구성했어요.</p>

          <form className="mt-8 rounded-panel border border-border bg-surface p-6 shadow-heavy md:p-8">
            <div className="grid gap-6">
              <section className="rounded-card bg-card p-5">
                <div className="mb-4 text-sm font-bold tracking-[1.6px] text-brand">BASIC INFO</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="rounded-input border border-border bg-surface-alt px-4 py-3 text-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="이름을 입력해주세요." />
                  <input className="rounded-input border border-border bg-surface-alt px-4 py-3 text-white" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="학번을 입력해주세요." />
                  <input className="rounded-input border border-border bg-surface-alt px-4 py-3 text-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="이메일을 입력해주세요." />
                  <input className="rounded-input border border-border bg-surface-alt px-4 py-3 text-white" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} placeholder="평점을 입력해주세요." />
                </div>
              </section>

              <section className="rounded-card bg-card p-5">
                <div className="mb-4 text-sm font-bold tracking-[1.6px] text-brand">ACADEMIC PATH</div>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-sm text-secondary">학년을 선택해주세요.</div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((g) => <PillButton key={g} type="button" active={grade === g} onClick={() => setGrade(g)}>{g}학년</PillButton>)}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-secondary">단과대학을 선택해주세요.</div>
                    <div className="flex flex-wrap gap-2">
                      {colleges.map((item) => <PillButton key={item} type="button" active={college === item} onClick={() => { setCollege(item); setForm({ ...form, department: "" }); }}>{item === "자연과학캠퍼스" ? "자과캠" : item}</PillButton>)}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-secondary">학과를 선택해주세요.</div>
                    <div className="flex flex-wrap gap-2">
                      {departmentOptions.map((dept) => <PillButton key={dept} type="button" tone="default" onClick={() => setForm({ ...form, department: dept })} active={form.department === dept}>{dept}</PillButton>)}
                    </div>
                    <p className="mt-2 text-sm text-secondary">학부과정(계열제)은 1학년 흐름을 고려해 별도 토글로 넣어뒀어요.</p>
                  </div>
                </div>
              </section>

              <section className="rounded-card bg-card p-5">
                <div className="mb-4 text-sm font-bold tracking-[1.6px] text-brand">DOCUMENT UPLOAD</div>
                <div className="rounded-card border border-dashed border-border-light bg-surface-alt p-5">
                  <div className="text-sm text-secondary">성적증명서 / 이수과목 내역서를 올리면 바로 과목과 학점을 읽어서 저장합니다. 업로드 버튼을 누르면 파일 선택 창이 열려요.</div>
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt,.csv,.json,.png,.jpg,.jpeg" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 inline-flex rounded-pill bg-brand px-5 py-3 text-sm font-bold uppercase tracking-[1.6px] text-black">
                    파일 업로드
                  </button>
                  {uploadFileName ? <p className="mt-3 text-sm text-secondary">선택한 파일: {uploadFileName}</p> : null}
                  {uploadState ? <p className="mt-3 text-sm text-secondary">{uploadState}</p> : null}
                </div>
                {inference ? <div className="mt-4"><MinimalFollowUpForm missing={inference.missing} inferredGrade={inference.inferredGrade} /></div> : null}
              </section>

              <section className="rounded-card bg-card p-5">
                <div className="mb-4 text-sm font-bold tracking-[1.6px] text-brand">DETAILS</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="rounded-input border border-border bg-surface-alt px-4 py-3 text-white" value={form.creditsLastSem} onChange={(e) => setForm({ ...form, creditsLastSem: e.target.value })} placeholder="직전 학기 이수학점을 입력해주세요." />
                  <input className="rounded-input border border-border bg-surface-alt px-4 py-3 text-white" value={form.incomeQuintile} onChange={(e) => setForm({ ...form, incomeQuintile: e.target.value })} placeholder="소득분위를 입력해주세요." />
                  <label className="flex items-center gap-3 rounded-input border border-border bg-surface-alt px-4 py-3">
                    <input type="checkbox" checked={form.nationalScholarshipApplied} onChange={(e) => setForm({ ...form, nationalScholarshipApplied: e.target.checked })} />
                    국가장학금 신청 완료
                  </label>
                  <textarea className="min-h-28 rounded-input border border-border bg-surface-alt px-4 py-3 text-white md:col-span-2" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} placeholder="활동 정보를 입력해주세요." />
                </div>
              </section>

              <section className="rounded-card bg-card p-5">
                <div className="mb-4 text-sm font-bold tracking-[1.6px] text-brand">ACTIONS</div>
                <div className="flex flex-wrap gap-2">
                  {["REGULAR","LEAVE_OF_ABSENCE","EXCESS_SEMESTER","EXCHANGE"].map((s) => <PillButton key={s} type="button" active={form.enrollmentStatus === s} onClick={() => setForm({ ...form, enrollmentStatus: s })}>{s}</PillButton>)}
                </div>
              </section>
            </div>

            <div className="mt-8">
              {matchResults.length ? (
                <div className="mb-4 rounded-card border border-border bg-surface p-4">
                  <div className="text-sm font-bold tracking-[1.6px] text-brand">MATCH PREVIEW</div>
                  <div className="mt-3 grid gap-2">
                    {matchResults.map((item) => (
                      <div key={item.scholarshipId} className="rounded-card bg-surface-alt p-3 text-sm text-secondary">
                        {item.scholarshipName} - {item.eligible ? "충족" : "미충족"}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <button type="button" onClick={() => router.push("/onboarding/result")} disabled={!canSubmit} className="w-full rounded-pill bg-brand px-6 py-4 text-sm font-bold uppercase tracking-[1.6px] text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-secondary">맞춤 장학금 찾기 →</button>
              <p className="mt-3 text-sm text-secondary">입력한 정보는 언제든 프로필에서 수정할 수 있어요.</p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
