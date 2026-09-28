"use client";

import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  Award,
  AlertTriangle,
  Lock,
  Plus,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";

interface BehaviorProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const BehaviorView: React.FC<BehaviorProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [incidents, setIncidents] = useState<any[]>([]);
  const [counselorCases, setCounselorCases] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"merits" | "counselor">("merits");

  useEffect(() => {
    fetch("/api/operations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIncidents(data.incidents);
          setCounselorCases(data.counselorCases);
        }
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "السلوك والرعاية النفسية والإرشاد الطلابي" : "Wellbeing, Behavior & Counseling"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "رصد نقاط التميز السلوكي، مخالفات الانضباط، والحالات الإرشادية السرية"
              : "Positive merits, infractions log, and confidential counselor case files"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("merits")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "merits"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{lang === "ar" ? "النقاط والملاحظات السلوكية" : "Merits & Infractions"}</span>
          </button>
          <button
            onClick={() => setActiveTab("counselor")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "counselor"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{lang === "ar" ? "ملفات الإرشاد النفسي (سري)" : "Counseling Cases (Confidential)"}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Merits & Incidents */}
      {activeTab === "merits" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 text-xs">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {inc.studentNameAr} {inc.studentLastNameAr}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.type === "merit"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {inc.type === "merit" ? "وسام تميز إيجابي" : "مخالفة انضباطية"}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800">{inc.title}</div>
                  <div className="text-slate-600">{inc.description}</div>
                  {inc.actionTaken && (
                    <div className="text-indigo-700 font-medium">الإجراء المتخذ: {inc.actionTaken}</div>
                  )}
                </div>

                <div className="text-end">
                  <span
                    className={`text-base font-black px-3 py-1 rounded-xl font-mono ${
                      inc.points > 0
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {inc.points > 0 ? `+${inc.points}` : inc.points} نقطة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Confidential Counselor Cases */}
      {activeTab === "counselor" && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {lang === "ar"
                ? "تنبيه خصوصية: هذه السجلات مشفرة ومقيدة الصلاحية (RLS) ومتاحة فقط للأخصائي النفسي والمدير."
                : "Privacy Notice: Encrypted and RLS-restricted to School Counselors and Principal."}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counselorCases.map((cs) => (
              <div key={cs.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      الطالب: {cs.studentNameAr} {cs.studentLastNameAr}
                    </h3>
                    <span className="text-slate-500 text-[11px]">{cs.caseCategory}</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {cs.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-800">{cs.caseTitle}</div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    "{cs.confidentialNotes}"
                  </p>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950">
                    <span className="font-bold block mb-0.5">خطة التدخل والدعم:</span>
                    <span>{cs.interventionPlan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
