"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  FileCheck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Layers,
} from "lucide-react";
import { Language, translations, formatNumber } from "@/lib/i18n";

interface AcademicsProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const AcademicsView: React.FC<AcademicsProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [timetable, setTimetable] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState("American Diploma");
  const [activeTab, setActiveTab] = useState<"timetable" | "assessments" | "gradebook">("timetable");

  // AI Comment Generator State
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentStudentName, setCommentStudentName] = useState("يوسف حازم الكيلاني");
  const [commentNotes, setCommentNotes] = useState("متميز في الهندسة، متعاون مع زملائه، يحتاج تركيز أطول في المسائل اللفظية");
  const [generatedComment, setGeneratedComment] = useState<any>(null);
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
    fetch("/api/academics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTimetable(data.timetable);
          setAssessments(data.assessments);
          setGrades(data.grades);
        }
      });
  }, []);

  const handleGenerateComment = async () => {
    setLoadingComment(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "REPORT_COMMENTS",
          payload: {
            studentName: commentStudentName,
            notes: commentNotes.split("،").map((n) => n.trim()),
            tone: "encouraging",
            language: "both",
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedComment(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComment(false);
    }
  };

  const daysOfWeek = [
    { key: "Sunday", ar: "الأحد", en: "Sunday" },
    { key: "Monday", ar: "الاثنين", en: "Monday" },
    { key: "Tuesday", ar: "الثلاثاء", en: "Tuesday" },
    { key: "Wednesday", ar: "الأربعاء", en: "Wednesday" },
    { key: "Thursday", ar: "الخميس", en: "Thursday" },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Curriculum Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "الشؤون الأكاديمية والجدول المدرسي" : "Academics, Curriculum & Gradebook"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "إدارة المناهج (مصري، بريطاني، أمريكي، أردني، IB)، الجدول الأسبوعي، ومساعد تقارير الشهادات"
              : "Curriculums, master timetable matrix, weighted assessments, and AI report card comments"}
          </p>
        </div>

        {/* AI Comment Generator Button */}
        <button
          onClick={() => setShowCommentModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{lang === "ar" ? "توليد تعليق الشهادة بالذكاء الاصطناعي" : "AI Report Comment Generator"}</span>
        </button>
      </div>

      {/* Tabs & Curriculum selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("timetable")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === "timetable"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {lang === "ar" ? "الجدول الأسبوعي" : "Weekly Timetable"}
          </button>
          <button
            onClick={() => setActiveTab("assessments")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === "assessments"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {lang === "ar" ? "الاختبارات والواجبات" : "Assessments"}
          </button>
          <button
            onClick={() => setActiveTab("gradebook")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === "gradebook"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {lang === "ar" ? "سجل الدرجات والشهادات" : "Gradebook & Report Cards"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold">{lang === "ar" ? "المنهج:" : "Curriculum:"}</span>
          <select
            value={selectedCurriculum}
            onChange={(e) => setSelectedCurriculum(e.target.value)}
            className="bg-slate-100 font-semibold text-slate-800 rounded-lg px-2.5 py-1 border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option>American Diploma</option>
            <option>British Cambridge / IGCSE</option>
            <option>Egyptian National Thanaweya</option>
            <option>Jordanian Tawjihi National</option>
            <option>International Baccalaureate (IB)</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Timetable Matrix */}
      {activeTab === "timetable" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === "ar" ? "جدول الحصص الأسبوعي - الصف الرابع (شعبة أ)" : "Weekly Timetable - Grade 4 (Section A)"}
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Building B - Room 204
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {daysOfWeek.map((day) => {
              const daySlots = timetable.filter((t) => t.dayOfWeek === day.key);
              return (
                <div key={day.key} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1.5 flex items-center justify-between">
                    <span>{lang === "ar" ? day.ar : day.en}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {daySlots.length ? `${daySlots.length} حصص` : "عطلة"}
                    </span>
                  </div>

                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs space-y-1 text-xs"
                    >
                      <div className="font-bold text-indigo-950">
                        {lang === "ar" ? slot.subjectNameAr : slot.subjectNameEn}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {lang === "ar" ? slot.teacherNameAr : slot.teacherNameEn}
                      </div>
                    </div>
                  ))}

                  {daySlots.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs italic">
                      {lang === "ar" ? "حصة نشاط / مراجعة" : "Activity / Study hall"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Assessments */}
      {activeTab === "assessments" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
            {lang === "ar" ? "جدول التقييمات والاختبارات الفصلية" : "Assessments & Quizzes"}
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {assessments.map((ass) => (
              <div key={ass.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{ass.title}</div>
                  <div className="text-slate-500">
                    {ass.subjectNameAr} • {lang === "ar" ? "النوع:" : "Type:"} {ass.type} • {lang === "ar" ? "الوزن النسبي:" : "Weight:"} {ass.weight}%
                  </div>
                  <div className="text-[11px] text-slate-400">{ass.description}</div>
                </div>

                <div className="text-end">
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200 font-mono block mb-1">
                    الدرجة العظمى: {ass.maxScore}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">تاريخ التسليم: {ass.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Gradebook */}
      {activeTab === "gradebook" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
            {lang === "ar" ? "دفتر درجات الطلاب وملاحظات المدرسين" : "Gradebook Results & Feedback"}
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {grades.map((gr) => (
              <div key={gr.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {lang === "ar" ? gr.studentNameAr : gr.studentNameEn}
                  </div>
                  <div className="text-slate-500 text-[11px]">{gr.assessmentTitle}</div>
                  <div className="text-slate-700 mt-1 italic">"{gr.feedback}"</div>
                  {gr.aiGeneratedFeedback && (
                    <div className="text-indigo-800 text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                      توصية الذكاء الاصطناعي: {gr.aiGeneratedFeedback}
                    </div>
                  )}
                </div>

                <div className="text-end">
                  <span className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 font-mono">
                    {gr.score} / 100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Report Card Comment Generator Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-indigo-50/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="font-black text-indigo-950 text-base">
                  {lang === "ar" ? "مولد تعليقات بطاقات الدرجات بالذكاء الاصطناعي" : "AI Report Card Comment Generator"}
                </h3>
              </div>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم الطالب</label>
                <input
                  type="text"
                  value={commentStudentName}
                  onChange={(e) => setCommentStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ملاحظات ونقاط المعلم السريعة (Bullet Notes)
                </label>
                <textarea
                  rows={3}
                  value={commentNotes}
                  onChange={(e) => setCommentNotes(e.target.value)}
                  placeholder="اكتب نقاط مختصرة تفصلها فواصل..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleGenerateComment}
                disabled={loadingComment}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingComment ? "جاري الصياغة التربوية..." : "صياغة تعليق احترافي ثنائي اللغة"}</span>
              </button>

              {/* Generated Comments */}
              {generatedComment && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-950 block mb-1">الصياغة باللغة العربية:</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{generatedComment.commentAr}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-950 block mb-1">English Wording:</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{generatedComment.commentEn}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {t.cancel}
                </button>
                {generatedComment && (
                  <button
                    onClick={() => {
                      alert(lang === "ar" ? "تم اعتماد وحفظ التعليق في شهادة الطالب!" : "Comment saved to report card!");
                      setShowCommentModal(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs"
                  >
                    {lang === "ar" ? "اعتماد وإدراج في الشهادة" : "Approve & Insert"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
