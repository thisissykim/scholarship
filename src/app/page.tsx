import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-base text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold tracking-[1.8px] text-brand">SCHOLARSHIP MATCHING, MADE CLEAR</p>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            성균관대 학생을 위한
            <span className="block text-brand">장학금 비서</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-secondary">학적, 성적, 활동 정보를 바탕으로 지원 가능성, 조건부 가능성, 불가능 사유를 조건 단위로 설명합니다.</p>
          <div className="mt-8 flex gap-3">
            <Link href="/onboarding" className="rounded-pill bg-brand px-6 py-3 text-sm font-bold uppercase tracking-[1.6px] text-black">Start</Link>
            <Link href="/dashboard" className="rounded-pill border border-border px-6 py-3 text-sm font-bold uppercase tracking-[1.6px] text-white">Dashboard</Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-secondary md:grid-cols-2">
            <Link href="/scholarships" className="rounded-card border border-border bg-surface px-4 py-3 hover:bg-surface-alt">장학금 탐색 바로가기</Link>
            <Link href="/admin" className="rounded-card border border-border bg-surface px-4 py-3 hover:bg-surface-alt">관리자 대시보드 바로가기</Link>
            <Link href="/admin/scholarships/import" className="rounded-card border border-border bg-surface px-4 py-3 hover:bg-surface-alt">장학금 JSON Import</Link>
            <Link href="/profile" className="rounded-card border border-border bg-surface px-4 py-3 hover:bg-surface-alt">프로필 관리</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
