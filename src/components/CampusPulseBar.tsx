"use client";

import React from "react";
import { Activity, Bus, HeartPulse, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Language } from "@/lib/i18n";

interface CampusPulseProps {
  lang: Language;
  pulseData: {
    clinicVisits: any[];
    incidents: any[];
    busesEnRoute: number;
    totalBuses: number;
  };
  attendanceRate: number;
}

export const CampusPulseBar: React.FC<CampusPulseProps> = ({ lang, pulseData, attendanceRate }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 border-b border-indigo-900/40 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wide uppercase text-[11px] text-emerald-400">
            {lang === "ar" ? "نبض الحرم المدرسي الحي" : "LIVE CAMPUS PULSE"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          {/* Fleet Status */}
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <Bus className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {lang === "ar"
                ? `الحافلات المتحركة: ${pulseData.busesEnRoute} من أصل ${pulseData.totalBuses}`
                : `Buses en route: ${pulseData.busesEnRoute} of ${pulseData.totalBuses}`}
            </span>
          </div>

          {/* Today's Attendance */}
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lang === "ar" ? `نسبة الحضور: ${attendanceRate}%` : `Attendance Rate: ${attendanceRate}%`}
            </span>
          </div>

          {/* Clinic Visits Today */}
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {lang === "ar"
                ? `زيارات العيادة: ${pulseData.clinicVisits.length} حالة مستقرة`
                : `Clinic visits: ${pulseData.clinicVisits.length} stable`}
            </span>
          </div>

          {/* Active Incidents */}
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {lang === "ar" ? "مستوى الأمان: الدرجة أ (طبيعي)" : "Campus Security: Level A (Normal)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
