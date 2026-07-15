import type { ParsedDocumentAnalysis, Student } from "@/lib/types";

const KEY = "skku-scholarship-mate-profile";

export type StoredProfile = Student & {
  uploadedAnalysis?: ParsedDocumentAnalysis;
};

export function getStoredProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as StoredProfile) : null;
}

export function saveStoredProfile(profile: StoredProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}

export function mergeAnalysisIntoStudent(student: Student, analysis: ParsedDocumentAnalysis): StoredProfile {
  return {
    ...student,
    totalCredits: Math.max(student.totalCredits, analysis.totalCredits),
    creditsLastSem: analysis.courses.reduce((sum, course) => sum + course.credits, 0),
    uploadedAnalysis: analysis
  };
}
