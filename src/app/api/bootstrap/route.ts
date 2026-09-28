import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const schoolsList = await db.select().from(s.schools);
    const branchesList = await db.select().from(s.branches);
    const academicYearsList = await db.select().from(s.academicYears).where(eq(s.academicYears.isCurrent, true));
    const usersList = await db.select().from(s.users);
    const gradesList = await db.select().from(s.grades);
    const sectionsList = await db.select().from(s.sections);
    const announcementsList = await db.select().from(s.announcements).orderBy(desc(s.announcements.createdAt)).limit(5);

    // Aggregate KPIs
    const [studentsCountRes] = await db.select({ count: sql<number>`count(*)` }).from(s.students);
    const [leadsCountRes] = await db.select({ count: sql<number>`count(*)` }).from(s.leads);
    const [atRiskCountRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(s.students)
      .where(sql`${s.students.riskScore} > 50`);

    const invoices = await db.select().from(s.invoices);
    const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.amount || 0), 0);
    const totalCollected = invoices.reduce((acc, inv) => acc + Number(inv.paidAmount || 0), 0);
    const overdueCount = invoices.filter((i) => i.status === "overdue").length;

    // Attendance today summary
    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = await db.select().from(s.attendance).where(eq(s.attendance.date, today));
    const presentCount = todayAttendance.filter((a) => a.status === "present").length;
    const totalAttendanceMarked = todayAttendance.length || 1;
    const attendanceRate = Math.round((presentCount / Math.max(1, totalAttendanceMarked)) * 100);

    // Transport status
    const routesList = await db.select().from(s.transportRoutes);

    // Live Campus Pulse
    const clinicToday = await db.select().from(s.clinicVisits).limit(3);
    const recentIncidents = await db.select().from(s.behaviorIncidents).orderBy(desc(s.behaviorIncidents.createdAt)).limit(4);

    return NextResponse.json({
      success: true,
      schools: schoolsList,
      branches: branchesList,
      academicYear: academicYearsList[0] || null,
      users: usersList,
      grades: gradesList,
      sections: sectionsList,
      announcements: announcementsList,
      routes: routesList,
      pulse: {
        clinicVisits: clinicToday,
        incidents: recentIncidents,
        busesEnRoute: routesList.filter((r) => r.currentStatus !== "idle").length,
        totalBuses: routesList.length,
      },
      kpis: {
        totalStudents: Number(studentsCountRes?.count || 0),
        totalLeads: Number(leadsCountRes?.count || 0),
        atRiskStudents: Number(atRiskCountRes?.count || 0),
        attendanceRate: attendanceRate > 0 ? attendanceRate : 95,
        totalInvoiced,
        totalCollected,
        overdueInvoices: overdueCount,
        collectionRate: totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error("Bootstrap error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
