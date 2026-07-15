import { scholarships, demoStudent } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/matching/evaluateEligibility";
import { StatusBadge } from "@/components/ui";

export default function ScholarshipDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const scholarship = scholarships.find((s) => s.id === id) ?? scholarships[0];
  const evaluation = evaluateEligibility(demoStudent, scholarship.rules);
  return <main className="min-h-screen bg-base p-6 text-white"><div className="mx-auto max-w-4xl rounded-panel border border-border bg-surface p-6"><StatusBadge status={evaluation.status} /><h1 className="mt-4 text-3xl font-bold">{scholarship.name}</h1><div className="mt-6 space-y-3">{evaluation.results.map((r) => <div key={r.ruleId} className="rounded-card bg-surface-alt p-4">{r.satisfied ? "✓" : "✕"} {r.displayText} {r.satisfied ? "" : `- ${r.reason}`}</div>)}</div></div></main>;
}
