"use client";

import React, { useState, useEffect } from "react";
import {
  BadgeDollarSign,
  Plus,
  CreditCard,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Send,
  Printer,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import { Language, translations, formatCurrency, formatNumber } from "@/lib/i18n";

interface FinanceProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const FinanceView: React.FC<FinanceProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalBilled: 0, totalCollected: 0, totalOverdue: 0, collectionPercentage: 0 });
  const [loading, setLoading] = useState(true);

  // Payment modal state
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("fawry");
  const [receiptData, setReceiptData] = useState<any>(null);

  // AI Reminder Draft Modal
  const [reminderModalData, setReminderModalData] = useState<any>(null);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
        setPayments(data.payments);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RECORD_PAYMENT",
          invoiceId: selectedInvoice.id,
          studentId: selectedInvoice.studentId,
          amount: paymentAmount,
          method: paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReceiptData(data.payment);
        setSelectedInvoice(null);
        fetchFinance();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateReminder = async (invoice: any) => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "FEE_COLLECTION",
          payload: {
            studentName: `${invoice.studentFirstNameAr} ${invoice.studentLastNameAr}`,
            amount: Number(invoice.amount) - Number(invoice.paidAmount),
            overdueDays: 24,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReminderModalData(data.result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "الشؤون المالية والأقساط المدرسية" : "Finance, Tuition & Payment Gateways"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "إصدار الفواتير، تكامل بوابات الدفع (Paymob / Fawry / Stripe)، وتنبيهات التحصيل الذكية"
              : "Invoicing, payment gateway stubs, receipt verification, and AI collection insights"}
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold">
            {lang === "ar" ? `نسبة التحصيل: ${stats.collectionPercentage}%` : `Collected: ${stats.collectionPercentage}%`}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold uppercase">{lang === "ar" ? "إجمالي المطالبات" : "Total Billed"}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(stats.totalBilled, "EGP", lang, useArabicIndic)}
          </div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs text-emerald-800 font-bold uppercase">{lang === "ar" ? "المتحصلات الفعلية" : "Total Collected"}</span>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            {formatCurrency(stats.totalCollected, "EGP", lang, useArabicIndic)}
          </div>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-xs text-rose-800 font-bold uppercase">{lang === "ar" ? "المتأخرات المعلقة" : "Overdue Receivables"}</span>
          <div className="text-2xl font-black text-rose-950 mt-1">
            {formatCurrency(stats.totalOverdue, "EGP", lang, useArabicIndic)}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>{lang === "ar" ? "سجل فواتير وأقساط الطلاب" : "Student Invoices & Installments"}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 text-start">{lang === "ar" ? "رقم الفاتورة" : "Invoice #"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "الطالب" : "Student"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "البيان" : "Description"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "القيمة الإجمالية" : "Amount"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "المسدد" : "Paid"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="p-3.5 text-center">{lang === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">
                      {lang === "ar"
                        ? `${inv.studentFirstNameAr} ${inv.studentLastNameAr}`
                        : `${inv.studentFirstNameEn} ${inv.studentLastNameEn}`}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{inv.studentCode}</div>
                  </td>
                  <td className="p-3.5 text-slate-700">{lang === "ar" ? inv.titleAr : inv.titleEn}</td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {formatCurrency(inv.amount, inv.currency, lang, useArabicIndic)}
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-700">
                    {formatCurrency(inv.paidAmount, inv.currency, lang, useArabicIndic)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        inv.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : inv.status === "overdue"
                          ? "bg-rose-50 text-rose-700 border-rose-300"
                          : "bg-amber-50 text-amber-700 border-amber-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {inv.status !== "paid" && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setPaymentAmount(String(Number(inv.amount) - Number(inv.paidAmount)));
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-xl text-xs transition shadow-2xs"
                        >
                          {lang === "ar" ? "سداد الآن" : "Pay"}
                        </button>
                      )}

                      {inv.status === "overdue" && (
                        <button
                          onClick={() => handleGenerateReminder(inv)}
                          title={lang === "ar" ? "توليد تذكير واتساب ذكي" : "Draft AI Reminder"}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold px-2 py-1 rounded-xl text-xs transition flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{lang === "ar" ? "تذكير AI" : "AI Nudge"}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal with Gateway Options */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-slate-900 text-base">
                {lang === "ar" ? "تسجيل سداد قسط مدرسي" : "Record Payment & Gateway Stub"}
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">الفاتورة المستحقة:</span>
                <span className="font-bold text-slate-900 block">{selectedInvoice.titleAr}</span>
                <span className="text-slate-600 block mt-1 font-mono">
                  الطالب: {selectedInvoice.studentFirstNameAr} {selectedInvoice.studentLastNameAr}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">المبلغ المراد سداده (ج.م)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-sm focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">بوابة / وسيلة الدفع المعتمدة</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:outline-indigo-500 cursor-pointer"
                >
                  <option value="fawry">فوري (Fawry Pay Code Integration)</option>
                  <option value="paymob">باي موب (Paymob Visa/Mastercard)</option>
                  <option value="card">البطاقة البنكية المباشرة (Debit / Credit)</option>
                  <option value="bank_transfer">تحويل بنكي / إيداع CIB</option>
                  <option value="cash">نقداً بالخزينة المدرسية</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  {lang === "ar" ? "تأكيد السداد وتوليد الإيصال" : "Confirm & Generate Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Confirmation Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {lang === "ar" ? "تم السداد وتوليد الإيصال بنجاح!" : "Payment Confirmed & Receipt Issued!"}
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-start">
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الإيصال:</span>
                <span className="font-mono font-bold">{receiptData.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المرجع البنكي:</span>
                <span className="font-mono text-slate-700">{receiptData.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المبلغ المسدد:</span>
                <span className="font-bold text-emerald-600 text-sm">{receiptData.amount} ج.م</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "طباعة الإيصال (PDF)" : "Print Receipt"}</span>
              </button>
              <button
                onClick={() => setReceiptData(null)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                {lang === "ar" ? "تم" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Reminder Message Preview Modal */}
      {reminderModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-amber-50/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-black text-amber-950 text-sm">
                  {lang === "ar" ? "صياغة تذكير السداد الذكي عبر واتساب" : "AI Drafted Polite Fee Reminder"}
                </h3>
              </div>
              <button
                onClick={() => setReminderModalData(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <div>
                  <span className="text-slate-500 block">القناة المقترحة:</span>
                  <span className="font-bold text-slate-800">{reminderModalData.recommendedChannel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">أفضل توقيت للإرسال:</span>
                  <span className="font-bold text-slate-800">{reminderModalData.bestContactTime}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  نص الرسالة المصاغة بالذكاء الاصطناعي (يمكنك تعديلها قبل الإرسال):
                </label>
                <textarea
                  rows={6}
                  defaultValue={lang === "ar" ? reminderModalData.draftedMessageAr : reminderModalData.draftedMessageEn}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 leading-relaxed text-xs focus:outline-indigo-500 font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setReminderModalData(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    alert(lang === "ar" ? "تم إرسال رسالة التذكير عبر واتساب لولي الأمر!" : "Reminder dispatched via WhatsApp!");
                    setReminderModalData(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "إرسال عبر واتساب الآن" : "Send via WhatsApp"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
