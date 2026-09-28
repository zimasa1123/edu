"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { Language, translations, formatCurrency } from "@/lib/i18n";

interface HrProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const HrView: React.FC<HrProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [staff, setStaff] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubstituteModal, setShowSubstituteModal] = useState(false);
  const [selectedAbsentTeacher, setSelectedAbsentTeacher] = useState("أ. أحمد فؤاد (معلم الرياضيات)");

  const fetchHr = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hr");
      const data = await res.json();
      if (data.success) {
        setStaff(data.staff);
        setLeaves(data.leaves);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHr();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header and Smart Substitute Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "الموارد البشرية وكادر التدريس" : "HR, Staff Directory & Payroll"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "سجلات الكادر التعليمي، إدارة الإجازات، والباحث الذكي عن المعلم البديل"
              : "Staff profiles, payroll overview, leave management, and AI Smart Substitute Finder"}
          </p>
        </div>

        {/* Smart Substitute Finder Button */}
        <button
          onClick={() => setShowSubstituteModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
          <span>{lang === "ar" ? "الباحث الذكي عن المعلم البديل" : "Smart Substitute Finder"}</span>
        </button>
      </div>

      {/* Staff Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staff.map((emp) => (
          <div key={emp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                {emp.fullNameAr.slice(0, 2)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {lang === "ar" ? emp.fullNameAr : emp.fullNameEn}
                </div>
                <div className="text-slate-500 text-xs">{lang === "ar" ? emp.jobTitleAr : emp.jobTitleEn}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>القسم:</span>
                <span className="font-semibold text-slate-800">{emp.department}</span>
              </div>
              <div className="flex justify-between">
                <span>الراتب الأساسي:</span>
                <span className="font-bold font-mono text-emerald-700">
                  {formatCurrency(emp.basicSalary, "EGP", lang, useArabicIndic)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>الحالة:</span>
                <span className="text-emerald-600 font-bold">نشط بالخدمة</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Substitute Finder Modal */}
      {showSubstituteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-indigo-50/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="font-black text-indigo-950 text-base">
                  {lang === "ar" ? "محرك مطابقة المعلم البديل الذكي" : "AI Smart Substitute Teacher Matcher"}
                </h3>
              </div>
              <button
                onClick={() => setShowSubstituteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">المعلم المتغيب / المجاز</label>
                <select
                  value={selectedAbsentTeacher}
                  onChange={(e) => setSelectedAbsentTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold focus:outline-indigo-500 cursor-pointer"
                >
                  <option>أ. أحمد فؤاد (معلم الرياضيات - حصة 1 و 2 شاغرة)</option>
                  <option>أ. منى زهران (معلمة العلوم - حصة 3 شاغرة)</option>
                </select>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>أفضل بديل مرشح بالذكاء الاصطناعي:</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900 text-sm">أ. شريف محمود (معلم الرياضيات المساند)</div>
                  <div className="text-slate-600">
                    جدوله شاغر في الحصة الأولى والثانية • متطابق بنسبة 98% في تخصص المنهج الأمريكي
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowSubstituteModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    alert(lang === "ar" ? "تم تكليف المعلم البديل وإرسال إشعار فوري لجدوله وللإدارة!" : "Substitute assigned and notified!");
                    setShowSubstituteModal(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  {lang === "ar" ? "اعتماد التكليف وإشعار البديل" : "Assign & Notify Substitute"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
