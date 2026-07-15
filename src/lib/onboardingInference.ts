import type { Course } from "@/types/scholarship";

export function inferOnboardingFromCourses(courses: Course[]) {
  const hasDepartment = courses.some((course) => /전공|학과/.test(course.category ?? ""));
  return {
    missing: hasDepartment ? [] : ["department"],
    inferredGrade: courses.length >= 18 ? 4 : courses.length >= 12 ? 3 : courses.length >= 6 ? 2 : 1,
    inferredDepartment: hasDepartment ? courses.find((course) => /전공|학과/.test(course.category ?? ""))?.category ?? "" : ""
  };
}
