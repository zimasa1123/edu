import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const invoicesList = await db
      .select({
        id: s.invoices.id,
        invoiceNumber: s.invoices.invoiceNumber,
        titleAr: s.invoices.titleAr,
        titleEn: s.invoices.titleEn,
        amount: s.invoices.amount,
        paidAmount: s.invoices.paidAmount,
        discountAmount: s.invoices.discountAmount,
        status: s.invoices.status,
        dueDate: s.invoices.dueDate,
        currency: s.invoices.currency,
        lateRiskPrediction: s.invoices.lateRiskPrediction,
        studentId: s.invoices.studentId,
        studentFirstNameAr: s.students.firstNameAr,
        studentLastNameAr: s.students.lastNameAr,
        studentFirstNameEn: s.students.firstNameEn,
        studentLastNameEn: s.students.lastNameEn,
        studentCode: s.students.studentCode,
      })
      .from(s.invoices)
      .innerJoin(s.students, eq(s.invoices.studentId, s.students.id))
      .orderBy(desc(s.invoices.id));

    const paymentsList = await db
      .select({
        id: s.payments.id,
        receiptNumber: s.payments.receiptNumber,
        invoiceId: s.payments.invoiceId,
        amount: s.payments.amount,
        method: s.payments.method,
        transactionRef: s.payments.transactionRef,
        notes: s.payments.notes,
        paidAt: s.payments.paidAt,
        studentFirstNameAr: s.students.firstNameAr,
        studentLastNameAr: s.students.lastNameAr,
      })
      .from(s.payments)
      .innerJoin(s.students, eq(s.payments.studentId, s.students.id))
      .orderBy(desc(s.payments.id));

    const feePlansList = await db.select().from(s.feePlans);

    // Summary calculations
    const totalBilled = invoicesList.reduce((acc, inv) => acc + Number(inv.amount || 0), 0);
    const totalCollected = invoicesList.reduce((acc, inv) => acc + Number(inv.paidAmount || 0), 0);
    const totalOverdue = invoicesList
      .filter((inv) => inv.status === "overdue")
      .reduce((acc, inv) => acc + (Number(inv.amount) - Number(inv.paidAmount)), 0);

    return NextResponse.json({
      success: true,
      invoices: invoicesList,
      payments: paymentsList,
      feePlans: feePlansList,
      stats: {
        totalBilled,
        totalCollected,
        totalOverdue,
        collectionPercentage: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, invoiceId, amount, method, studentId, notes } = body;

    if (action === "RECORD_PAYMENT") {
      const receiptNumber = `REC-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      const transactionRef = `${method.toUpperCase()}-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

      const [newPayment] = await db
        .insert(s.payments)
        .values({
          invoiceId: Number(invoiceId),
          studentId: Number(studentId),
          receiptNumber,
          amount: String(amount),
          method: method || "card",
          transactionRef,
          notes: notes || `سداد قسط عبر بوابة ${method}`,
        })
        .returning();

      // Update invoice paid amount & status
      const [invoice] = await db.select().from(s.invoices).where(eq(s.invoices.id, Number(invoiceId)));
      if (invoice) {
        const newPaid = Number(invoice.paidAmount) + Number(amount);
        const total = Number(invoice.amount);
        const newStatus = newPaid >= total ? "paid" : "partial";

        await db
          .update(s.invoices)
          .set({
            paidAmount: String(newPaid),
            status: newStatus,
          })
          .where(eq(s.invoices.id, Number(invoiceId)));
      }

      return NextResponse.json({ success: true, payment: newPayment });
    }

    if (action === "CREATE_INVOICE") {
      const invoiceNumber = `INV-2025-${Math.floor(10000 + Math.random() * 90000)}`;
      const [newInvoice] = await db
        .insert(s.invoices)
        .values({
          schoolId: 1,
          studentId: Number(body.studentId),
          invoiceNumber,
          titleAr: body.titleAr || "قسط دراسي إضافي",
          titleEn: body.titleEn || "Additional Tuition Installment",
          amount: String(body.amount),
          paidAmount: "0.00",
          dueDate: body.dueDate || "2025-05-01",
          currency: "EGP",
          status: "unpaid",
        })
        .returning();

      return NextResponse.json({ success: true, invoice: newInvoice });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
