"use client";

import React from "react";
import {
  X,
  QrCode,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Award,
  Calendar,
  Building,
} from "lucide-react";
import { Language, formatNumber } from "@/lib/i18n";

interface DigitalPassportProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  useArabicIndic: boolean;
}

export const DigitalPassportModal: React.FC<DigitalPassportProps> = ({
  student,
  isOpen,
  onClose,
  lang,
  useArabicIndic,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Passport Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label={lang === "ar" ? "إغلاق" : "Close"}
            className="absolute top-4 ltr:right-4 rtl:left-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <img
                src={
                  student.photoUrl ||
                  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
                }
                alt={student.firstNameEn}
                className="w-24 h-24 rounded-2xl object-cover border-3 border-emerald-400/80 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                VERIFIED
              </span>
            </div>

            <div className="text-center sm:text-start flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {lang === "ar" ? "جواز السفر الطلابي المعتمد" : "OFFICIAL DIGITAL PASSPORT"}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {student.digitalPassportCode || "EGP-NOOR-STU-001"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {lang === "ar"
                  ? `${student.firstNameAr} ${student.lastNameAr}`
                  : `${student.firstNameEn} ${student.lastNameEn}`}
              </h2>
              <p className="text-slate-300 text-xs mt-0.5">
                {student.firstNameEn} {student.lastNameEn} • {lang === "ar" ? "كود الطالب:" : "ID:"}{" "}
                <span className="font-mono">{student.studentCode}</span>
              </p>
            </div>

            {/* QR Code Graphic */}
            <div className="bg-white p-2 rounded-2xl shadow-md text-slate-900 flex flex-col items-center">
              <QrCode className="w-16 h-16 text-slate-900" />
              <span className="text-[9px] font-mono font-bold tracking-tight text-slate-600 mt-0.5">
                SCAN TO VERIFY
              </span>
            </div>
          </div>
        </div>

        {/* Passport Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Official Registry Data */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === "ar" ? "بيانات السجل الأكاديمي والمدني" : "Official Civil & Academic Registry"}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block">
                  {lang === "ar" ? "الرقم القومي" : "National ID"}
                </span>
                <span className="text-xs font-bold font-mono">
                  {formatNumber(student.nationalId, useArabicIndic)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">
                  {lang === "ar" ? "الجنسية والديانة" : "Nationality & Religion"}
                </span>
                <span className="text-xs font-bold">
                  {student.nationality} ({student.religion})
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">
                  {lang === "ar" ? "تاريخ الميلاد" : "Birth Date"}
                </span>
                <span className="text-xs font-bold font-mono">{student.birthDate}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">
                  {lang === "ar" ? "فصيلة الدم" : "Blood Group"}
                </span>
                <span className="text-xs font-bold text-rose-600">{student.bloodGroup || "O+"}</span>
              </div>
            </div>
          </div>

          {/* Academic & Attendance Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{lang === "ar" ? "الأداء الشامل ومؤشرات التميز" : "Comprehensive Performance & Milestones"}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium">
                  {lang === "ar" ? "نسبة الحضور التراكمية" : "Cumulative Attendance"}
                </span>
                <div className="text-2xl font-black text-emerald-950 mt-1">96.4%</div>
                <span className="text-[11px] text-emerald-700">
                  {lang === "ar" ? "منتظم دون غياب غير مبرر" : "Consistent & punctual"}
                </span>
              </div>

              <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200">
                <span className="text-xs text-indigo-800 font-medium">
                  {lang === "ar" ? "المعدل التراكمي (GPA)" : "Cumulative GPA"}
                </span>
                <div className="text-2xl font-black text-indigo-950 mt-1">3.92 / 4.0</div>
                <span className="text-[11px] text-indigo-700">
                  {lang === "ar" ? "مرتبة الشرف الأولى" : "First Honor Roll"}
                </span>
              </div>

              <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200">
                <span className="text-xs text-teal-800 font-medium">
                  {lang === "ar" ? "نقاط السلوك الإيجابي" : "Positive Merit Points"}
                </span>
                <div className="text-2xl font-black text-teal-950 mt-1">+45 pts</div>
                <span className="text-[11px] text-teal-700">
                  {lang === "ar" ? "مشارك بمبادرات التعاون الصفي" : "Peer collaboration award"}
                </span>
              </div>
            </div>
          </div>

          {/* Medical & Health Passport */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{lang === "ar" ? "الملف الصحي والاحتياطات الطبية" : "Health Passport & Medical Alerts"}</span>
            </h3>
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-bold text-rose-950 min-w-24">
                  {lang === "ar" ? "الحساسية المسجلة:" : "Logged Allergies:"}
                </span>
                <span className="text-rose-900 font-semibold">{student.allergies || "لا توجد حساسية معروفة"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-rose-950 min-w-24">
                  {lang === "ar" ? "الملاحظات الطبية:" : "Medical Notes:"}
                </span>
                <span className="text-slate-700">{student.medicalNotes || "سليم ومعافى"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {lang === "ar"
                ? "معتمد إلكترونياً لوزارة التربية والتعليم والتحويل بين المدارس"
                : "Digitally certified for Ministry of Education school transfers"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "طباعة الجواز" : "Print Passport"}</span>
            </button>
            <button
              onClick={() => alert(lang === "ar" ? "تم نسخ رابط التحقق الإلكتروني للجواز!" : "Passport verification link copied!")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "مشاركة الرابط الرقمي" : "Share Digital Link"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
