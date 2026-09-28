import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const sectionId = searchParams.get("sectionId");

    const records = await db
      .select({
        id: s.attendance.id,
        studentId: s.attendance.studentId,
        sectionId: s.attendance.sectionId,
        date: s.attendance.date,
        periodNumber: s.attendance.periodNumber,
        status: s.attendance.status,
        reason: s.attendance.reason,
        studentCode: s.students.studentCode,
        firstNameAr: s.students.firstNameAr,
        lastNameAr: s.students.lastNameAr,
        firstNameEn: s.students.firstNameEn,
        lastNameEn: s.students.lastNameEn,
      })
      .from(s.attendance)
      .innerJoin(s.students, eq(s.attendance.studentId, s.students.id))
      .where(eq(s.attendance.date, date))
      .orderBy(desc(s.attendance.id));

    return NextResponse.json({ success: true, records, date });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { records, studentId, status, reason, sectionId, date } = body;

    const recordDate = date || new Date().toISOString().split("T")[0];

    // Bulk roll save or single record
    if (Array.isArray(records)) {
      for (const rec of records) {
        // Upsert style: delete existing for same student and date
        await db
          .delete(s.attendance)
          .where(and(eq(s.attendance.studentId, rec.studentId), eq(s.attendance.date, recordDate)));

        await db.insert(s.attendance).values({
          studentId: rec.studentId,
          sectionId: rec.sectionId || 1,
          date: recordDate,
          status: rec.status || "present",
          reason: rec.reason || null,
          recordedBy: 6, // Teacher Ahmed Fouad
        });
      }
      return NextResponse.json({ success: true, count: records.length });
    }

    if (!studentId || !status) {
      return NextResponse.json({ success: false, error: "studentId and status are required" }, { status: 400 });
    }

    // Delete previous for today to avoid duplicate
    await db
      .delete(s.attendance)
      .where(and(eq(s.attendance.studentId, studentId), eq(s.attendance.date, recordDate)));

    const [inserted] = await db
      .insert(s.attendance)
      .values({
        studentId,
        sectionId: sectionId || 1,
        date: recordDate,
        status,
        reason: reason || null,
        recordedBy: 6,
      })
      .returning();

    return NextResponse.json({ success: true, record: inserted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
