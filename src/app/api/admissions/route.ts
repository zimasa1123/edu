import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const leadsList = await db.select().from(s.leads).orderBy(desc(s.leads.id));

    // Calculate stage aggregates
    const stages = [
      "Inquiry",
      "Tour Booked",
      "Applied",
      "Assessment",
      "Interview",
      "Accepted",
      "Fee Paid",
      "Enrolled",
      "Rejected",
    ];

    const pipeline: Record<string, typeof leadsList> = {};
    for (const stage of stages) {
      pipeline[stage] = leadsList.filter((l) => l.stage === stage);
    }

    return NextResponse.json({
      success: true,
      leads: leadsList,
      pipeline,
      stages,
      stats: {
        total: leadsList.length,
        accepted: leadsList.filter((l) => l.stage === "Accepted" || l.stage === "Fee Paid" || l.stage === "Enrolled").length,
        avgScore: leadsList.length ? Math.round(leadsList.reduce((acc, l) => acc + (l.score || 0), 0) / leadsList.length) : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // AI Lead scoring calculation
    let calculatedScore = 70;
    if (body.source === "Referral") calculatedScore += 15;
    if (body.source === "WhatsApp") calculatedScore += 10;
    if (body.email) calculatedScore += 5;
    calculatedScore = Math.min(99, calculatedScore);

    const [newLead] = await db
      .insert(s.leads)
      .values({
        schoolId: body.schoolId || 1,
        branchId: body.branchId || 1,
        studentName: body.studentName,
        parentName: body.parentName,
        phone: body.phone,
        email: body.email || null,
        gradeInterested: body.gradeInterested || "Grade 4",
        curriculumInterested: body.curriculumInterested || "American Diploma",
        source: body.source || "Website",
        stage: body.stage || "Inquiry",
        score: calculatedScore,
        notes: body.notes || "",
        aiNextAction: `المتابعة الفورية عبر واتساب وإرسال دليل قبول العام الدراسي الجديد`,
      })
      .returning();

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, stage, notes, score } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Lead ID required" }, { status: 400 });
    }

    const [updated] = await db
      .update(s.leads)
      .set({
        ...(stage ? { stage } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(score !== undefined ? { score } : {}),
      })
      .where(eq(s.leads.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
