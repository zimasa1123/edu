"use client";

import React, { useState } from "react";
import {
  Home,
  Bus,
  Sparkles,
  BookOpen,
  Calendar,
  Send,
  MessageCircle,
  CreditCard,
  User,
  CheckCircle,
  Clock,
  ShieldCheck,
  Bot,
  FileText,
} from "lucide-react";
import { Language, translations, formatCurrency } from "@/lib/i18n";

interface PortalsProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const PortalsView: React.FC<PortalsProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [activePortal, setActivePortal] = useState<"parent" | "student" | "teacher">("parent");

  // Parent Portal State
  const [selectedChild, setSelectedChild] = useState("youssef");
  const [parentChatQuery, setParentChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; sources?: string[] }>>([
    {
      sender: "ai",
      text:
        lang === "ar"
          ? "أهلاً بك م. حازم! أنا المساعد الذكي الخاص بولي الأمر لمدارس النور. يمكنني إفادتك فوراً بجدول يوسف، نتائج الامتحانات، موقع حافلته المدرسية، أو موعد الأقساط."
          : "Welcome Eng. Hazem! I am your AI Parent Assistant. Ask me about Youssef's attendance, bus location, homework, or tuition.",
    },
  ]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Teacher Copilot State
  const [copilotTopic, setCopilotTopic] = useState("الكسور والعمليات الحسابية العشرية");
  const [lessonPlanResult, setLessonPlanResult] = useState<any>(null);
  const [loadingCopilot, setLoadingCopilot] = useState(false);

  const handleSendParentChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentChatQuery.trim()) return;

    const userText = parentChatQuery;
    setParentChatQuery("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoadingChat(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "PARENT_ASSISTANT",
          payload: {
            question: userText,
            context: {
              childName: selectedChild === "youssef" ? "يوسف" : "زينة",
              grade: "الصف الرابع الابتدائي (Grade 4)",
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: lang === "ar" ? data.result.answerAr : data.result.answerEn,
            sources: data.result.sources,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleGenerateLessonPlan = async () => {
    setLoadingCopilot(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "TEACHER_COPILOT",
          payload: {
            topic: copilotTopic,
            grade: "Grade 4",
            subject: "Mathematics",
            durationMinutes: 45,
            curriculum: "American Diploma",
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLessonPlanResult(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCopilot(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePortal("parent")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activePortal === "parent"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.parentPortal}</span>
          </button>

          <button
            onClick={() => setActivePortal("student")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activePortal === "student"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.studentPortal}</span>
          </button>

          <button
            onClick={() => setActivePortal("teacher")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activePortal === "teacher"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.teacherPortal}</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:block">
          {lang === "ar" ? "بوابات مخصصة للهاتف والحاسوب" : "Role-Tailored Responsive Portals"}
        </span>
      </div>

      {/* 1. PARENT PORTAL */}
      {activePortal === "parent" && (
        <div className="space-y-6">
          {/* Child Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-slate-600">{lang === "ar" ? "اختر الابن:" : "Select Child:"}</span>
              <button
                onClick={() => setSelectedChild("youssef")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedChild === "youssef"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                يوسف حازم (Grade 4)
              </button>
              <button
                onClick={() => setSelectedChild("zeina")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedChild === "zeina"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                زينة المهدي (Grade 4)
              </button>
            </div>
            <div className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {lang === "ar" ? "نسبة الحضور: 96%" : "Attendance: 96%"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 cols: Live Bus Tracker & Fees & Homework */}
            <div className="lg:col-span-2 space-y-5">
              {/* Live Bus Tracking Card */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 rounded-3xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">
                        {lang === "ar" ? "تتبع الحافلة المدرسية مباشرة (GPS)" : "Live Bus Tracking"}
                      </h3>
                      <p className="text-xs text-white/80">خط المعادي - حافلة 14</p>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-white text-orange-950 px-3 py-1 rounded-full animate-pulse">
                    وصول خلال 12 دقيقة
                  </span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl text-xs space-y-1">
                  <div>الموقع الحالي: ميدان فيكتوريا - دجلة المعادي</div>
                  <div>السائق: عماد فتحي (+20 100 443 1188)</div>
                  <div>نقطة الصعود: شارع 216 المعادي أمام بنك CIB</div>
                </div>
              </div>

              {/* Homework & Academic Updates */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  {lang === "ar" ? "الواجبات والتكليفات المستحقة هذا الأسبوع" : "Active Homework & Assignments"}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">واجب الرياضيات: جمع وطرح الكسور العشرية</span>
                      <span className="text-slate-500 text-[11px]">مستحق غداً الساعة 8:00 صباحاً</span>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold">
                      تم التسليم ✓
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">مشروع العلوم: مجسم دورة المياه</span>
                      <span className="text-slate-500 text-[11px]">مستحق يوم الخميس القادم</span>
                    </div>
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg font-bold">
                      قيد التنفيذ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right col: AI Parent Assistant Chatbot */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[520px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">المساعد الذكي لولي الأمر (Arabic AI)</h4>
                  <span className="text-[10px] text-indigo-300">متصل ببيانات ابنك فقط ومحمي بالكامل</span>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none shadow-xs"
                          : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-2xs font-medium"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sources && (
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        المصدر: {msg.sources.join("، ")}
                      </span>
                    )}
                  </div>
                ))}
                {loadingChat && (
                  <div className="text-slate-400 text-xs italic p-2">جاري البحث في سجلات الطالب...</div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendParentChat} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={parentChatQuery}
                  onChange={(e) => setParentChatQuery(e.target.value)}
                  placeholder="اسأل عن الواجب، الرسوم، أو الحافلة..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loadingChat}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENT PORTAL */}
      {activePortal === "student" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md">
            <h2 className="text-xl font-black">مرحباً يا يوسف! استعد ليوم دراسي رائع 🚀</h2>
            <p className="text-xs text-indigo-200 mt-1">لديك 4 حصص اليوم وواجب رياضيات مستحق الغد.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Timetable Today */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">جدول الحصص لليوم</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">الحصة الأولى: الرياضيات</span>
                    <span className="text-slate-500">أ. أحمد فؤاد • غرفة 204</span>
                  </div>
                  <span className="text-indigo-600 font-mono font-bold">08:00 - 08:45</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">الحصة الثانية: العلوم العامة</span>
                    <span className="text-slate-500">معمل الأحياء 1</span>
                  </div>
                  <span className="text-indigo-600 font-mono font-bold">08:50 - 09:35</span>
                </div>
              </div>
            </div>

            {/* AI Study Helper Card */}
            <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-indigo-950 text-sm">رفيق المذاكرة الذكي (AI Study Helper)</h3>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                هل تحتاج لمساعدة في فهم مفهوم "تبسيط الكسور العشرية"؟ اسألني لأشرح لك الخطوات خطوة بخطوة دون إعطاء
                الحل النهائي لضمان فهمك العميق!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب سؤالك في الدرس..."
                  className="flex-1 bg-white border border-indigo-200 rounded-xl p-2 text-xs focus:outline-indigo-500"
                />
                <button
                  onClick={() => alert("شرح الخطوات: عند قسمة بسط ومقام الكسر على القاسم المشترك الأكبر ينتج أبسط صورة!")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  شرح
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TEACHER PORTAL & COPILOT */}
      {activePortal === "teacher" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                بوابة المعلم: أ. أحمد فؤاد (كبير معلمي الرياضيات)
              </h2>
              <p className="text-xs text-slate-500">جدول الحصص اليومية، رصد الحضور السريع، ومساعد التخطيط AI</p>
            </div>
            <button
              onClick={handleGenerateLessonPlan}
              disabled={loadingCopilot}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{loadingCopilot ? "جاري التوليد..." : "توليد خطة درس واختبار بالذكاء الاصطناعي"}</span>
            </button>
          </div>

          {/* Teacher Copilot Generated Lesson Plan */}
          {lessonPlanResult && (
            <div className="bg-indigo-50/70 p-5 rounded-3xl border border-indigo-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                <h3 className="font-bold text-indigo-950 text-base">{lessonPlanResult.title}</h3>
                <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full">
                  AI Lesson Plan
                </span>
              </div>

              {/* Objectives */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">الأهداف التعليمية المعتمدة:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {lessonPlanResult.learningObjectivesAr.map((obj: string, idx: number) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Lesson Timeline */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">مراحل سير الحصة (45 دقيقة):</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {lessonPlanResult.timeline.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="font-bold text-indigo-700 block font-mono">{item.minute} دقيقة</span>
                      <span className="text-slate-800 text-[11px] block">{item.activityAr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz Questions */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">أسئلة التقويم المقترحة:</span>
                {lessonPlanResult.suggestedQuizQuestions.map((q: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900">{q.questionAr}</span>
                    <div className="text-[11px] text-slate-500">النوع: {q.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
