import type { Course } from "@/types/scholarship";

export function sanitizeCoursesForApi(courses: Course[]) {
  return courses.map((course) => ({
    name: course.name,
    code: course.code,
    category: course.category,
    credits: course.credits,
    grade: course.grade
  }));
}
