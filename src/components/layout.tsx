import Link from "next/link";
export function Sidebar() {
  const items = ["대시보드", "장학금 탐색", "내 정보 관리", "서류함", "일정 캘린더", "관리자용"];
  return <aside className="hidden min-h-screen w-64 border-r border-border bg-base p-6 md:block"><div className="mb-8 text-xl font-bold">SKKU <span className="text-brand">Scholarship</span> Mate</div><nav className="space-y-2">{items.map((item, i) => <Link key={item} href={i===0?"/dashboard":"/scholarships"} className="block rounded-pill px-4 py-3 text-sm text-secondary hover:bg-surface-alt hover:text-white">{item}</Link>)}</nav></aside>;
}
