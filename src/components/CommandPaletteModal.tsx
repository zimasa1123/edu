"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, X, ArrowRight, CornerDownLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { NavTab } from "./Sidebar";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigate: (tab: NavTab) => void;
  onSelectStudent: (studentId: number) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigate,
  onSelectStudent,
}) => {
  const [query, setQuery] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle palette
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAskAi = async () => {
    if (!query.trim()) return;
    setLoadingAi(true);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "NATURAL_QUERY",
          payload: { query, language: lang },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const quickNavigations: Array<{ labelAr: string; labelEn: string; tab: NavTab }> = [
    { labelAr: "لوحة القيادة التنفيذية ومؤشرات الأداء", labelEn: "Executive Dashboard & KPIs", tab: "dashboard" },
    { labelAr: "قمع القبول وطلبات الالتحاق (CRM)", labelEn: "Admissions Pipeline & Leads", tab: "admissions" },
    { labelAr: "سجلات الطلاب وجواز السفر الرقمي", labelEn: "Student SIS & Digital Passports", tab: "sis" },
    { labelAr: "المالية والأقساط والفواتير المتأخرة", labelEn: "Finance, Invoices & Overdue", tab: "finance" },
    { labelAr: "محاكي قرارات المالك المالي (What-If)", labelEn: "Owner's Financial What-If Simulator", tab: "simulator" },
    { labelAr: "مركز أدوات الذكاء الاصطناعي الـ 15", labelEn: "AI Command Center (15 Tools)", tab: "ai_hub" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAskAi();
            }}
            placeholder={
              lang === "ar"
                ? "ابحث أو اسأل بالذكاء الاصطناعي: (مثال: طلاب غائبين 3 أيام مع رسوم متأخرة)..."
                : "Search or ask AI: (e.g. 'students absent 3 days with overdue fees')..."
            }
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={handleAskAi}
              disabled={loadingAi}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              {loadingAi ? (
                <span>{lang === "ar" ? "جاري الفحص..." : "Analyzing..."}</span>
              ) : (
                <>
                  <span>{lang === "ar" ? "تنفيذ ذكي" : "Run AI Query"}</span>
                  <CornerDownLeft className="w-3 h-3" />
                </>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Result Box */}
        {aiResult && (
          <div className="p-4 bg-indigo-50/70 border-b border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-900">
                  {lang === "ar" ? "نتيجة الاستعلام الآمن عبر الذكاء الاصطناعي:" : "AI Verified Query Result:"}
                </span>
                <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
                  {lang === "ar" ? "استعلام محمي RLS" : "RLS Protected"}
                </span>
              </div>
              <span className="text-[10px] text-indigo-600 font-mono">Mock LLM Deterministic</span>
            </div>
            <p className="text-sm text-slate-800 font-medium mb-2 leading-relaxed">
              {lang === "ar" ? aiResult.summaryAr : aiResult.summaryEn}
            </p>
            {aiResult.sqlDescription && (
              <div className="text-[11px] font-mono bg-white/80 p-2 rounded border border-indigo-200 text-indigo-950 mb-2">
                {aiResult.sqlDescription}
              </div>
            )}
            {aiResult.matchedStudentIds?.includes(3) && (
              <div className="mt-2 flex items-center justify-between bg-white p-2.5 rounded-xl border border-indigo-200 shadow-xs">
                <div className="text-xs">
                  <div className="font-bold text-slate-900">عمر السيد (Omar El-Sayed)</div>
                  <div className="text-slate-500">الصف التاسع - درجة الخطر: 78% (متأخرات 8,500 ج.م)</div>
                </div>
                <button
                  onClick={() => {
                    onSelectStudent(3);
                    onClose();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1 rounded-lg font-medium transition"
                >
                  {lang === "ar" ? "فتح الملف" : "View Profile"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Navigations */}
        <div className="p-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            {lang === "ar" ? "الانتقال السريع للأقسام" : "Quick Section Jumps"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {quickNavigations.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition text-start border border-transparent hover:border-slate-200"
              >
                <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === "ar" ? "استعلامات معزولة بصلاحيات الدور (RBAC)" : "Role-isolated secure queries (RBAC)"}</span>
          </div>
          <span>Esc {lang === "ar" ? "للإغلاق" : "to close"}</span>
        </div>
      </div>
    </div>
  );
};
