import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-base p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">관리자 대시보드</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href="/admin/scholarships/new" className="rounded-card bg-surface p-5 hover:bg-card">장학금 수동 등록</Link>
          <Link href="/admin/scholarships/import" className="rounded-card bg-surface p-5 hover:bg-card">JSON Import / 검수</Link>
        </div>
      </div>
    </main>
  );
}
