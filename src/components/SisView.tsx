"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import { Language, translations, formatNumber, formatCurrency } from "@/lib/i18n";

interface SisProps {
  lang: Language;
  useArabicIndic: boolean;
  onOpenPassport: (student: any) => void;
}

export const SisView: React.FC<SisProps> = ({ lang, useArabicIndic, onOpenPassport }) => {
  const t = translations[lang];
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [riskOnly, setRiskOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student State
  const [newStudent, setNewStudent] = useState({
    firstNameAr: "",
    lastNameAr: "",
    firstNameEn: "",
    lastNameEn: "",
    nationalId: "",
    birthDate: "2015-04-10",
    gender: "Male",
    gradeId: "2",
    medicalNotes: "سليم تماماً",
    allergies: "",
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (gradeFilter) params.append("gradeId", gradeFilter);
      if (riskOnly) params.append("riskOnly", "true");

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, gradeFilter, riskOnly]);

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchStudents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === "ar" ? "شؤون وسجلات الطلاب (SIS)" : "Student Information System (SIS)"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ar"
              ? "الملفات الأكاديمية والمدنية الموحدة، جواز السفر الرقمي، ورادار الإنذار المبكر"
              : "Unified academic profiles, digital student passports, and early warning radar"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addStudent}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "ar" ? "ابحث بالاسم، كود الطالب، أو الرقم القومي..." : "Search by name, ID or code..."}
            className="bg-transparent w-full focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Risk Filter Toggle */}
          <button
            onClick={() => setRiskOnly(!riskOnly)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition border ${
              riskOnly
                ? "bg-rose-50 text-rose-700 border-rose-300"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{lang === "ar" ? "الطلاب تحت الملاحظة فقط" : "At-Risk Students Only"}</span>
          </button>

          {/* Export to Excel stub */}
          <button
            onClick={() => alert(lang === "ar" ? "جاري تصدير قائمة الطلاب إلى ملف Excel..." : "Exporting students list to Excel...")}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.exportExcel}</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 text-start">{lang === "ar" ? "الطالب" : "Student"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "كود الطالب / الهوية" : "Code / Civil ID"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "الصف والقسم" : "Grade & Division"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "رادار الخطر (AI)" : "Risk Score"}</th>
                <th className="p-3.5 text-start">{lang === "ar" ? "محفظة المقصف" : "Canteen Wallet"}</th>
                <th className="p-3.5 text-center">{lang === "ar" ? "جواز السفر الرقمي" : "Passport"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const isHighRisk = (student.riskScore || 0) >= 50;
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            student.photoUrl ||
                            "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
                          }
                          alt={student.firstNameEn}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {lang === "ar"
                              ? `${student.firstNameAr} ${student.lastNameAr}`
                              : `${student.firstNameEn} ${student.lastNameEn}`}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {student.firstNameEn} {student.lastNameEn}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-700">
                      <div>{student.studentCode}</div>
                      <div className="text-[10px] text-slate-400">
                        {formatNumber(student.nationalId, useArabicIndic)}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-700">
                      <div className="font-semibold">{student.gradeId === 2 ? "Grade 4" : student.gradeId === 3 ? "Grade 9" : "Grade 11"}</div>
                      <div className="text-[10px] text-slate-500">{student.nationality}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded-full border ${
                            isHighRisk
                              ? "bg-rose-50 text-rose-700 border-rose-300"
                              : "bg-emerald-50 text-emerald-700 border-emerald-300"
                          }`}
                        >
                          {student.riskScore}%
                        </span>
                        {isHighRisk && (
                          <span className="text-[10px] text-rose-600 font-bold">
                            {lang === "ar" ? "غياب/متأخرات" : "Alert"}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 font-bold text-slate-800">
                      {formatCurrency(student.canteenWalletBalance || 150, "EGP", lang, useArabicIndic)}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onOpenPassport(student)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-3 py-1.5 rounded-xl text-xs transition inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === "ar" ? "عرض الجواز" : "Passport"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Student Enrollment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-slate-900 text-base">
                {lang === "ar" ? "تسجيل وقيد طالب جديد" : "Enroll New Student"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الاسم الأول (بالعربية)</label>
                  <input
                    type="text"
                    required
                    value={newStudent.firstNameAr}
                    onChange={(e) => setNewStudent({ ...newStudent, firstNameAr: e.target.value })}
                    placeholder="يوسف"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم العائلة (بالعربية)</label>
                  <input
                    type="text"
                    required
                    value={newStudent.lastNameAr}
                    onChange={(e) => setNewStudent({ ...newStudent, lastNameAr: e.target.value })}
                    placeholder="الكيلاني"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newStudent.firstNameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, firstNameEn: e.target.value })}
                    placeholder="Youssef"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newStudent.lastNameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, lastNameEn: e.target.value })}
                    placeholder="El-Kilany"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الرقم القومي / الهوية</label>
                  <input
                    type="text"
                    required
                    value={newStudent.nationalId}
                    onChange={(e) => setNewStudent({ ...newStudent, nationalId: e.target.value })}
                    placeholder="31405120108892"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الصف الدراسي</label>
                  <select
                    value={newStudent.gradeId}
                    onChange={(e) => setNewStudent({ ...newStudent, gradeId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500 cursor-pointer"
                  >
                    <option value="2">الصف الرابع الابتدائي (Grade 4)</option>
                    <option value="3">الصف الثالث الإعدادي (Grade 9)</option>
                    <option value="4">الصف الثاني الثانوي (Grade 11)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الملاحظات الطبية أو الحساسية الغذائية</label>
                <input
                  type="text"
                  value={newStudent.allergies}
                  onChange={(e) => setNewStudent({ ...newStudent, allergies: e.target.value })}
                  placeholder="مثال: حساسية من الفول السوداني أو مشتقات الألبان"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-500"
                />
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
                  {lang === "ar" ? "اعتماد وتسجيل الطالب" : "Enroll & Generate Passport"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
