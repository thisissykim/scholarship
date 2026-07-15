import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { student, analysis, fileName } = body;

  const savedStudent = await prisma.student.upsert({
    where: { studentId: student.studentId },
    update: {
      name: student.name,
      email: student.email,
      college: student.college,
      department: student.department,
      majors: student.majors ?? [student.department],
      grade: student.grade,
      enrollmentStatus: student.enrollmentStatus,
      gpa: student.gpa,
      creditsLastSem: student.creditsLastSem,
      totalCredits: student.totalCredits,
      incomeQuintile: student.incomeQuintile ?? null,
      nationalScholarshipApplied: student.nationalScholarshipApplied,
      isExchangeStudent: student.isExchangeStudent ?? false,
      region: student.region ?? null,
      gender: student.gender ?? null,
      isForeigner: student.isForeigner ?? false
    },
    create: {
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      college: student.college,
      department: student.department,
      majors: student.majors ?? [student.department],
      grade: student.grade,
      enrollmentStatus: student.enrollmentStatus,
      gpa: student.gpa,
      creditsLastSem: student.creditsLastSem,
      totalCredits: student.totalCredits,
      incomeQuintile: student.incomeQuintile ?? null,
      nationalScholarshipApplied: student.nationalScholarshipApplied,
      isExchangeStudent: student.isExchangeStudent ?? false,
      region: student.region ?? null,
      gender: student.gender ?? null,
      isForeigner: student.isForeigner ?? false
    }
  });

  await prisma.document.create({
    data: {
      studentId: savedStudent.id,
      type: "TRANSCRIPT",
      fileName: fileName ?? "uploaded-file",
      filePath: `/uploads/${Date.now()}-${fileName ?? "file"}`,
      expiresAt: null
    }
  });

  return Response.json({ ok: true, studentId: savedStudent.id, analysis });
}
