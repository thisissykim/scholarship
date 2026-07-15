import Link from "next/link";
export default function Dashboard() {
  return <main className="min-h-screen bg-base p-6 text-white"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-bold">내 장학금 대시보드</h1><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-card bg-surface p-5">지원가능 2건</div><div className="rounded-card bg-surface p-5">조건부가능 1건</div><div className="rounded-card bg-surface p-5">마감임박 2건</div></div><Link href="/scholarships" className="mt-8 inline-flex rounded-pill bg-brand px-6 py-3 text-sm font-bold uppercase tracking-[1.6px] text-black">장학금 탐색</Link></div></main>;
}
