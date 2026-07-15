import { EligibilityRule, Scholarship, Student } from "./types";

export const demoStudent: Student = {
  name: "김서연",
  studentId: "20241234",
  email: "seoyeon@skku.edu",
  college: "인문사회과학캠퍼스",
  department: "경영학과",
  majors: ["경영학과"],
  grade: 3,
  enrollmentStatus: "REGULAR",
  gpa: 3.74,
  creditsLastSem: 18,
  totalCredits: 92,
  incomeQuintile: 4,
  nationalScholarshipApplied: false,
  isExchangeStudent: false,
  region: "서울",
  gender: "여",
  isForeigner: false
};

const baseRules: Record<string, EligibilityRule[]> = {
  merit: [
    { id: "r1", field: "gpa", operator: "GTE", value: "3.5", isMandatory: true, displayText: "평점 3.5 이상" },
    { id: "r2", field: "creditsLastSem", operator: "GTE", value: "12", isMandatory: true, displayText: "직전 학기 12학점 이상 이수" },
    { id: "r3", field: "enrollmentStatus", operator: "EQ", value: "REGULAR", isMandatory: true, displayText: "정규학기 재학생" }
  ],
  income: [
    { id: "r4", field: "incomeQuintile", operator: "LTE", value: "5", isMandatory: true, displayText: "소득분위 5분위 이하" },
    { id: "r5", field: "nationalScholarshipApplied", operator: "EQ", value: "true", isMandatory: true, displayText: "국가장학금 신청 완료" }
  ],
  exchange: [
    { id: "r6", field: "isExchangeStudent", operator: "EQ", value: "false", isMandatory: true, displayText: "교환학생이 아닌 재학생" }
  ]
};

export const scholarships: Scholarship[] = [
  { id: "s1", name: "SKKU 성적우수 장학금", provider: "성균관대학교", sourceType: "INTERNAL", fundingType: "TUITION", amount: 1500000, applicationEndDate: "2026-07-25", status: "ACTIVE", duplicateAllowed: false, createdBy: "MANUAL", rules: [...baseRules.merit, { id: "r8", field: "totalCredits", operator: "GTE", value: "90", isMandatory: true, displayText: "총 이수학점 90학점 이상" }], requiredDocuments: ["TRANSCRIPT", "ENROLLMENT_CERT"] },
  { id: "s2", name: "미래인재 생활비 지원", provider: "동문회", sourceType: "EXTERNAL", fundingType: "LIVING_EXPENSE", amount: 1000000, applicationEndDate: "2026-07-19", status: "ACTIVE", duplicateAllowed: true, createdBy: "ADMIN_IMPORT", rules: baseRules.income, requiredDocuments: ["TRANSCRIPT", "INCOME_PROOF", "PERSONAL_STATEMENT"] },
  { id: "s3", name: "글로벌 리더십 장학금", provider: "산학협력재단", sourceType: "EXTERNAL", fundingType: "OTHER", amountDescription: "변동 지급", applicationEndDate: "2026-08-02", status: "ACTIVE", duplicateAllowed: false, createdBy: "MANUAL", rules: [...baseRules.merit, ...baseRules.exchange, { id: "r9", field: "totalCredits", operator: "GTE", value: "80", isMandatory: true, displayText: "총 이수학점 80학점 이상" }], requiredDocuments: ["TRANSCRIPT", "ACTIVITY_PROOF"] },
  { id: "s4", name: "국가연계 지원 장학금", provider: "학생지원처", sourceType: "INTERNAL", fundingType: "TUITION", amount: 800000, applicationEndDate: "2026-07-17", status: "ACTIVE", duplicateAllowed: false, createdBy: "MANUAL", rules: baseRules.income, requiredDocuments: ["TRANSCRIPT", "PRIVACY_CONSENT"] },
  { id: "s5", name: "창의활동 우수 장학금", provider: "창업지원단", sourceType: "INTERNAL", fundingType: "LIVING_EXPENSE", amount: 500000, applicationEndDate: "2026-08-15", status: "ACTIVE", duplicateAllowed: true, createdBy: "ADMIN_IMPORT", rules: [{ id: "r7", field: "creditsLastSem", operator: "GTE", value: "9", isMandatory: true, displayText: "직전 학기 9학점 이상 이수" }, { id: "r10", field: "totalCredits", operator: "GTE", value: "70", isMandatory: true, displayText: "총 이수학점 70학점 이상" }], requiredDocuments: ["ACTIVITY_PROOF", "PERSONAL_STATEMENT"] }
];
