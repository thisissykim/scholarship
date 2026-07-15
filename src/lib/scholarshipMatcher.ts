import type { Course, MatchResult, ScholarshipEligibility } from "@/types/scholarship";

const normalizeGpa = (gpa: number, scale: 4.5 | 4.3 | 4.0, target: 4.5 | 4.3 | 4.0) => gpa * (target / scale);

export function matchAllScholarships(courses: Course[], gpa: number | null, scholarships: ScholarshipEligibility[]): MatchResult[] {
  return scholarships.map((scholarship) => {
    const matchedCourses = scholarship.courseRequirements.flatMap((req) => {
      if (req.type === "keyword_match" && req.keywords) {
        return courses.filter((course) => req.keywords!.some((kw) => course.name.includes(kw)));
      }
      if (req.type === "category_match" && req.category) {
        return courses.filter((course) => course.category === req.category);
      }
      if (req.type === "specific_course" && req.courseNameOrCode) {
        return courses.filter((course) => course.name === req.courseNameOrCode || course.code === req.courseNameOrCode);
      }
      return [];
    });

    const credits = matchedCourses.reduce((sum, course) => sum + course.credits, 0);
    const courseOk = scholarship.courseRequirements.every((req) => {
      if (req.minCount && matchedCourses.length < req.minCount) return false;
      if (req.minCredits && credits < req.minCredits) return false;
      return true;
    });

    const gpaOk = scholarship.gpaRequirement && gpa !== null
      ? normalizeGpa(gpa, 4.5, scholarship.gpaRequirement.scale) >= scholarship.gpaRequirement.minGpa
      : true;

    const eligible = courseOk && gpaOk;
    return {
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      eligible,
      matchedCourses,
      reasons: [
        courseOk ? "과목 조건 충족" : "과목 조건 미충족",
        gpaOk ? "평점 조건 충족" : "평점 조건 미충족"
      ],
      confidence: matchedCourses.length ? "high" : "low"
    };
  });
}
