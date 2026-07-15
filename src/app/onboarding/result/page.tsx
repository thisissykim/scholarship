import Link from "next/link";
import { scholarships, demoStudent } from "@/lib/mock-data";
import { evaluateEligibility, sortByMatch } from "@/lib/matching/evaluateEligibility";
import { StatusBadge } from "@/components/ui";

const evaluated = scholarships.map((s) => ({ ...s, evaluated: evaluateEligibility(demoStudent, s.rules) })).sort(sortByMatch);

export default function ResultPage() {
  return <main className="min-h-screen bg-base p-6 text-white"><div className="mx-auto max-w-5xl"><h1 className="text-4xl font-bold">김서연님이 지원 가능한 장학금을 찾았어요</h1><div className="mt-6 space-y-3">{evaluated.map((s) => <article key={s.id} className="rounded-card border border-border bg-surface p-5 shadow-medium"><div className="flex items-start justify-between gap-4"><div><StatusBadge status={s.evaluated.status} /><h2 className="mt-3 text-lg font-bold">{s.name}</h2><p className="mt-1 text-sm text-secondary">{s.provider} · {s.amount ? `${s.amount.toLocaleString()}원` : s.amountDescription}</p><p className="mt-3 text-sm">{s.evaluated.results.find(r => !r.satisfied)?.reason ?? "모든 조건을 충족했어요"}</p></div><div className="text-right text-sm text-secondary">마감 {s.applicationEndDate}</div></div></article>)}</div><Link href="/dashboard" className="mt-8 inline-flex rounded-pill bg-brand px-6 py-3 text-sm font-bold uppercase tracking-[1.6px] text-black">대시보드로 이동</Link></div></main>;
}
