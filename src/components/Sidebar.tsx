"use client";

import React from "react";
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  BadgeDollarSign,
  Users2,
  MessageSquare,
  Sparkles,
  Bus,
  HeartPulse,
  SlidersHorizontal,
  FileSpreadsheet,
  Home,
  User,
  ShieldCheck,
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";

export type NavTab =
  | "dashboard"
  | "admissions"
  | "sis"
  | "academics"
  | "attendance"
  | "finance"
  | "hr"
  | "communication"
  | "portals"
  | "operations"
  | "behavior"
  | "simulator"
  | "ai_hub";

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: Language;
  currentRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, lang, currentRole }) => {
  const t = translations[lang];

  // Define nav items with icon and roles that have highlight/relevance
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlightForRoles?: string[];
  }> = [
    { id: "dashboard", label: t.executiveDashboard, icon: LayoutDashboard },
    { id: "admissions", label: t.admissionsCrm, icon: UserPlus, badge: "9 leads" },
    { id: "sis", label: t.sis, icon: GraduationCap },
    { id: "academics", label: t.academics, icon: BookOpen },
    { id: "attendance", label: t.attendance, icon: CalendarCheck2, badge: "94%" },
    { id: "finance", label: t.finance, icon: BadgeDollarSign },
    { id: "hr", label: t.hrPayroll, icon: Users2 },
    { id: "communication", label: t.communication, icon: MessageSquare },
    { id: "portals", label: lang === "ar" ? "البوابات المخصصة" : "Dedicated Portals", icon: Home, badge: "Parent/Stu/Teach" },
    { id: "operations", label: t.operations, icon: Bus },
    { id: "behavior", label: t.behavior, icon: HeartPulse },
    { id: "simulator", label: t.whatIfSimulator, icon: SlidersHorizontal, badge: "Owner" },
    { id: "ai_hub", label: t.aiHub, icon: Sparkles, badge: "15 Tools" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-57px)] select-none border-r border-slate-800">
      <div className="p-3">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mb-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">{lang === "ar" ? "الدور النشط الحالي:" : "Current Persona:"}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="font-bold text-white text-sm capitalize truncate flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{currentRole.replace("_", " ")}</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-400 border border-slate-700 group-hover:text-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-3 border-t border-slate-800/80">
        <div className="bg-slate-800/50 rounded-xl p-2.5 text-[11px] text-slate-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="truncate">PostgreSQL Local + Drizzle ORM</span>
        </div>
      </div>
    </aside>
  );
};
