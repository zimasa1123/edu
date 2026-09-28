import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const timetable = await db
      .select({
        id: s.timetableSlots.id,
        dayOfWeek: s.timetableSlots.dayOfWeek,
        periodNumber: s.timetableSlots.periodNumber,
        startTime: s.timetableSlots.startTime,
        endTime: s.timetableSlots.endTime,
        room: s.timetableSlots.room,
        subjectNameAr: s.subjects.nameAr,
        subjectNameEn: s.subjects.nameEn,
        teacherNameAr: s.users.fullNameAr,
        teacherNameEn: s.users.fullNameEn,
        sectionName: s.sections.name,
      })
      .from(s.timetableSlots)
      .innerJoin(s.subjects, eq(s.timetableSlots.subjectId, s.subjects.id))
      .innerJoin(s.users, eq(s.timetableSlots.teacherId, s.users.id))
      .innerJoin(s.sections, eq(s.timetableSlots.sectionId, s.sections.id));

    const assessmentsList = await db
      .select({
        id: s.assessments.id,
        title: s.assessments.title,
        type: s.assessments.type,
        maxScore: s.assessments.maxScore,
        weight: s.assessments.weight,
        dueDate: s.assessments.dueDate,
        description: s.assessments.description,
        subjectNameAr: s.subjects.nameAr,
        teacherNameAr: s.users.fullNameAr,
      })
      .from(s.assessments)
      .innerJoin(s.subjects, eq(s.assessments.subjectId, s.subjects.id))
      .innerJoin(s.users, eq(s.assessments.teacherId, s.users.id))
      .orderBy(desc(s.assessments.dueDate));

    const gradesList = await db
      .select({
        id: s.gradesResults.id,
        score: s.gradesResults.score,
        feedback: s.gradesResults.feedback,
        aiGeneratedFeedback: s.gradesResults.aiGeneratedFeedback,
        assessmentTitle: s.assessments.title,
        studentNameAr: s.students.firstNameAr,
        studentNameEn: s.students.firstNameEn,
        studentCode: s.students.studentCode,
      })
      .from(s.gradesResults)
      .innerJoin(s.assessments, eq(s.gradesResults.assessmentId, s.assessments.id))
      .innerJoin(s.students, eq(s.gradesResults.studentId, s.students.id));

    return NextResponse.json({
      success: true,
      timetable,
      assessments: assessmentsList,
      grades: gradesList,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "CREATE_ASSESSMENT") {
      const [newAssessment] = await db
        .insert(s.assessments)
        .values({
          sectionId: Number(body.sectionId) || 1,
          subjectId: Number(body.subjectId) || 1,
          teacherId: 6, // Teacher Ahmed
          title: body.title,
          type: body.type || "quiz",
          maxScore: String(body.maxScore || 100),
          weight: Number(body.weight || 20),
          dueDate: body.dueDate || new Date().toISOString().split("T")[0],
          description: body.description || "",
        })
        .returning();

      return NextResponse.json({ success: true, assessment: newAssessment });
    }

    if (action === "SUBMIT_GRADE") {
      const [newGrade] = await db
        .insert(s.gradesResults)
        .values({
          assessmentId: Number(body.assessmentId),
          studentId: Number(body.studentId),
          score: String(body.score),
          feedback: body.feedback || "",
          aiGeneratedFeedback: body.aiFeedback || "تم التدقيق والمصادقة الأكاديمية.",
        })
        .returning();

      return NextResponse.json({ success: true, grade: newGrade });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
