"use client";

import React, { useState, useEffect } from "react";
import {
  Bus,
  HeartPulse,
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  X,
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";

interface OperationsProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const OperationsView: React.FC<OperationsProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [routes, setRoutes] = useState<any[]>([]);
  const [clinic, setClinic] = useState<any[]>([]);
  const [library, setLibrary] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"fleet" | "clinic" | "library">("fleet");

  useEffect(() => {
    fetch("/api/operations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoutes(data.routes);
          setClinic(data.clinic);
          setLibrary(data.library);
        }
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header and Sub Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "العمليات والمرافق والأسطول المدرسي" : "Operations, Fleet & Facilities"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "متابعة أسطول الحافلات المدرسية بالـ GPS، زيارات العيادة، وفهرس المكتبة"
              : "Live bus fleet telemetry, school clinic logs, and digital library catalog"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("fleet")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === "fleet"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>{lang === "ar" ? "الحافلات والنقل" : "Transport Fleet"}</span>
          </button>
          <button
            onClick={() => setActiveSubTab("clinic")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === "clinic"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>{lang === "ar" ? "العيادة الطبية" : "School Clinic"}</span>
          </button>
          <button
            onClick={() => setActiveSubTab("library")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === "library"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === "ar" ? "المكتبة والكتب" : "Library"}</span>
          </button>
        </div>
      </div>

      {/* Fleet View */}
      {activeSubTab === "fleet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div key={route.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === "ar" ? route.nameAr : route.nameEn}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">لوحة: {route.busPlateNumber}</span>
                </div>
                <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full animate-pulse">
                  {route.currentStatus === "morning_pickup" ? "في طريقها للطلاب" : "وصلت الحرم المدرسي"}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>السائق:</span>
                  <span className="font-semibold text-slate-800">{route.driverName} ({route.driverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span>المشرفة:</span>
                  <span className="font-semibold text-slate-800">{route.supervisorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>المحطة الحالية:</span>
                  <span className="font-bold text-indigo-700">{route.currentStopName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clinic View */}
      {activeSubTab === "clinic" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
            سجل زيارات العيادة المدرسية والفحوصات
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {clinic.map((c) => (
              <div key={c.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    الطالب: {c.studentNameAr} {c.studentLastNameAr} ({c.studentCode})
                  </div>
                  <div className="text-slate-600 mt-0.5">الشكوى: {c.complaint}</div>
                  <div className="text-emerald-700 mt-1 font-medium">العلاج: {c.treatmentGiven}</div>
                </div>
                <div className="text-end">
                  <span className="text-xs font-bold font-mono text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 block mb-1">
                    الحرارة: {c.temperature}
                  </span>
                  <span className="text-[11px] text-slate-400">تم إشعار ولي الأمر: {c.parentNotified ? "نعم ✓" : "لا"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Library View */}
      {activeSubTab === "library" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {library.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
              <div className="text-slate-500">المؤلف: {b.author}</div>
              <div className="text-slate-500 font-mono">ISBN: {b.isbn}</div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold">
                <span>النسخ المتاحة:</span>
                <span className="text-emerald-600">{b.availableCopies} من أصل {b.totalCopies}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
