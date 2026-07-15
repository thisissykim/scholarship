export type MatchStatus = "ELIGIBLE" | "CONDITIONAL" | "INELIGIBLE";
export type EnrollmentStatus = "REGULAR" | "LEAVE_OF_ABSENCE" | "EXCESS_SEMESTER" | "EXCHANGE";
export type SourceType = "INTERNAL" | "EXTERNAL";
export type FundingType = "TUITION" | "LIVING_EXPENSE" | "OTHER";

export type Student = {
  name: string;
  studentId: string;
  email: string;
  college: string;
  department: string;
  majors: string[];
  grade: number;
  enrollmentStatus: EnrollmentStatus;
  gpa: number;
  creditsLastSem: number;
  totalCredits: number;
  incomeQuintile?: number | null;
  nationalScholarshipApplied: boolean;
  isExchangeStudent: boolean;
  region?: string;
  gender?: string;
  isForeigner: boolean;
};

export type EligibilityRule = {
  id: string;
  field: keyof Student;
  operator: "GTE" | "LTE" | "EQ" | "NEQ" | "IN" | "NOT_IN" | "REQUIRED" | "FORBIDDEN";
  value: string;
  isMandatory: boolean;
  displayText: string;
};

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  sourceType: SourceType;
  fundingType: FundingType;
  amount?: number;
  amountDescription?: string;
  applicationEndDate: string;
  sourceUrl?: string;
  rawAnnouncementText?: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  duplicateAllowed: boolean;
  createdBy: "CRAWLER" | "MANUAL" | "ADMIN_IMPORT";
  rules: EligibilityRule[];
  requiredDocuments: string[];
};

export type RuleEvalResult = {
  ruleId: string;
  field: string;
  displayText: string;
  satisfied: boolean;
  reason: string;
  isFixable: boolean;
};

export type ParsedCourse = {
  name: string;
  credits: number;
  semester?: string;
  grade?: string;
  aiRelevant: boolean;
};

export type ParsedDocumentAnalysis = {
  fileName?: string;
  extractedText: string;
  courses: ParsedCourse[];
  totalCredits: number;
  aiRelevantCourses: ParsedCourse[];
  warnings: string[];
};
