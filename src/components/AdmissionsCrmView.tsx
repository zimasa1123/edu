"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Filter,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  X,
  Plus,
} from "lucide-react";
import { Language, translations, formatNumber } from "@/lib/i18n";

interface AdmissionsCrmProps {
  lang: Language;
  useArabicIndic: boolean;
}

export const AdmissionsCrmView: React.FC<AdmissionsCrmProps> = ({ lang, useArabicIndic }) => {
  const t = translations[lang];
  const [leads, setLeads] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({});
  const [stages, setStages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New lead form state
  const [newLead, setNewLead] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    gradeInterested: "الصف الرابع الابتدائي (Grade 4)",
    curriculumInterested: "American Diploma",
    source: "WhatsApp",
    notes: "",
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admissions");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        setPipeline(data.pipeline);
        setStages(data.stages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStageChange = async (leadId: number, nextStage: string) => {
    try {
      const res = await fetch("/api/admissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, stage: nextStage }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewLead({
          studentName: "",
          parentName: "",
          phone: "",
          email: "",
          gradeInterested: "الصف الرابع الابتدائي (Grade 4)",
          curriculumInterested: "American Diploma",
          source: "WhatsApp",
          notes: "",
        });
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "قمع القبول والتسجيل الذكي (Admissions CRM)" : "Smart Admissions CRM & Pipeline"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "متابعة مسار استقطاب الطلاب، تقييم الجاهزية بالذكاء الاصطناعي، وجدولة المقابلات"
              : "Lead pipeline, AI readiness scoring, interview scheduling, and conversion analytics"}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "ar" ? "تسجيل طلب التحاق جديد" : "Capture New Lead"}</span>
        </button>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {stages.map((stage) => {
            const stageLeads = pipeline[stage] || [];
            return (
              <div
                key={stage}
                className="w-72 shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col max-h-[75vh]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-800">{stage}</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  </div>
                  <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-full text-slate-600 border border-slate-200">
                    {formatNumber(stageLeads.length, useArabicIndic)}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition text-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{lead.studentName}</div>
                          <div className="text-slate-500 text-[11px]">{lead.gradeInterested}</div>
                        </div>

                        {/* AI Lead Score Badge */}
                        <div
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                            lead.score >= 85
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-indigo-50 text-indigo-700 border-indigo-300"
                          }`}
                          title={lang === "ar" ? "درجة الجاهزية بالذكاء الاصطناعي" : "AI Lead Score"}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{lead.score}%</span>
                        </div>
                      </div>

                      <div className="text-slate-600 space-y-1 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{lang === "ar" ? "ولي الأمر:" : "Parent:"}</span>
                          <span>{lead.parentName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-indigo-600 font-semibold">{lead.source}</span>
                          <span>•</span>
                          <span className="text-slate-500">{lead.curriculumInterested}</span>
                        </div>
                      </div>

                      {/* AI Next Action Tip */}
                      {lead.aiNextAction && (
                        <div className="p-2 rounded-lg bg-indigo-50/80 border border-indigo-200 text-[11px] text-indigo-900">
                          <span className="font-bold block mb-0.5">
                            {lang === "ar" ? "الإجراء الذكي المقترح:" : "AI Next Action:"}
                          </span>
                          <span className="text-indigo-800 leading-tight">{lead.aiNextAction}</span>
                        </div>
                      )}

                      {/* Stage Move Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400">{lang === "ar" ? "نقل للمرحلة:" : "Move:"}</span>
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded px-1.5 py-0.5 text-[11px] font-medium focus:outline-none cursor-pointer"
                        >
                          {stages.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs italic">
                      {lang === "ar" ? "لا توجد طلبات بهذه المرحلة" : "No leads in this stage"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Lead Capture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-slate-900 text-base">
                {lang === "ar" ? "تسجيل طلب التحاق جديد (Lead Capture)" : "Capture New Admissions Lead"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "ar" ? "اسم الطالب" : "Student Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newLead.studentName}
                    onChange={(e) => setNewLead({ ...newLead, studentName: e.target.value })}
                    placeholder="مثال: يوسف حازم"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "ar" ? "اسم ولي الأمر" : "Parent Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newLead.parentName}
                    onChange={(e) => setNewLead({ ...newLead, parentName: e.target.value })}
                    placeholder="مثال: م. حازم الكيلاني"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "ar" ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+20 100 123 4567"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "ar" ? "الصف المستهدف" : "Grade Interested"}
                  </label>
                  <select
                    value={newLead.gradeInterested}
                    onChange={(e) => setNewLead({ ...newLead, gradeInterested: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500 cursor-pointer"
                  >
                    <option>الروضة الثانية (KG2)</option>
                    <option>الصف الرابع الابتدائي (Grade 4)</option>
                    <option>الصف الثالث الإعدادي (Grade 9)</option>
                    <option>الصف الثاني الثانوي (Grade 11)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "ar" ? "مصدر الطلب" : "Lead Source"}
                  </label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500 cursor-pointer"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral / ترشيح ولي أمر</option>
                    <option value="Facebook">Facebook Ads</option>
                    <option value="Walk-in">Walk-in / زيارة مقر</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {lang === "ar" ? "ملاحظات إضافية" : "Notes"}
                </label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="ملاحظات حول رغبات ولي الأمر..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  {lang === "ar" ? "حفظ وتوليد درجة AI" : "Save & Calculate AI Score"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
