"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { demoStudent } from "@/lib/mock-data";
import { getStoredProfile } from "@/lib/student-store";
import { StatusBadge } from "@/components/ui";
import { scholarshipBank } from "@/lib/scholarship-bank";
import { matchAllScholarships } from "@/lib/scholarshipMatcher";
import type { Course } from "@/types/scholarship";

export default function ScholarshipsPage() {
  const [credits, setCredits] = useState(demoStudent.totalCredits);
  const [gpa, setGpa] = useState(demoStudent.gpa);
  const [national, setNational] = useState(demoStudent.nationalScholarshipApplied);
  const [courses, setCourses] = useState<Course[]>(
    demoStudent.majors.map((major) => ({ name: major, credits: 3, category: "전공", code: major }))
  );

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile) {
      setCredits(profile.totalCredits ?? profile.creditsLastSem ?? credits);
      setGpa(profile.gpa ?? gpa);
      setNational(profile.nationalScholarshipApplied ?? national);
      if (profile.uploadedAnalysis?.courses?.length) {
        setCourses(
          profile.uploadedAnalysis.courses.map((course) => ({
            name: course.name,
            credits: course.credits,
            category: course.aiRelevant ? "AI" : "일반",
            code: course.name,
            grade: course.grade
          }))
        );
      }
    }
  }, []);

  const data = useMemo(() => {
    return matchAllScholarships(courses, gpa, scholarshipBank).sort((a, b) => Number(b.eligible) - Number(a.eligible));
  }, [credits, gpa, national]);

  return (
    <main className="min-h-screen bg-base p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">장학금 탐색</h1>
        <div className="mt-4 rounded-panel border border-border bg-surface p-5">
          <div className="text-sm font-bold tracking-[1.6px] text-brand">MATCHING CONTROLS</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-secondary">총 이수학점</span>
              <input className="rounded-input border border-border bg-surface-alt px-4 py-3" value={credits} onChange={(e) => setCredits(Number(e.target.value || 0))} type="number" />
            </label>
            <label className="grid gap-2">
              <span className="text-secondary">평점</span>
              <input className="rounded-input border border-border bg-surface-alt px-4 py-3" value={gpa} onChange={(e) => setGpa(Number(e.target.value || 0))} type="number" step="0.01" />
            </label>
            <label className="grid gap-2">
              <span className="text-secondary">국가장학금 신청</span>
              <select className="rounded-input border border-border bg-surface-alt px-4 py-3" value={String(national)} onChange={(e) => setNational(e.target.value === "true")}>
                <option value="true">신청함</option>
                <option value="false">아직 안 함</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {data.map((s) => (
            <Link key={s.scholarshipId} href={`/scholarships/${s.scholarshipId}`} className="rounded-card border border-border bg-surface p-5 transition hover:bg-card">
              <StatusBadge status={s.eligible ? "ELIGIBLE" : "INELIGIBLE"} />
              <div className="mt-3 text-lg font-bold">{s.scholarshipName}</div>
              <div className="text-sm text-secondary">{s.matchedCourses.length}개 과목 매칭</div>
              <div className="mt-3 text-sm text-secondary">{s.reasons.join(" · ")}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
