export type ConditionOperator = "AND" | "OR";

export interface CourseRequirement {
  type: "keyword_match" | "category_match" | "specific_course";
  keywords?: string[];
  category?: string;
  courseNameOrCode?: string;
  minCount?: number;
  minCredits?: number;
}

export interface GpaRequirement {
  minGpa: number;
  scale: 4.5 | 4.3 | 4.0;
}

export interface ScholarshipEligibility {
  id: string;
  name: string;
  description?: string;
  courseRequirements: CourseRequirement[];
  gpaRequirement?: GpaRequirement;
  combineWith: ConditionOperator;
  updatedAt: string;
}

export interface Course {
  name: string;
  code?: string;
  category?: string;
  credits: number;
  grade?: string;
}

export interface MatchResult {
  scholarshipId: string;
  scholarshipName: string;
  eligible: boolean;
  matchedCourses: Course[];
  reasons: string[];
  confidence: "high" | "medium" | "low";
}
