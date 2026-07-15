import type { EligibilityRule, RuleEvalResult, Scholarship, Student, MatchStatus } from "@/lib/types";

const parseValue = (value: string) => {
  try { return JSON.parse(value); } catch { return value; }
};

const compare = (student: Student, rule: EligibilityRule) => {
  const current = student[rule.field];
  const expected = parseValue(rule.value);
  switch (rule.operator) {
    case "GTE": return Number(current) >= Number(expected);
    case "LTE": return Number(current) <= Number(expected);
    case "EQ": return String(current) === String(expected);
    case "NEQ": return String(current) !== String(expected);
    case "IN": return Array.isArray(expected) ? expected.includes(current) : false;
    case "NOT_IN": return Array.isArray(expected) ? !expected.includes(current) : true;
    case "REQUIRED": return current !== undefined && current !== null && current !== "";
    case "FORBIDDEN": return !current;
  }
  return false;
};

export function evaluateEligibility(student: Student, rules: EligibilityRule[]) {
  const results: RuleEvalResult[] = rules.map((rule) => {
    const satisfied = compare(student, rule);
    const isFixable = rule.field === "nationalScholarshipApplied" || rule.field === "incomeQuintile";
    const reason = satisfied
      ? `${rule.displayText} 조건을 충족했습니다.`
      : isFixable
        ? `${rule.displayText} 조건이 아직 충족되지 않았지만, 준비하면 지원 가능성이 있어요.`
        : `${rule.displayText} 조건이 현재 상태와 맞지 않아 지원이 어렵습니다.`;
    return { ruleId: rule.id, field: rule.field, displayText: rule.displayText, satisfied, reason, isFixable };
  });

  const mandatory = rules.filter((r) => r.isMandatory);
  const satisfiedMandatory = mandatory.filter((rule) => results.find((r) => r.ruleId === rule.id)?.satisfied).length;
  const allSatisfied = mandatory.length === satisfiedMandatory;
  const hasFixableMiss = results.some((r) => !r.satisfied && r.isFixable);
  const hasHardMiss = results.some((r) => !r.satisfied && !r.isFixable);

  let status: MatchStatus = "ELIGIBLE";
  if (!allSatisfied && hasHardMiss) status = "INELIGIBLE";
  else if (!allSatisfied && hasFixableMiss) status = "CONDITIONAL";

  let matchScore = Math.round((satisfiedMandatory / Math.max(mandatory.length, 1)) * 100);
  if (status === "INELIGIBLE") matchScore = Math.min(matchScore, 20);
  if (status === "CONDITIONAL") matchScore = Math.max(60, Math.min(matchScore, 89));
  if (status === "ELIGIBLE") matchScore = Math.max(90, matchScore);

  return { status, matchScore, results };
}

export function sortByMatch(a: Scholarship & { evaluated: ReturnType<typeof evaluateEligibility> }, b: Scholarship & { evaluated: ReturnType<typeof evaluateEligibility> }) {
  const order: Record<MatchStatus, number> = { ELIGIBLE: 0, CONDITIONAL: 1, INELIGIBLE: 2 };
  const diff = order[a.evaluated.status] - order[b.evaluated.status];
  return diff !== 0 ? diff : b.evaluated.matchScore - a.evaluated.matchScore;
}
