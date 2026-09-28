"use client";

import React from "react";
import {
  Globe,
  Calendar,
  Sparkles,
  Command,
  RefreshCw,
  School,
  UserCheck,
  ChevronDown,
  Activity,
  Layers,
} from "lucide-react";
import { Language, translations, getDualDate } from "@/lib/i18n";

export interface UserPersona {
  id: number;
  email: string;
  fullNameAr: string;
  fullNameEn: string;
  role: string;
}

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  useArabicIndic: boolean;
  onToggleNumerals: () => void;
  currentRole: string;
  onRoleChange: (role: string) => void;
  activeBranchId: number;
  onBranchChange: (branchId: number) => void;
  onOpenCommandPalette: () => void;
  onReseedData: () => void;
  isReseeding: boolean;
  branches: Array<{ id: number; nameAr: string; nameEn: string; code: string }>;
  users: UserPersona[];
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  useArabicIndic,
  onToggleNumerals,
  currentRole,
  onRoleChange,
  activeBranchId,
  onBranchChange,
  onOpenCommandPalette,
  onReseedData,
  isReseeding,
  branches,
  users,
}) => {
  const t = translations[lang];
  const { gregorian, hijri } = getDualDate(new Date(), lang);

  const roleLabels: Record<string, { ar: string; en: string; color: string }> = {
    super_admin: { ar: "سوبر أدمن (كريم الشريف)", en: "Super Admin (Karim)", color: "bg-purple-100 text-purple-800" },
    school_owner: { ar: "مالك المدارس (الحاج عصام)", en: "School Owner (Essam)", color: "bg-amber-100 text-amber-800" },
    principal: { ar: "المدير التنفيذي (د. طارق)", en: "Principal (Dr. Tarek)", color: "bg-emerald-100 text-emerald-800" },
    registrar: { ar: "مسؤولة التسجيل والقبول (أ. نورهان)", en: "Registrar (Nourhan)", color: "bg-blue-100 text-blue-800" },
    accountant: { ar: "المدير المالي (أ. مجدي)", en: "Accountant (Magdy)", color: "bg-cyan-100 text-cyan-800" },
    teacher: { ar: "معلم الرياضيات (أ. أحمد فؤاد)", en: "Teacher (Ahmed)", color: "bg-indigo-100 text-indigo-800" },
    counselor: { ar: "الأخصائية النفسية (د. سلمى)", en: "Counselor (Dr. Salma)", color: "bg-pink-100 text-pink-800" },
    nurse: { ar: "طبيبة العيادة (م. هالة)", en: "Nurse (Hala)", color: "bg-rose-100 text-rose-800" },
    transport_manager: { ar: "مسؤول النقل (ك. محمود)", en: "Transport (Capt. Mahmoud)", color: "bg-orange-100 text-orange-800" },
    parent: { ar: "ولي أمر (م. حازم الكيلاني)", en: "Parent (Hazem El-Kilany)", color: "bg-teal-100 text-teal-800" },
    student: { ar: "طالب (يوسف حازم)", en: "Student (Youssef)", color: "bg-violet-100 text-violet-800" },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Campus Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">EduNexus</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {t.demoBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {lang === "ar" ? "مدارس النور الدولية - القاهرة & عمّان" : "Al Noor International - Cairo & Amman"}
              </p>
            </div>
          </div>

          {/* Campus Selector */}
          <div className="hidden md:flex items-center bg-slate-100 hover:bg-slate-200/80 transition rounded-lg px-2.5 py-1 text-xs text-slate-700 border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-500 ltr:mr-1.5 rtl:ml-1.5" />
            <select
              value={activeBranchId}
              onChange={(e) => onBranchChange(Number(e.target.value))}
              aria-label={t.allBranches}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value={0}>{t.allBranches}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {lang === "ar" ? b.nameAr : b.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle: Ctrl+K Global Search & Dates */}
        <div className="flex items-center gap-2">
          {/* Quick Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/90 text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 text-xs transition shadow-xs"
            title="Ctrl + K or Click"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden sm:inline font-medium">{t.searchPlaceholder.slice(0, 24)}...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-mono border border-slate-200 shadow-2xs">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Hijri & Gregorian dual calendar badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-amber-50/80 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold">{hijri}</span>
            <span className="text-amber-400">|</span>
            <span className="text-slate-600">{gregorian}</span>
          </div>
        </div>

        {/* Right side: Role Switcher, i18n & Numerals & Reseed */}
        <div className="flex items-center gap-2">
          {/* Role Impersonation Switcher */}
          <div className="flex items-center bg-indigo-50 border border-indigo-200/80 rounded-lg px-2.5 py-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600 ltr:mr-1.5 rtl:ml-1.5" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              aria-label={t.switchRole}
              className="bg-transparent text-xs font-semibold text-indigo-950 focus:outline-none cursor-pointer"
            >
              {Object.entries(roleLabels).map(([roleKey, info]) => (
                <option key={roleKey} value={roleKey}>
                  {lang === "ar" ? info.ar : info.en}
                </option>
              ))}
            </select>
          </div>

          {/* Arabic-Indic Numerals Toggle */}
          {lang === "ar" && (
            <button
              onClick={onToggleNumerals}
              title={useArabicIndic ? "التبديل إلى الأرقام الإنجليزية (123)" : "التبديل إلى الأرقام المشرقية (١٢٣)"}
              className={`px-2 py-1 text-xs font-mono font-bold rounded-lg border transition ${
                useArabicIndic
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {useArabicIndic ? "١٢٣" : "123"}
            </button>
          )}

          {/* Language Toggle (AR ↔ EN) */}
          <button
            onClick={() => onLanguageChange(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium transition"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Reseed Database Button */}
          <button
            onClick={onReseedData}
            disabled={isReseeding}
            title={lang === "ar" ? "إعادة ضبط البيانات التجريبية" : "Reset & Reseed Demo Data"}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? "animate-spin text-indigo-600" : ""}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
