"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredProfile, type StoredProfile } from "@/lib/student-store";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const aiCourses = useMemo(() => profile?.uploadedAnalysis?.aiRelevantCourses ?? [], [profile]);

  return (
    <main className="min-h-screen bg-base p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">내 정보 관리</h1>
        <p className="mt-3 text-secondary">업로드된 파일 분석 결과가 여기에 반영됩니다.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-card bg-surface p-5">
            <div className="text-secondary">총 이수학점</div>
            <div className="mt-2 text-3xl font-bold">{profile?.totalCredits ?? "없음"}</div>
          </div>
          <div className="rounded-card bg-surface p-5">
            <div className="text-secondary">직전 학기 이수학점</div>
            <div className="mt-2 text-3xl font-bold">{profile?.creditsLastSem ?? "없음"}</div>
          </div>
          <div className="rounded-card bg-surface p-5">
            <div className="text-secondary">AI 관련 과목</div>
            <div className="mt-2 text-3xl font-bold">{aiCourses.length}</div>
          </div>
        </div>

        <div className="mt-6 rounded-panel border border-border bg-surface p-5">
          <div className="text-sm font-bold tracking-[1.6px] text-brand">UPLOADED ANALYSIS</div>
          <div className="mt-4 space-y-2">
            {aiCourses.length ? aiCourses.map((course) => (
              <div key={`${course.name}-${course.credits}`} className="rounded-card bg-surface-alt p-4">
                <div className="font-semibold">{course.name}</div>
                <div className="text-sm text-secondary">{course.credits}학점 · AI 관련</div>
              </div>
            )) : <div className="rounded-card bg-surface-alt p-4 text-secondary">아직 업로드된 분석 결과가 없어요.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
