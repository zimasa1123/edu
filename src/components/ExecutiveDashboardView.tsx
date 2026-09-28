"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CalendarCheck,
  BadgeDollarSign,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  Filter,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Bell,
  RefreshCw,
} from "lucide-react";
import { Language, translations, formatCurrency, formatNumber } from "@/lib/i18n";
import { NavTab } from "./Sidebar";

interface ExecutiveDashboardProps {
  lang: Language;
  useArabicIndic: boolean;
  kpis: {
    totalStudents: number;
    totalLeads: number;
    atRiskStudents: number;
    attendanceRate: number;
    totalInvoiced: number;
    totalCollected: number;
    overdueInvoices: number;
    collectionRate: number;
  };
  announcements: any[];
  onNavigate: (tab: NavTab) => void;
  onOpenPassport: (studentId: number) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardProps> = ({
  lang,
  useArabicIndic,
  kpis,
  announcements,
  onNavigate,
  onOpenPassport,
}) => {
  const t = translations[lang];
  const [briefing, setBriefing] = useState<any>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const fetchBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "PRINCIPAL_BRIEFING", payload: {} }),
      });
      const data = await res.json();
      if (data.success) {
        setBriefing(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBriefing(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "لوحة القيادة التنفيذية والإشراف العام" : "Executive Leadership & KPI Dashboard"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "متابعة حية ومؤشرات استباقية مدعومة بالذكاء الاصطناعي للمدير والمالك"
              : "Live AI-assisted operational & financial metrics for principal and owners"}
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("sis")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.addStudent}</span>
          </button>
          <button
            onClick={() => onNavigate("finance")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>{t.recordPayment}</span>
          </button>
        </div>
      </div>

      {/* AI Principal Executive Briefing Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 rounded-3xl shadow-lg border border-indigo-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{t.aiBriefing}</h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 px-2 py-0.5 rounded-full font-mono">
                  AI-Generated
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                {briefing?.date || (lang === "ar" ? "تحديث تلقائي لحظي" : "Real-time auto brief")}
              </p>
            </div>
          </div>

          <button
            onClick={fetchBriefing}
            disabled={loadingBriefing}
            className="text-xs text-indigo-200 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingBriefing ? "animate-spin" : ""}`} />
            <span>{lang === "ar" ? "تحديث التقرير" : "Refresh Brief"}</span>
          </button>
        </div>

        <div className="space-y-4 relative z-10 text-xs sm:text-sm text-slate-200">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 leading-relaxed font-medium">
            {lang === "ar" ? briefing?.executiveSummaryAr : briefing?.executiveSummaryEn}
          </div>

          {/* Anomalies & Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Anomalies Detected */}
            <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === "ar" ? "حالات تتطلب الانتباه الفوري" : "Anomalies Requiring Attention"}</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {briefing?.keyAnomalies?.map((a: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{lang === "ar" ? a.messageAr : a.messageEn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Recommended Actions */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "ar" ? "التوصيات التشغيلية المقترحة" : "AI Recommended Next Actions"}</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {briefing?.recommendedActions?.map((act: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Students */}
        <div
          onClick={() => onNavigate("sis")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.studentsCount}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatNumber(kpis.totalStudents, useArabicIndic)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "+14% نمو عن العام الماضي" : "+14% YoY Enrollment"}</span>
          </div>
        </div>

        {/* KPI 2: Attendance Today */}
        <div
          onClick={() => onNavigate("attendance")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.attendanceToday}</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatNumber(kpis.attendanceRate, useArabicIndic)}%
          </div>
          <div className="text-[11px] text-teal-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "أعلى من المعدل الإقليمي 92%" : "Above 92% benchmark"}</span>
          </div>
        </div>

        {/* KPI 3: Fees Collected */}
        <div
          onClick={() => onNavigate("finance")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.feesCollected}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(kpis.totalCollected, "EGP", lang, useArabicIndic)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
            <span>
              {lang === "ar"
                ? `نسبة التحصيل: ${kpis.collectionRate}% من الفواتير`
                : `${kpis.collectionRate}% collection rate`}
            </span>
          </div>
        </div>

        {/* KPI 4: At-Risk Students */}
        <div
          onClick={() => onNavigate("sis")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.atRiskStudents}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
            {formatNumber(kpis.atRiskStudents, useArabicIndic)}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "يتطلب تدخلاً إرشادياً سريعاً" : "Counseling plan recommended"}</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Financials & Admissions Funnel & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Finance Breakdown Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === "ar" ? "الموقف المالي والتحصيل" : "Tuition & Financial Status"}
              </h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {kpis.collectionRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, kpis.collectionRate)}%` }}
              ></div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">{lang === "ar" ? "إجمالي المطالبات الصادرة:" : "Total Invoiced:"}</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(kpis.totalInvoiced, "EGP", lang, useArabicIndic)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-emerald-800">{lang === "ar" ? "المتحصلات الفعلية:" : "Total Collected:"}</span>
                <span className="font-bold text-emerald-950">
                  {formatCurrency(kpis.totalCollected, "EGP", lang, useArabicIndic)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-rose-800">{lang === "ar" ? "المستحقات المتأخرة:" : "Overdue Balance:"}</span>
                <span className="font-bold text-rose-950">
                  {formatCurrency(8500, "EGP", lang, useArabicIndic)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("finance")}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
          >
            <span>{lang === "ar" ? "إدارة المقبوضات والفواتير" : "Manage Billing & Gateway"}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {/* Admissions Pipeline Status Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">{t.admissionsFunnel}</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {formatNumber(kpis.totalLeads, useArabicIndic)} {lang === "ar" ? "طلب نشط" : "Leads"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">{lang === "ar" ? "استفسارات جديدة (Inquiry)" : "New Inquiries"}</span>
                <span className="font-bold font-mono">3</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 text-blue-900">
                <span>{lang === "ar" ? "جولات مجدولة (Tour Booked)" : "Tours Booked"}</span>
                <span className="font-bold font-mono">1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 text-amber-900">
                <span>{lang === "ar" ? "اختبارات ومقابلات (Assessment)" : "Assessments / Tests"}</span>
                <span className="font-bold font-mono">1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 text-emerald-900">
                <span>{lang === "ar" ? "مقبولون وسداد أول (Enrolled)" : "Accepted & Paid"}</span>
                <span className="font-bold font-mono">2</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("admissions")}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
          >
            <span>{lang === "ar" ? "فتح لوحة كانبان للقبول" : "Open Kanban Pipeline"}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {/* Announcements & Bulletins Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === "ar" ? "التعميمات الإدارية والفعاليات" : "Official Bulletins & Milestones"}
              </h3>
              <Bell className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {lang === "ar" ? item.titleAr : item.titleEn}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.priority === "urgent"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">
                    {lang === "ar" ? item.contentAr : item.contentEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("communication")}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
          >
            <span>{lang === "ar" ? "مركز التواصل والرسائل" : "Open Communications Hub"}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
