import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const routesList = await db.select().from(s.transportRoutes);
    const libraryList = await db.select().from(s.libraryBooks);

    const clinicList = await db
      .select({
        id: s.clinicVisits.id,
        visitTime: s.clinicVisits.visitTime,
        complaint: s.clinicVisits.complaint,
        temperature: s.clinicVisits.temperature,
        treatmentGiven: s.clinicVisits.treatmentGiven,
        parentNotified: s.clinicVisits.parentNotified,
        studentNameAr: s.students.firstNameAr,
        studentLastNameAr: s.students.lastNameAr,
        studentCode: s.students.studentCode,
      })
      .from(s.clinicVisits)
      .innerJoin(s.students, eq(s.clinicVisits.studentId, s.students.id))
      .orderBy(desc(s.clinicVisits.visitTime));

    const incidentsList = await db
      .select({
        id: s.behaviorIncidents.id,
        title: s.behaviorIncidents.title,
        description: s.behaviorIncidents.description,
        type: s.behaviorIncidents.type,
        points: s.behaviorIncidents.points,
        actionTaken: s.behaviorIncidents.actionTaken,
        createdAt: s.behaviorIncidents.createdAt,
        studentNameAr: s.students.firstNameAr,
        studentLastNameAr: s.students.lastNameAr,
      })
      .from(s.behaviorIncidents)
      .innerJoin(s.students, eq(s.behaviorIncidents.studentId, s.students.id))
      .orderBy(desc(s.behaviorIncidents.createdAt));

    const counselorList = await db
      .select({
        id: s.counselorCases.id,
        caseTitle: s.counselorCases.caseTitle,
        caseCategory: s.counselorCases.caseCategory,
        status: s.counselorCases.status,
        confidentialNotes: s.counselorCases.confidentialNotes,
        interventionPlan: s.counselorCases.interventionPlan,
        studentNameAr: s.students.firstNameAr,
        studentLastNameAr: s.students.lastNameAr,
      })
      .from(s.counselorCases)
      .innerJoin(s.students, eq(s.counselorCases.studentId, s.students.id));

    const ticketsList = await db.select().from(s.tickets).orderBy(desc(s.tickets.id));

    return NextResponse.json({
      success: true,
      routes: routesList,
      library: libraryList,
      clinic: clinicList,
      incidents: incidentsList,
      counselorCases: counselorList,
      tickets: ticketsList,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "LOG_CLINIC_VISIT") {
      const [visit] = await db
        .insert(s.clinicVisits)
        .values({
          studentId: Number(body.studentId),
          nurseId: 8, // Nurse Hala
          complaint: body.complaint,
          temperature: body.temperature || "37.0 C",
          treatmentGiven: body.treatmentGiven,
          parentNotified: Boolean(body.parentNotified),
        })
        .returning();

      return NextResponse.json({ success: true, visit });
    }

    if (action === "UPDATE_BUS_STATUS") {
      const [updated] = await db
        .update(s.transportRoutes)
        .set({
          currentStatus: body.status,
          currentStopName: body.currentStopName,
          etaMinutes: Number(body.etaMinutes),
        })
        .where(eq(s.transportRoutes.id, Number(body.routeId)))
        .returning();

      return NextResponse.json({ success: true, route: updated });
    }

    if (action === "CREATE_TICKET") {
      const [ticket] = await db
        .insert(s.tickets)
        .values({
          schoolId: 1,
          reporterId: Number(body.reporterId) || 10,
          category: body.category || "General",
          title: body.title,
          description: body.description,
          urgency: body.urgency || "medium",
          aiCategoryTriage: "تم التحليل والتصنيف التلقائي عبر الذكاء الاصطناعي مع توجيه إشعار للمسؤول المختص.",
        })
        .returning();

      return NextResponse.json({ success: true, ticket });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
