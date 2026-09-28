"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Language, translations, formatCurrency } from "@/lib/i18n";

interface WhatIfSimulatorProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];

  // Sliders state
  const [tuitionFee, setTuitionFee] = useState(45000);
  const [studentCount, setStudentCount] = useState(480);
  const [teacherCount, setTeacherCount] = useState(38);
  const [avgTeacherSalary, setAvgTeacherSalary] = useState(18000);
  const [facilityCost, setFacilityCost] = useState(2500000);

  // Simulation output
  const [simResult, setSimResult] = useState<any>(null);
  const [loadingSim, setLoadingSim] = useState(false);

  const calculateSimulation = async () => {
    setLoadingSim(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "WHAT_IF_SIMULATOR",
          payload: {
            tuitionFee,
            studentCount,
            teacherCount,
            avgTeacherSalary,
            facilityCost,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimResult(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSim(false);
    }
  };

  useEffect(() => {
    calculateSimulation();
  }, [tuitionFee, studentCount, teacherCount, avgTeacherSalary, facilityCost]);

  const handleResetDefaults = () => {
    setTuitionFee(45000);
    setStudentCount(480);
    setTeacherCount(38);
    setAvgTeacherSalary(18000);
    setFacilityCost(2500000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === "ar" ? "محاكي قرارات المالك المالي والإستراتيجي (What-If)" : "Owner's Strategic What-If Simulator"}
            </h1>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Executive Exclusive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "اختبر سيناريوهات تعديل الرسوم، كثافة الفصول، والتوظيف لتقدير الإيرادات وهوامش الأرباح"
              : "Simulate tuition fee adjustments, class capacity, and hiring to project operating margin"}
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "إعادة ضبط المعايير" : "Reset Sliders"}</span>
        </button>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Input Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>{lang === "ar" ? "معايير التخطيط المالي والتشغيلي" : "Operational Input Parameters"}</span>
          </h3>

          {/* Slider 1: Tuition Fee */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">
                {lang === "ar" ? "متوسط المصروفات الدراسية للطالب سنويًا:" : "Average Annual Tuition per Student:"}
              </span>
              <span className="font-bold font-mono text-indigo-600 text-sm">
                {formatCurrency(tuitionFee, "EGP", lang, useArabicIndic)}
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={95000}
              step={2500}
              value={tuitionFee}
              onChange={(e) => setTuitionFee(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20,000 ج.م</span>
              <span>95,000 ج.م</span>
            </div>
          </div>

          {/* Slider 2: Students Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">
                {lang === "ar" ? "إجمالي الطاقة الاستيعابية والطلاب المقيدين:" : "Total Enrolled Students:"}
              </span>
              <span className="font-bold font-mono text-emerald-600 text-sm">
                {studentCount} {lang === "ar" ? "طالب" : "students"}
              </span>
            </div>
            <input
              type="range"
              min={150}
              max={1200}
              step={20}
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>150 طالب</span>
              <span>1,200 طالب</span>
            </div>
          </div>

          {/* Slider 3: Teacher Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">
                {lang === "ar" ? "عدد كادر التدريس والمعلمين:" : "Teaching Staff Headcount:"}
              </span>
              <span className="font-bold font-mono text-purple-600 text-sm">
                {teacherCount} {lang === "ar" ? "معلم" : "teachers"}
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={2}
              value={teacherCount}
              onChange={(e) => setTeacherCount(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>15 معلم</span>
              <span>100 معلم</span>
            </div>
          </div>

          {/* Slider 4: Avg Teacher Salary */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">
                {lang === "ar" ? "متوسط الراتب الشهري للمعلم:" : "Average Monthly Teacher Salary:"}
              </span>
              <span className="font-bold font-mono text-slate-800 text-sm">
                {formatCurrency(avgTeacherSalary, "EGP", lang, useArabicIndic)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={35000}
              step={1000}
              value={avgTeacherSalary}
              onChange={(e) => setAvgTeacherSalary(Number(e.target.value))}
              className="w-full accent-slate-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10,000 ج.م</span>
              <span>35,000 ج.م</span>
            </div>
          </div>

          {/* Slider 5: Facility Ops Cost */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">
                {lang === "ar" ? "تكاليف الصيانة والمرافق السنوية:" : "Annual Facility & Ops Cost:"}
              </span>
              <span className="font-bold font-mono text-rose-600 text-sm">
                {formatCurrency(facilityCost, "EGP", lang, useArabicIndic)}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={8000000}
              step={250000}
              value={facilityCost}
              onChange={(e) => setFacilityCost(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1,000,000 ج.م</span>
              <span>8,000,000 ج.م</span>
            </div>
          </div>
        </div>

        {/* Real-time Projections & AI Advisor */}
        <div className="space-y-5">
          {simResult && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-900/60 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  {lang === "ar" ? "المؤشرات المالية التقديرية (Forecast)" : "Projected Financial Forecast"}
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
                  {lang === "ar" ? "نسبة طالب/معلم:" : "Student:Teacher Ratio:"} {simResult.studentTeacherRatio}:1
                </span>
              </div>

              {/* Revenue vs Cost Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-slate-400 block mb-1">
                    {lang === "ar" ? "إجمالي الإيرادات المتوقعة:" : "Gross Projected Revenue:"}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {formatCurrency(simResult.totalRevenue, "EGP", lang, useArabicIndic)}
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-slate-400 block mb-1">
                    {lang === "ar" ? "إجمالي التكاليف التشغيلية:" : "Total Operating Costs:"}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                    {formatCurrency(simResult.totalCost, "EGP", lang, useArabicIndic)}
                  </div>
                </div>
              </div>

              {/* Net Margin Big Card */}
              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-200 block mb-1">
                    {lang === "ar" ? "صافي الفائض التشغيلي التقديري:" : "Projected Net Operating Surplus:"}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {formatCurrency(simResult.netMargin, "EGP", lang, useArabicIndic)}
                  </div>
                </div>
                <div className="text-end">
                  <span className="text-xs text-slate-300 block mb-1">{lang === "ar" ? "هامش الربح:" : "Margin:"}</span>
                  <div
                    className={`text-2xl font-black font-mono ${
                      simResult.marginPercentage >= 20
                        ? "text-emerald-400"
                        : simResult.marginPercentage > 0
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {simResult.marginPercentage}%
                  </div>
                </div>
              </div>

              {/* AI Strategic Recommendation Card */}
              <div className="bg-indigo-900/40 border border-indigo-400/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>{lang === "ar" ? "تحليل الذكاء الاصطناعي الإستراتيجي:" : "AI Strategic Recommendation:"}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {lang === "ar" ? simResult.recommendationAr : simResult.recommendationEn}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
