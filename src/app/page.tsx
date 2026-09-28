"use client";

import React, { useState, useEffect } from "react";
import { Language, translations } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { CampusPulseBar } from "@/components/CampusPulseBar";
import { CommandPaletteModal } from "@/components/CommandPaletteModal";
import { DigitalPassportModal } from "@/components/DigitalPassportModal";
import { ExecutiveDashboardView } from "@/components/ExecutiveDashboardView";
import { AdmissionsCrmView } from "@/components/AdmissionsCrmView";
import { SisView } from "@/components/SisView";
import { AttendanceView } from "@/components/AttendanceView";
import { FinanceView } from "@/components/FinanceView";
import { AcademicsView } from "@/components/AcademicsView";
import { HrView } from "@/components/HrView";
import { OperationsView } from "@/components/OperationsView";
import { BehaviorView } from "@/components/BehaviorView";
import { CommunicationView } from "@/components/CommunicationView";
import { PortalsView } from "@/components/PortalsView";
import { WhatIfSimulatorView } from "@/components/WhatIfSimulatorView";
import { AiHubView } from "@/components/AiHubView";

export default function EduNexusApp() {
  const [lang, setLang] = useState<Language>("ar");
  const [useArabicIndic, setUseArabicIndic] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentRole, setCurrentRole] = useState<string>("principal");
  const [activeBranchId, setActiveBranchId] = useState<number>(0);

  // Bootstrap state
  const [bootstrapData, setBootstrapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReseeding, setIsReseeding] = useState(false);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [passportStudent, setPassportStudent] = useState<any>(null);

  const fetchBootstrapData = async () => {
    try {
      const res = await fetch("/api/bootstrap");
      const data = await res.json();
      if (data.success) {
        setBootstrapData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootstrapData();
  }, []);

  // Update html document direction and language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleReseedData = async () => {
    if (!confirm(lang === "ar" ? "هل أنت متأكد من إعادة ضبط البيانات التجريبية للمدرسة؟" : "Reset demo database to seed defaults?")) {
      return;
    }
    setIsReseeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(lang === "ar" ? "تمت إعادة تهيئة البيانات التجريبية بنجاح!" : "Database reseeded successfully!");
        fetchBootstrapData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReseeding(false);
    }
  };

  const handleOpenStudentPassportById = async (studentId: number) => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.success) {
        const found = data.students.find((s: any) => s.id === studentId);
        if (found) {
          setPassportStudent(found);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If role is switched, auto-navigate to relevant tab if in portal mode
  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    if (newRole === "parent" || newRole === "student" || newRole === "teacher") {
      setCurrentTab("portals");
    } else if (newRole === "school_owner") {
      setCurrentTab("simulator");
    } else if (newRole === "accountant") {
      setCurrentTab("finance");
    } else if (newRole === "registrar") {
      setCurrentTab("admissions");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center animate-spin">
          <div className="w-6 h-6 rounded-lg bg-slate-900"></div>
        </div>
        <div className="text-sm font-bold tracking-tight">EduNexus K-12 ERP | جاري تهيئة النظام السحابي...</div>
      </div>
    );
  }

  const branches = bootstrapData?.branches || [];
  const users = bootstrapData?.users || [];
  const kpis = bootstrapData?.kpis || {
    totalStudents: 5,
    totalLeads: 5,
    atRiskStudents: 1,
    attendanceRate: 95,
    totalInvoiced: 48500,
    totalCollected: 25000,
    overdueInvoices: 1,
    collectionRate: 52,
  };
  const pulse = bootstrapData?.pulse || { clinicVisits: [], incidents: [], busesEnRoute: 1, totalBuses: 2 };
  const announcements = bootstrapData?.announcements || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        useArabicIndic={useArabicIndic}
        onToggleNumerals={() => setUseArabicIndic(!useArabicIndic)}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeBranchId={activeBranchId}
        onBranchChange={setActiveBranchId}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onReseedData={handleReseedData}
        isReseeding={isReseeding}
        branches={branches}
        users={users}
      />

      {/* Live Campus Pulse Bar */}
      <CampusPulseBar
        lang={lang}
        pulseData={pulse}
        attendanceRate={kpis.attendanceRate}
      />

      {/* Main Workspace Layout (Sidebar + Module Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          lang={lang}
          currentRole={currentRole}
        />

        {/* Dynamic Module Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === "dashboard" && (
            <ExecutiveDashboardView
              lang={lang}
              useArabicIndic={useArabicIndic}
              kpis={kpis}
              announcements={announcements}
              onNavigate={setCurrentTab}
              onOpenPassport={handleOpenStudentPassportById}
            />
          )}

          {currentTab === "admissions" && (
            <AdmissionsCrmView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "sis" && (
            <SisView
              lang={lang}
              useArabicIndic={useArabicIndic}
              onOpenPassport={(student) => setPassportStudent(student)}
            />
          )}

          {currentTab === "attendance" && (
            <AttendanceView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "finance" && (
            <FinanceView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "academics" && (
            <AcademicsView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "hr" && (
            <HrView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "portals" && (
            <PortalsView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "operations" && (
            <OperationsView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "behavior" && (
            <BehaviorView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "communication" && (
            <CommunicationView
              lang={lang}
              announcements={announcements}
            />
          )}

          {currentTab === "simulator" && (
            <WhatIfSimulatorView
              lang={lang}
              useArabicIndic={useArabicIndic}
            />
          )}

          {currentTab === "ai_hub" && (
            <AiHubView
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Ctrl+K Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        lang={lang}
        onNavigate={setCurrentTab}
        onSelectStudent={handleOpenStudentPassportById}
      />

      {/* Digital Student Passport Modal */}
      <DigitalPassportModal
        student={passportStudent}
        isOpen={Boolean(passportStudent)}
        onClose={() => setPassportStudent(null)}
        lang={lang}
        useArabicIndic={useArabicIndic}
      />
    </div>
  );
}
