import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const staffList = await db
      .select({
        id: s.staff.id,
        jobTitleAr: s.staff.jobTitleAr,
        jobTitleEn: s.staff.jobTitleEn,
        department: s.staff.department,
        hireDate: s.staff.hireDate,
        basicSalary: s.staff.basicSalary,
        allowance: s.staff.allowance,
        contractType: s.staff.contractType,
        status: s.staff.status,
        fullNameAr: s.users.fullNameAr,
        fullNameEn: s.users.fullNameEn,
        email: s.users.email,
        phone: s.users.phone,
        role: s.users.role,
        userId: s.users.id,
      })
      .from(s.staff)
      .innerJoin(s.users, eq(s.staff.userId, s.users.id));

    const leavesList = await db
      .select({
        id: s.leaves.id,
        leaveType: s.leaves.leaveType,
        startDate: s.leaves.startDate,
        endDate: s.leaves.endDate,
        reason: s.leaves.reason,
        status: s.leaves.status,
        substituteTeacherId: s.leaves.substituteTeacherId,
        createdAt: s.leaves.createdAt,
        employeeNameAr: s.users.fullNameAr,
        employeeNameEn: s.users.fullNameEn,
      })
      .from(s.leaves)
      .innerJoin(s.users, eq(s.leaves.userId, s.users.id))
      .orderBy(desc(s.leaves.id));

    return NextResponse.json({ success: true, staff: staffList, leaves: leavesList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "REQUEST_LEAVE") {
      const [newLeave] = await db
        .insert(s.leaves)
        .values({
          userId: Number(body.userId),
          leaveType: body.leaveType || "Sick",
          startDate: body.startDate,
          endDate: body.endDate,
          reason: body.reason,
          status: "pending",
          substituteTeacherId: body.substituteTeacherId ? Number(body.substituteTeacherId) : null,
        })
        .returning();

      return NextResponse.json({ success: true, leave: newLeave });
    }

    if (action === "UPDATE_LEAVE_STATUS") {
      const [updated] = await db
        .update(s.leaves)
        .set({
          status: body.status,
          substituteTeacherId: body.substituteTeacherId ? Number(body.substituteTeacherId) : undefined,
        })
        .where(eq(s.leaves.id, Number(body.leaveId)))
        .returning();

      return NextResponse.json({ success: true, leave: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
