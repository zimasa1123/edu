"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  FileText,
  BookOpen,
  DollarSign,
  Calendar,
  Languages,
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  MessageSquare,
  HelpCircle,
  TrendingDown,
  BrainCircuit,
  FileCheck2,
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { AI_META } from "@/lib/ai";

interface AiHubProps {
  lang: Language;
}

export const AiHubView: React.FC<AiHubProps> = ({ lang }) => {
  const t = translations[lang];

  // Active AI Tool
  const [selectedTool, setSelectedTool] = useState("ocr");
  const [outputData, setOutputData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Inputs for different tools
  const [queryInput, setQueryInput] = useState("طلاب الصف التاسع الغائبين أكثر من 3 أيام ولديهم رسوم متأخرة");
  const [translateText, setTranslateText] = useState("يرجى إرسال شهادة التطعيمات المحدثة إلى عيادة المدرسة قبل نهاية الأسبوع");
  const [essayText, setEssayText] = useState(
    "تعتبر دورة المياه في الطبيعة هي المسؤولة عن تجدد الموارد المائية من خلال التبخر والتكثف وهطول الأمطار على المسطحات المائية واليابسة."
  );

  const toolsList = [
    { id: "command_center", nameAr: "1. مركز الأوامر باللغة الطبيعية", nameEn: "1. Natural Language Command Center", icon: BrainCircuit },
    { id: "early_warning", nameAr: "2. محرك الإنذار المبكر للطلاب", nameEn: "2. Early-Warning Engine", icon: AlertTriangle },
    { id: "parent_bot", nameAr: "3. مساعد ولي الأمر الذكي (عربي)", nameEn: "3. Parent AI Assistant", icon: Bot },
    { id: "report_comments", nameAr: "4. مولد تعليقات بطاقات الشهادات", nameEn: "4. Report Comment Generator", icon: FileText },
    { id: "teacher_copilot", nameAr: "5. مساعد المعلم للدروس والاختبارات", nameEn: "5. Teacher Lesson Copilot", icon: BookOpen },
    { id: "assisted_grading", nameAr: "6. المساعد الذكي لتصحيح المقالات", nameEn: "6. Assisted Essay Grading", icon: FileCheck2 },
    { id: "fee_intelligence", nameAr: "7. ذكاء تحصيل الأقساط والتنبيهات", nameEn: "7. Fee Collection Intelligence", icon: DollarSign },
    { id: "ocr", nameAr: "8. قارئ المستندات وشهادات الميلاد (OCR)", nameEn: "8. Document OCR Extractor", icon: FileSearch },
    { id: "sentiment_triage", nameAr: "9. تصنيف شكاوى أولياء الأمور", nameEn: "9. Sentiment & Complaint Triage", icon: MessageSquare },
    { id: "instant_translate", nameAr: "10. الترجمة التربوية الفورية (عربي/إنجليزي)", nameEn: "10. Instant Educational Translation", icon: Languages },
  ];

  const handleRunTool = async (toolId: string) => {
    setLoading(true);
    setOutputData(null);

    let feature = "";
    let payload: any = {};

    if (toolId === "command_center") {
      feature = "NATURAL_QUERY";
      payload = { query: queryInput, language: lang };
    } else if (toolId === "early_warning") {
      feature = "EARLY_WARNING";
      payload = {
        name: "عمر السيد",
        attendanceRate: 72,
        gradeAverage: 64,
        unpaidFees: 8500,
        incidentCount: 2,
      };
    } else if (toolId === "parent_bot") {
      feature = "PARENT_ASSISTANT";
      payload = {
        question: "ما هو موعد وصول باص يوسف اليوم؟",
        context: { childName: "يوسف حازم", grade: "Grade 4" },
      };
    } else if (toolId === "report_comments") {
      feature = "REPORT_COMMENTS";
      payload = {
        studentName: "يوسف حازم الكيلاني",
        notes: ["متفوق في الرياضيات", "دقيق في الواجبات", "مشارك إيجابي في الفصل"],
        tone: "academic",
        language: "both",
      };
    } else if (toolId === "teacher_copilot") {
      feature = "TEACHER_COPILOT";
      payload = {
        topic: "النظام الشمسي وكواكب المجموعة الشمسية",
        grade: "Grade 4",
        subject: "Science",
        durationMinutes: 45,
        curriculum: "American Diploma",
      };
    } else if (toolId === "assisted_grading") {
      feature = "REPORT_COMMENTS"; // Simulated grading feedback
      payload = {
        studentName: "طالب الصف الرابع",
        notes: ["إجابة مقالية شاملة", "استخدام صحيح لمصطلحات التبخر والتكثف", "صياغة علمية ممتازة"],
        tone: "constructive",
        language: "both",
      };
    } else if (toolId === "fee_intelligence") {
      feature = "FEE_COLLECTION";
      payload = { studentName: "عمر السيد", amount: 8500, overdueDays: 28 };
    } else if (toolId === "ocr") {
      feature = "DOCUMENT_OCR";
      payload = { fileName: "egyptian_birth_certificate.pdf" };
    } else if (toolId === "sentiment_triage") {
      feature = "NATURAL_QUERY";
      payload = { query: "شكوى ولي أمر بخصوص تأخر حافلة المعادي رقم 14", language: "ar" };
    } else if (toolId === "instant_translate") {
      feature = "TRANSLATE";
      payload = { text: translateText };
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, payload }),
      });
      const data = await res.json();
      if (data.success) {
        setOutputData(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Mock Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === "ar" ? "مركز الذكاء الاصطناعي المدرسي المدمج" : "Embedded Educational AI Center"}
            </h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                AI_META.isMock
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-emerald-100 text-emerald-900 border-emerald-300"
              }`}
            >
              {AI_META.isMock ? "Mock Mode Enabled (Deterministic Educational LLM)" : "Connected to Live Provider"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "طبقة خدمات ذكاء اصطناعي محايدة للمزود (Provider-Agnostic)، تحترم خصوصية بيانات الطلاب (RLS)"
              : "Provider-agnostic service layer with RLS privacy compliance and human approval workflows"}
          </p>
        </div>
      </div>

      {/* AI Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tools Navigation */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            {lang === "ar" ? "حزمة أدوات الذكاء الاصطناعي المدمجة:" : "Available AI Tools:"}
          </div>
          <div className="space-y-1">
            {toolsList.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTool(t.id);
                    setOutputData(null);
                  }}
                  className={`w-full flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition text-start ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{lang === "ar" ? t.nameAr : t.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Playground & Output */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {lang === "ar"
                  ? toolsList.find((t) => t.id === selectedTool)?.nameAr
                  : toolsList.find((t) => t.id === selectedTool)?.nameEn}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Safety Guardrails: Active</span>
            </div>

            {/* Tool specific inputs */}
            {selectedTool === "command_center" && (
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">استعلام اللغة الطبيعية باللغة العربية أو الإنجليزية:</label>
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-indigo-500 font-medium"
                />
              </div>
            )}

            {selectedTool === "ocr" && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-center space-y-2">
                <FileSearch className="w-8 h-8 text-indigo-600 mx-auto" />
                <span className="font-bold text-slate-800 block">
                  ملف شهادة الميلاد المميكنة المصرية (egyptian_birth_certificate.pdf)
                </span>
                <span className="text-slate-500 text-[11px] block">
                  محاكاة استخراج الاسم والرقم القومي وتاريخ الميلاد لملء ملف الطالب تلقائياً
                </span>
              </div>
            )}

            {selectedTool === "instant_translate" && (
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">النص المراد ترجمته مع الحفاظ على الأسلوب التربوي:</label>
                <textarea
                  rows={3}
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-indigo-500 font-medium"
                ></textarea>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={() => handleRunTool(selectedTool)}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "جاري المعالجة الذكية..." : "تشغيل الأداة وفحص المخرجات"}</span>
            </button>

            {/* Output Display Box */}
            {outputData && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-indigo-950">مخرجات الذكاء الاصطناعي المعتمدة:</span>
                  </div>
                  <span className="text-[10px] bg-white text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
                    AI-Generated (Human Review Required)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 text-xs space-y-2 font-medium text-slate-800 leading-relaxed overflow-x-auto">
                  <pre className="whitespace-pre-wrap font-sans text-xs">
                    {typeof outputData === "string" ? outputData : JSON.stringify(outputData, null, 2)}
                  </pre>
                </div>

                <div className="text-[11px] text-slate-500 italic">
                  {lang === "ar" ? AI_META.disclaimerAr : AI_META.disclaimerEn}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
