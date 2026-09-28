import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const gradeId = searchParams.get("gradeId");
    const riskOnly = searchParams.get("riskOnly") === "true";

    const allStudents = await db
      .select({
        id: s.students.id,
        studentCode: s.students.studentCode,
        nationalId: s.students.nationalId,
        firstNameAr: s.students.firstNameAr,
        lastNameAr: s.students.lastNameAr,
        firstNameEn: s.students.firstNameEn,
        lastNameEn: s.students.lastNameEn,
        gender: s.students.gender,
        birthDate: s.students.birthDate,
        nationality: s.students.nationality,
        religion: s.students.religion,
        photoUrl: s.students.photoUrl,
        bloodGroup: s.students.bloodGroup,
        medicalNotes: s.students.medicalNotes,
        allergies: s.students.allergies,
        specialNeedsIep: s.students.specialNeedsIep,
        previousSchool: s.students.previousSchool,
        status: s.students.status,
        enrollmentDate: s.students.enrollmentDate,
        digitalPassportCode: s.students.digitalPassportCode,
        riskScore: s.students.riskScore,
        riskFactors: s.students.riskFactors,
        canteenWalletBalance: s.students.canteenWalletBalance,
        gradeId: s.students.gradeId,
        sectionId: s.students.sectionId,
        branchId: s.students.branchId,
      })
      .from(s.students)
      .orderBy(desc(s.students.id));

    let filtered = allStudents;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (st) =>
          st.firstNameAr.toLowerCase().includes(q) ||
          st.lastNameAr.toLowerCase().includes(q) ||
          st.firstNameEn.toLowerCase().includes(q) ||
          st.lastNameEn.toLowerCase().includes(q) ||
          st.studentCode.toLowerCase().includes(q) ||
          st.nationalId.includes(q)
      );
    }

    if (gradeId) {
      filtered = filtered.filter((st) => String(st.gradeId) === gradeId);
    }

    if (riskOnly) {
      filtered = filtered.filter((st) => (st.riskScore || 0) >= 50);
    }

    return NextResponse.json({ success: true, students: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const studentCode = `STU-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const digitalPassportCode = `EGP-NOOR-STU-${Math.floor(100 + Math.random() * 900)}`;

    const [newStudent] = await db
      .insert(s.students)
      .values({
        schoolId: body.schoolId || 1,
        branchId: body.branchId || 1,
        gradeId: Number(body.gradeId) || 2,
        sectionId: Number(body.sectionId) || 1,
        studentCode,
        nationalId: body.nationalId || `314${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        firstNameAr: body.firstNameAr || "طالب جديد",
        lastNameAr: body.lastNameAr || "العائلة",
        firstNameEn: body.firstNameEn || "New",
        lastNameEn: body.lastNameEn || "Student",
        gender: body.gender || "Male",
        birthDate: body.birthDate || "2015-01-01",
        nationality: body.nationality || "Egyptian",
        medicalNotes: body.medicalNotes || "لا توجد موانع طبية",
        allergies: body.allergies || "",
        status: "enrolled",
        enrollmentDate: new Date().toISOString().split("T")[0],
        digitalPassportCode,
        riskScore: 10,
        riskFactors: ["طالب مستجد - في طور الملاحظة الأولى"],
        photoUrl:
          body.photoUrl ||
          "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
      })
      .returning();

    // Log audit
    await db.insert(s.auditLogs).values({
      userId: 1,
      action: "ENROLL_STUDENT",
      entity: "students",
      entityId: newStudent.id,
      details: `Enrolled student ${newStudent.firstNameAr} ${newStudent.lastNameAr} (${newStudent.studentCode})`,
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Student ID required" }, { status: 400 });
    }

    const [updated] = await db
      .update(s.students)
      .set({
        ...updates,
      })
      .where(eq(s.students.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
