"use client";

export default function MinimalFollowUpForm({ missing, inferredGrade }: { missing: string[]; inferredGrade?: number }) {
  if (!missing.length) return null;
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="text-sm font-bold tracking-[1.6px] text-brand">FOLLOW UP</div>
      <div className="mt-3 text-secondary">{missing.includes("department") ? "학과 정보만 추가로 확인해 주세요." : "추가 확인 항목이 있어요."}</div>
      {typeof inferredGrade === "number" ? <div className="mt-2 text-sm text-secondary">추정 학년: {inferredGrade}학년</div> : null}
    </div>
  );
}
