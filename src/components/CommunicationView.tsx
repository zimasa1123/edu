"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Share2,
  Copy,
  Check,
  Bell,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";

interface CommunicationProps {
  lang: Language;
  announcements: any[];
}

export const CommunicationView: React.FC<CommunicationProps> = ({ lang, announcements }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  // Auto WhatsApp Digest Text in Arabic
  const digestText = `السلام عليكم ورحمة الله وبركاته،
حضرة المهندس حازم الكيلاني المحترم،
إليك التقرير الأسبوعي الشامل لنجلك (يوسف حازم - الصف الرابع الابتدائي):
📅 نسبة الحضور هذا الأسبوع: 100% (بدون أي تأخير)
⭐ المستوى الأكاديمي: ممتاز (A+) في الرياضيات والعلوم
🏆 وسام السلوك: تم منحه وسام التميز لمساعدة زملائه في الحصة
🚌 النقل المدرسي: الحافلة 14 تسير بانتظام وموعد الوصول اليوم 3:20 عصراً
💳 المصروفات: مسددة بالكامل ولا توجد أي متأخرات.
مع تحيات إدارة مدارس النور الدولية.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "مركز التواصل والرسائل المدرسية" : "Communication Hub & WhatsApp Digest"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "التعميمات الرسمية، الملخص الأسبوعي التلقائي عبر واتساب، ونظام تذاكر الشكاوى"
              : "Official bulletins, automated parent WhatsApp digests, and SLA-backed tickets"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Weekly Digest Generator Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === "ar" ? "الملخص الأسبوعي التلقائي لأولياء الأمور (واتساب)" : "Weekly WhatsApp Digest Generator"}
              </h3>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Auto-Generated
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {lang === "ar"
              ? "يتم تجميع حضور ودرجات وسلوك وموقع باص الطالب تلقائياً وإرسالها لولي الأمر كل خميس."
              : "Aggregates attendance, grades, merits, and bus schedule into a concise weekly update."}
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
            {digestText}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === "ar" ? "تم النسخ!" : "Copied!") : lang === "ar" ? "نسخ النص" : "Copy Digest"}</span>
            </button>
            <button
              onClick={() => alert(lang === "ar" ? "تم إرسال الملخص الأسبوعي لواتساب ولي الأمر!" : "Digest dispatched via WhatsApp API!")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{lang === "ar" ? "إرسال عبر واتساب الآن" : "Send WhatsApp"}</span>
            </button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === "ar" ? "التعميمات الإدارية المعتمدة" : "Active School Announcements"}
            </h3>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {lang === "ar" ? ann.titleAr : ann.titleEn}
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {ann.targetRole}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {lang === "ar" ? ann.contentAr : ann.contentEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
