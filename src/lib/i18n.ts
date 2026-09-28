export type Language = "ar" | "en";

export const translations = {
  ar: {
    appTitle: "EduNexus | إديونكسس",
    appSubtitle: "نظام إدارة المدارس السحابي الذكي للشرق الأوسط",
    demoBadge: "نسخة تجريبية معتمدة K-12",
    executiveDashboard: "لوحة القيادة التنفيذية",
    admissionsCrm: "إدارة القبول والتسجيل (CRM)",
    sis: "شؤون الطلاب (SIS)",
    academics: "الشؤون الأكاديمية والجدول",
    attendance: "دفتر الحضور والغياب",
    finance: "المالية والأقساط",
    hrPayroll: "الموارد البشرية والرواتب",
    communication: "مركز التواصل والمراسلات",
    parentPortal: "بوابة ولي الأمر",
    studentPortal: "بوابة الطالب",
    teacherPortal: "بوابة المعلم",
    operations: "العمليات والمرافق",
    behavior: "السلوك والرعاية النفسية",
    reports: "التقارير والمؤشرات",
    aiHub: "مركز الذكاء الاصطناعي",
    switchRole: "تبديل الدور للمعاينة",
    allBranches: "جميع الفروع",
    branchMaadi: "فرع المعادي الرئيسي (القاهرة)",
    branchNewCairo: "فرع التجمع الخامس (القاهرة)",
    branchAmman: "فرع دابوق (عمّان)",
    studentsCount: "إجمالي الطلاب",
    attendanceToday: "حضور اليوم",
    feesCollected: "المصروفات المحصلة",
    atRiskStudents: "طلاب تحت الملاحظة",
    admissionsFunnel: "قمع القبول والتسجيل",
    teacherWorkload: "متوسط نصاب المعلمين",
    upcomingEvents: "الفعاليات القادمة",
    aiBriefing: "الملخص التنفيذي الأسبوعي الذكي",
    searchPlaceholder: "ابحث بالذكاء الاصطناعي (مثال: طلاب غائبين 3 أيام أو رسوم متأخرة...)",
    digitalPassport: "جواز السفر الطلابي الرقمي",
    whatIfSimulator: "محاكي القرارات الإستراتيجية (What-If)",
    liveCampusPulse: "نبض الحرم المدرسي الحي",
    addStudent: "إضافة طالب جديد",
    addLead: "تسجيل طلب التحاق جديد",
    markAttendance: "تسجيل الحضور السريع",
    recordPayment: "سداد قسط مدرسي",
    generateComment: "توليد تعليقات الشهادات",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    loading: "جاري التحميل...",
    actions: "الإجراءات",
    status: "الحالة",
    grade: "الصف الدراسي",
    section: "الشعبة / الفصل",
    phone: "رقم الهاتف",
    nationalId: "الرقم القومي / الهوية",
    filter: "تصفية",
    exportExcel: "تصدير Excel",
    exportPdf: "تصدير PDF",
    currency: "ج.م",
    offlineMode: "جاهز للعمل دون اتصال (Sync متاح)",
  },
  en: {
    appTitle: "EduNexus ERP & CRM",
    appSubtitle: "AI-Native Enterprise School Management for MENA",
    demoBadge: "K-12 Verified Demo Edition",
    executiveDashboard: "Executive Dashboard",
    admissionsCrm: "Admissions CRM",
    sis: "Student Information System",
    academics: "Academics & Timetable",
    attendance: "Smart Attendance",
    finance: "Finance & Tuition",
    hrPayroll: "HR & Payroll",
    communication: "Communication Hub",
    parentPortal: "Parent Portal",
    studentPortal: "Student Portal",
    teacherPortal: "Teacher Portal",
    operations: "Operations & Fleet",
    behavior: "Wellbeing & Behavior",
    reports: "Reports & Analytics",
    aiHub: "AI Command Center",
    switchRole: "Switch Persona / Role",
    allBranches: "All Campuses",
    branchMaadi: "Maadi Main Campus (Cairo)",
    branchNewCairo: "New Cairo Campus",
    branchAmman: "Dabouq Campus (Amman)",
    studentsCount: "Total Students",
    attendanceToday: "Today's Attendance",
    feesCollected: "Fees Collected",
    atRiskStudents: "At-Risk Students",
    admissionsFunnel: "Admissions Pipeline",
    teacherWorkload: "Teacher Average Workload",
    upcomingEvents: "Upcoming Milestones",
    aiBriefing: "AI Weekly Executive Briefing",
    searchPlaceholder: "Ask AI (e.g., 'students absent 3 days with overdue fees')...",
    digitalPassport: "Digital Student Passport",
    whatIfSimulator: "Owner's What-If Simulator",
    liveCampusPulse: "Live Campus Pulse",
    addStudent: "Enroll New Student",
    addLead: "Capture New Lead",
    markAttendance: "Quick Attendance Roll",
    recordPayment: "Record Tuition Payment",
    generateComment: "AI Report Comments",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    loading: "Loading...",
    actions: "Actions",
    status: "Status",
    grade: "Grade",
    section: "Section",
    phone: "Phone",
    nationalId: "National ID",
    filter: "Filter",
    exportExcel: "Export to Excel",
    exportPdf: "Export PDF",
    currency: "EGP",
    offlineMode: "Offline-Tolerant (Sync Ready)",
  },
};

// Convert standard digits to Arabic-Indic digits if enabled
export function formatNumber(num: number | string, useArabicIndic: boolean = false): string {
  const str = String(num);
  if (!useArabicIndic) return str;

  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/\d/g, (d) => arabicDigits[Number(d)]);
}

// Convert amount to formatted currency
export function formatCurrency(
  amount: number | string,
  currency: string = "EGP",
  lang: Language = "ar",
  useArabicIndic: boolean = false
): string {
  const val = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const formattedNumber = val.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 0,
  });

  if (useArabicIndic && lang === "ar") {
    const localizedVal = formatNumber(val.toLocaleString("en-US", { maximumFractionDigits: 0 }), true);
    return `${localizedVal} ${currency === "EGP" ? "ج.م" : currency === "JOD" ? "د.أ" : currency}`;
  }

  const symbol = lang === "ar" ? (currency === "EGP" ? "ج.م" : currency === "JOD" ? "د.أ" : currency) : currency;
  return `${formattedNumber} ${symbol}`;
}

// Dual calendar: Gregorian & Hijri approximation
export function getDualDate(date: Date = new Date(), lang: Language = "ar"): { gregorian: string; hijri: string } {
  const gregorian = date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const hijri = new Intl.DateTimeFormat(`${lang}-TN-u-ca-islamic-umalqura`, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    return { gregorian, hijri };
  } catch (e) {
    return { gregorian, hijri: "16 رمضان 1446 هـ" };
  }
}
