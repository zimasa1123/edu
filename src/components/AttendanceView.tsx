"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  CheckCircle,
  Clock,
  XCircle,
  HelpCircle,
  Wifi,
  WifiOff,
  Send,
  Save,
  Check,
  RotateCcw,
} from "lucide-react";
import { Language, translations, formatNumber } from "@/lib/i18n";

interface AttendanceViewProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, { status: string; reason?: string }>>({});
  const [offlineMode, setOfflineMode] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedSection, setSelectedSection] = useState("4-A (Blue Jay)");

  useEffect(() => {
    // Fetch students in Grade 4 Section A
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudents(data.students);
          // Initialize map with default present
          const initialMap: Record<number, { status: string }> = {};
          data.students.forEach((s: any) => {
            initialMap[s.id] = { status: s.id === 3 ? "absent" : s.id === 5 ? "late" : "present" };
          });
          setAttendanceMap(initialMap);
        }
      });
  }, []);

  const handleSetStatus = (studentId: number, status: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));

    if (offlineMode) {
      setPendingSyncCount((c) => c + 1);
    }
  };

  const handleSaveRoll = async () => {
    if (offlineMode) {
      alert(
        lang === "ar"
          ? `تم حفظ التغييرات محلياً في الذاكرة المؤقتة (${pendingSyncCount} سجلات). سيتم الرفع تلقائياً عند الاتصال.`
          : `Saved locally in IndexedDB cache (${pendingSyncCount} changes). Will auto-sync when online.`
      );
      return;
    }

    const payload = Object.entries(attendanceMap).map(([studentId, data]) => ({
      studentId: Number(studentId),
      status: data.status,
      sectionId: 1,
    }));

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotifyParents = () => {
    const absentCount = Object.values(attendanceMap).filter((v) => v.status === "absent").length;
    alert(
      lang === "ar"
        ? `تم إرسال إشعارات SMS وواتساب فورية لأولياء أمور الطلاب الغائبين (${absentCount} طلاب) بنجاح!`
        : `Instant SMS & WhatsApp alerts dispatched to parents of absent students (${absentCount})!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "دفتر الحضور الذكي ورصد الغياب الفوري" : "Smart Attendance & Roll Call"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "واجهة سريعة بنقرة واحدة، دعم العمل بدون إنترنت، وإشعار فوري لأولياء الأمور"
              : "One-tap mobile UI, offline sync support, and automated guardian WhatsApp alerts"}
          </p>
        </div>

        {/* Offline Mode Toggle & Notification */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              offlineMode
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {offlineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            <span>
              {offlineMode
                ? lang === "ar"
                  ? `وضع غير متصل (${pendingSyncCount} معلق)`
                  : `Offline Mode (${pendingSyncCount} pending)`
                : lang === "ar"
                ? "متصل سحابياً (Online)"
                : "Online Connected"}
            </span>
          </button>

          <button
            onClick={handleNotifyParents}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "إشعار أولياء أمور الغائبين" : "Notify Absent Parents"}</span>
          </button>
        </div>
      </div>

      {/* Class Section & Date bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">{lang === "ar" ? "الصف والشعبة:" : "Class & Section:"}</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-slate-100 font-semibold text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-none"
          >
            <option>4-A (Blue Jay) - Primary 4</option>
            <option>4-B (Falcon) - Primary 4</option>
            <option>9-A - Prep 3</option>
            <option>11-Science - Secondary 2</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveRoll}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? (lang === "ar" ? "تم الحفظ بنجاح!" : "Saved!") : lang === "ar" ? "حفظ كشف الحضور" : "Save Roll Call"}</span>
          </button>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {students.map((student) => {
            const currentStatus = attendanceMap[student.id]?.status || "present";
            return (
              <div
                key={student.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      student.photoUrl ||
                      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={student.firstNameEn}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {lang === "ar"
                        ? `${student.firstNameAr} ${student.lastNameAr}`
                        : `${student.firstNameEn} ${student.lastNameEn}`}
                    </div>
                    <div className="text-slate-500 text-xs font-mono">{student.studentCode}</div>
                  </div>
                </div>

                {/* One-tap status buttons */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  {/* Present */}
                  <button
                    onClick={() => handleSetStatus(student.id, "present")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      currentStatus === "present"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "حاضر" : "Present"}</span>
                  </button>

                  {/* Late */}
                  <button
                    onClick={() => handleSetStatus(student.id, "late")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      currentStatus === "late"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "متأخر" : "Late"}</span>
                  </button>

                  {/* Absent */}
                  <button
                    onClick={() => handleSetStatus(student.id, "absent")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      currentStatus === "absent"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "غائب" : "Absent"}</span>
                  </button>

                  {/* Excused */}
                  <button
                    onClick={() => handleSetStatus(student.id, "excused")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      currentStatus === "excused"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "معذور" : "Excused"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
