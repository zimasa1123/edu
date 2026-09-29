import { db } from "./index";
import * as s from "./schema";
import { sql } from "drizzle-orm";

// ---------- helpers ----------
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}
function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000);
}

const MALE_NAMES = [
  ["أحمد", "Ahmed"], ["محمد", "Mohamed"], ["علي", "Ali"], ["يوسف", "Youssef"], ["عمر", "Omar"],
  ["حسن", "Hassan"], ["خالد", "Khaled"], ["مصطفى", "Mostafa"], ["كريم", "Karim"], ["زياد", "Ziad"],
  ["يحيى", "Yahya"], ["إبراهيم", "Ibrahim"], ["عبدالرحمن", "Abdelrahman"], ["مروان", "Marwan"], ["سيف", "Seif"],
  ["آدم", "Adam"], ["حمزة", "Hamza"], ["طارق", "Tarek"], ["وليد", "Waleed"], ["بلال", "Belal"],
];
const FEMALE_NAMES = [
  ["مريم", "Mariam"], ["فاطمة", "Fatma"], ["سارة", "Sara"], ["ليلى", "Laila"], ["نور", "Nour"],
  ["جنى", "Jana"], ["حبيبة", "Habiba"], ["ملك", "Malak"], ["رهف", "Rahaf"], ["دانة", "Dana"],
  ["إيمان", "Eman"], ["ياسمين", "Yasmin"], ["روان", "Rawan"], ["سلمى", "Salma"], ["آية", "Aya"],
  ["هنا", "Hana"], ["لينا", "Lina"], ["جودي", "Jodie"], ["تقى", "Taqa"], ["منة", "Mennah"],
];
const LAST_NAMES = [
  ["السيد", "El-Sayed"], ["إبراهيم", "Ibrahim"], ["الشريف", "El-Sherif"], ["عبدالله", "Abdallah"],
  ["حسين", "Hussein"], ["محمود", "Mahmoud"], ["الجندي", "El-Gendy"], ["راشد", "Rashed"],
  ["عبدالرازق", "Abdelrazek"], ["فهمي", "Fahmy"], ["النجار", "El-Naggar"], ["البدوي", "El-Badawy"],
  ["قنديل", "Kandil"], ["زيدان", "Zeidan"], ["شعبان", "Shaaban"], ["الحسيني", "El-Husseiny"],
  ["دياب", "Diab"], ["صابر", "Saber"], ["عزب", "Ezab"], ["كامل", "Kamel"],
];
function fullName(gender: "Male" | "Female") {
  const [firstAr, firstEn] = pick(gender === "Male" ? MALE_NAMES : FEMALE_NAMES);
  const [lastAr, lastEn] = pick(LAST_NAMES);
  return { firstAr, firstEn, lastAr, lastEn };
}
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export async function seedDatabase() {
  console.log("Seeding Modern School New Generation database...");

  await db.execute(sql`TRUNCATE TABLE
    audit_logs, ai_logs, counselor_cases, behavior_incidents, clinic_visits,
    library_books, student_transport, transport_routes, tickets, announcements,
    messages, leaves, staff, payments, invoices, fee_plans, grades_results,
    assessments, staff_attendance, attendance, timetable_slots, subjects,
    leads, student_guardians, students, guardians, users, sections, grades,
    terms, academic_years, branches, schools RESTART IDENTITY CASCADE`);

  // ================= SCHOOL / BRANCH / YEAR =================
  const [school] = await db
    .insert(s.schools)
    .values({
      nameAr: "مودرن سكول نيو جينيريشن",
      nameEn: "Modern School New Generation",
      code: "MSNG-01",
      country: "Egypt",
      currency: "EGP",
      taxNumber: "700-123-456",
      phone: "+20 2 2618 4400",
      email: "info@modernschoolng.edu.eg",
      website: "https://modernschoolng.edu.eg",
      settings: {
        enableAiGrading: true,
        enableParentAi: true,
        offlineAttendanceSync: true,
        primaryLanguage: "ar",
      },
    })
    .returning();

  const [branch] = await db
    .insert(s.branches)
    .values({
      schoolId: school.id,
      nameAr: "الحرم الرئيسي - التجمع الخامس",
      nameEn: "Main Campus - New Cairo",
      code: "MAIN-01",
      city: "New Cairo",
      address: "التجمع الخامس، القاهرة الجديدة",
      principalName: "د. هشام عبد الوهاب",
      phone: "+20 2 2618 4400",
    })
    .returning();

  const [academicYear] = await db
    .insert(s.academicYears)
    .values({
      schoolId: school.id,
      name: "2025 - 2026",
      startDate: "2025-09-01",
      endDate: "2026-06-30",
      isCurrent: true,
    })
    .returning();

  await db.insert(s.terms).values([
    { academicYearId: academicYear.id, name: "الفصل الدراسي الأول / Term 1", startDate: "2025-09-01", endDate: "2026-01-29", isCurrent: false },
    { academicYearId: academicYear.id, name: "الفصل الدراسي الثاني / Term 2", startDate: "2026-02-01", endDate: "2026-06-30", isCurrent: true },
  ]);

  // ================= GRADES (Primary 1-6, Prep 1-3) =================
  const gradeDefs = [
    { code: "P1", nameAr: "الأول الابتدائي", nameEn: "Grade 1 Primary", stage: "Primary", order: 1 },
    { code: "P2", nameAr: "الثاني الابتدائي", nameEn: "Grade 2 Primary", stage: "Primary", order: 2 },
    { code: "P3", nameAr: "الثالث الابتدائي", nameEn: "Grade 3 Primary", stage: "Primary", order: 3 },
    { code: "P4", nameAr: "الرابع الابتدائي", nameEn: "Grade 4 Primary", stage: "Primary", order: 4 },
    { code: "P5", nameAr: "الخامس الابتدائي", nameEn: "Grade 5 Primary", stage: "Primary", order: 5 },
    { code: "P6", nameAr: "السادس الابتدائي", nameEn: "Grade 6 Primary", stage: "Primary", order: 6 },
    { code: "X1", nameAr: "الأول الإعدادي", nameEn: "Grade 7 Prep", stage: "Prep", order: 7 },
    { code: "X2", nameAr: "الثاني الإعدادي", nameEn: "Grade 8 Prep", stage: "Prep", order: 8 },
    { code: "X3", nameAr: "الثالث الإعدادي", nameEn: "Grade 9 Prep", stage: "Prep", order: 9 },
  ];
  const grades = await db
    .insert(s.grades)
    .values(
      gradeDefs.map((g) => ({
        schoolId: school.id,
        nameAr: g.nameAr,
        nameEn: g.nameEn,
        code: g.code,
        stage: g.stage,
        curriculum: "Egyptian National",
        orderIndex: g.order,
      }))
    )
    .returning();

  // 2 sections per grade
  const sectionRows: any[] = [];
  for (const g of grades) {
    sectionRows.push(
      { gradeId: g.id, branchId: branch.id, name: `${g.code}-A`, roomNumber: `مبنى ${randInt(1, 3)} - قاعة ${randInt(101, 320)}`, capacity: 25, gender: "Mixed" },
      { gradeId: g.id, branchId: branch.id, name: `${g.code}-B`, roomNumber: `مبنى ${randInt(1, 3)} - قاعة ${randInt(101, 320)}`, capacity: 25, gender: "Mixed" }
    );
  }
  const sections = await db.insert(s.sections).values(sectionRows).returning();
  const sectionsByGrade: Record<number, typeof sections> = {};
  for (const g of grades) sectionsByGrade[g.id] = sections.filter((sec) => sec.gradeId === g.id);

  // ================= SUBJECTS =================
  const subjectDefs = [
    ["اللغة العربية", "Arabic", "AR"], ["اللغة الإنجليزية", "English", "EN"], ["الرياضيات", "Math", "MATH"],
    ["العلوم", "Science", "SCI"], ["الدراسات الاجتماعية", "Social Studies", "SOC"], ["التربية الدينية", "Religion", "REL"],
    ["اللغة الفرنسية", "French", "FR"], ["الحاسب الآلي", "Computer", "COMP"], ["التربية الفنية", "Art", "ART"],
    ["التربية الرياضية", "PE", "PE"],
  ];
  const subjects = await db
    .insert(s.subjects)
    .values(subjectDefs.map(([nameAr, nameEn, code]) => ({ schoolId: school.id, nameAr, nameEn, code, creditHours: 3 })))
    .returning();

  // ================= STAFF USERS (40 teachers + admin roles) =================
  const adminRoster: { role: string; jobTitleAr: string; jobTitleEn: string; dept: string }[] = [
    { role: "super_admin", jobTitleAr: "مسؤول النظام", jobTitleEn: "Super Admin", dept: "IT" },
    { role: "school_owner", jobTitleAr: "مالك المدرسة", jobTitleEn: "School Owner", dept: "الإدارة العليا" },
    { role: "principal", jobTitleAr: "مدير المدرسة", jobTitleEn: "Principal", dept: "الإدارة" },
    { role: "vice_principal", jobTitleAr: "وكيل المدرسة", jobTitleEn: "Vice Principal", dept: "الإدارة" },
    { role: "registrar", jobTitleAr: "مسؤول القيد والتسجيل", jobTitleEn: "Registrar", dept: "شؤون الطلاب" },
    { role: "accountant", jobTitleAr: "المدير المالي", jobTitleEn: "Chief Accountant", dept: "المالية" },
    { role: "hr_manager", jobTitleAr: "مسؤول الموارد البشرية", jobTitleEn: "HR Manager", dept: "الموارد البشرية" },
    { role: "counselor", jobTitleAr: "الأخصائي النفسي", jobTitleEn: "School Counselor", dept: "رعاية الطلاب" },
    { role: "nurse", jobTitleAr: "ممرضة المدرسة", jobTitleEn: "School Nurse", dept: "رعاية الطلاب" },
    { role: "transport_manager", jobTitleAr: "مسؤول النقل والحافلات", jobTitleEn: "Transport Manager", dept: "العمليات" },
    { role: "librarian", jobTitleAr: "أمين المكتبة", jobTitleEn: "Librarian", dept: "الأنشطة" },
  ];
  const teacherRoster = Array.from({ length: 40 }).map((_, i) => {
    const subj = subjectDefs[i % subjectDefs.length];
    return {
      role: "teacher",
      jobTitleAr: `معلم/ة ${subj[0]}`,
      jobTitleEn: `${subj[1]} Teacher`,
      dept: "التدريس",
    };
  });
  const staffRoster = [...adminRoster, ...teacherRoster];

  const staffUserRows = staffRoster.map((r, i) => {
    const gender = pick(["Male", "Female"]) as "Male" | "Female";
    const { firstAr, firstEn, lastAr, lastEn } = fullName(gender);
    return {
      schoolId: school.id,
      branchId: branch.id,
      email: `${r.role}${i + 1}@modernschoolng.edu.eg`,
      fullNameAr: `${firstAr} ${lastAr} (${r.jobTitleAr})`,
      fullNameEn: `${firstEn} ${lastEn} (${r.jobTitleEn})`,
      role: r.role,
      phone: `+20 1${randInt(0, 2)} ${randInt(1000000, 9999999)}`,
      nationalId: `2${randInt(6, 9)}${pad(randInt(1, 12), 2)}${pad(randInt(1, 28), 2)}${randInt(1000000, 9999999)}`,
      status: "active",
    };
  });
  const staffUsers = await db.insert(s.users).values(staffUserRows).returning();

  // Demo parent + student portal logins
  await db.insert(s.users).values([
    {
      schoolId: school.id, branchId: branch.id, email: "parent.demo@modernschoolng.edu.eg",
      fullNameAr: "المهندس حازم الكيلاني (ولي أمر)", fullNameEn: "Eng. Hazem El-Kilany (Parent)",
      role: "parent", phone: "+20 100 888 9911", nationalId: "28205100101789",
    },
    {
      schoolId: school.id, branchId: branch.id, email: "student.demo@modernschoolng.edu.eg",
      fullNameAr: "يوسف حازم الكيلاني (طالب)", fullNameEn: "Youssef Hazem El-Kilany (Student)",
      role: "student", phone: "+20 102 111 7766", nationalId: "31304220104523",
    },
  ]);

  const teacherUsers = staffUsers.filter((u) => u.role === "teacher");
  const findAdmin = (role: string) => staffUsers.find((u) => u.role === role)!;
  const nurseUser = findAdmin("nurse");
  const registrarUser = findAdmin("registrar");

  // Staff records for every admin/teacher user
  const staffRows = staffUsers.map((u, i) => ({
    userId: u.id,
    jobTitleAr: staffRoster[i].jobTitleAr,
    jobTitleEn: staffRoster[i].jobTitleEn,
    department: staffRoster[i].dept,
    hireDate: isoDate(daysAgo(randInt(200, 2200))),
    basicSalary: String(staffRoster[i].role === "teacher" ? randInt(6000, 14000) : randInt(9000, 28000)),
    allowance: String(randInt(0, 1500)),
    contractType: pick(["full_time", "full_time", "full_time", "part_time"]),
    status: "active",
  }));
  await db.insert(s.staff).values(staffRows);

  // Rotating teacher assignment for timetable/assessments
  let tIdx = 0;
  const nextTeacher = () => teacherUsers[tIdx++ % teacherUsers.length];

  // ================= TIMETABLE =================
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timetableRows: any[] = [];
  for (const g of grades) {
    for (const sec of sectionsByGrade[g.id]) {
      for (let d = 0; d < DAYS.length; d++) {
        for (let p = 1; p <= 5; p++) {
          const subject = pick(subjects);
          timetableRows.push({
            sectionId: sec.id,
            subjectId: subject.id,
            teacherId: nextTeacher().id,
            dayOfWeek: DAYS[d],
            periodNumber: p,
            startTime: `0${6 + p}:${p % 2 === 0 ? "45" : "00"}`,
            endTime: `0${7 + p}:${p % 2 === 0 ? "30" : "45"}`,
            room: sec.roomNumber || `قاعة ${randInt(1, 30)}`,
          });
        }
      }
    }
  }
  await db.insert(s.timetableSlots).values(timetableRows);

  // ================= FEE PLANS =================
  const feePlanByGrade: Record<number, any> = {};
  const feePlanRows = grades.map((g) => {
    const isPrimary = g.stage === "Primary";
    return {
      schoolId: school.id,
      gradeId: g.id,
      titleAr: `مصروفات ${g.nameAr} 2025/2026`,
      titleEn: `${g.nameEn} Tuition 2025/2026`,
      totalAmount: String(isPrimary ? 38000 + g.orderIndex * 1200 : 46000 + (g.orderIndex - 6) * 1800),
      currency: "EGP",
      installmentCount: 3,
    };
  });
  const feePlans = await db.insert(s.feePlans).values(feePlanRows).returning();
  for (const fp of feePlans) feePlanByGrade[fp.gradeId!] = fp;

  // ================= STUDENTS (200 across 9 grades) =================
  const perGrade = Array(9).fill(22);
  for (let i = 0; i < 200 - 22 * 9; i++) perGrade[i]++; // remainder -> 2 extra grades get 23

  const studentRows: any[] = [];
  let sc = 1;
  for (let gi = 0; gi < grades.length; gi++) {
    const g = grades[gi];
    const secs = sectionsByGrade[g.id];
    const age = g.orderIndex <= 6 ? 5 + g.orderIndex : 11 + (g.orderIndex - 6); // Primary ~6-11, Prep ~12-14
    for (let i = 0; i < perGrade[gi]; i++) {
      const gender = pick(["Male", "Female"]) as "Male" | "Female";
      const { firstAr, firstEn, lastAr, lastEn } = fullName(gender);
      const birthYear = 2026 - age;
      const risk = pick([8, 10, 12, 15, 18, 22, 30, 45, 60, 75]);
      studentRows.push({
        schoolId: school.id,
        branchId: branch.id,
        gradeId: g.id,
        sectionId: secs[i % secs.length].id,
        studentCode: `MSNG-2025-${pad(sc, 4)}`,
        nationalId: `${String(birthYear).slice(2)}${pad(randInt(1, 12), 2)}${pad(randInt(1, 28), 2)}${pad(randInt(1, 9), 1)}${randInt(1000000, 9999999)}`,
        firstNameAr: firstAr,
        lastNameAr: lastAr,
        firstNameEn: firstEn,
        lastNameEn: lastEn,
        gender,
        birthDate: `${birthYear}-${pad(randInt(1, 12), 2)}-${pad(randInt(1, 28), 2)}`,
        nationality: "Egyptian",
        religion: pick(["Muslim", "Muslim", "Muslim", "Christian"]),
        bloodGroup: pick(BLOOD_GROUPS),
        medicalNotes: pick([
          "لا توجد ملاحظات طبية",
          "لا توجد أمراض مزمنة",
          "حساسية موسمية بسيطة",
          "يرتدي نظارة طبية أثناء الحصص",
        ]),
        allergies: Math.random() < 0.12 ? pick(["الفول السوداني (Peanuts)", "الألبان ومشتقاتها", "الفراولة"]) : "",
        specialNeedsIep: Math.random() < 0.05,
        specialNeedsNotes: Math.random() < 0.05 ? "يحتاج خطة دعم تعليمي فردية (IEP)" : null,
        previousSchool: Math.random() < 0.35 ? pick(["مدرسة النيل الدولية", "مدرسة المستقبل", "روضة الأمل"]) : null,
        status: "enrolled",
        enrollmentDate: `${birthYear + randInt(4, 6)}-09-01`,
        digitalPassportCode: `EGP-MSNG-STU-${pad(sc, 4)}`,
        riskScore: risk,
        riskFactors: risk >= 50 ? ["نسبة حضور منخفضة هذا الفصل", "قسط دراسي متأخر السداد"] : ["نسبة حضور جيدة", "أداء دراسي مستقر"],
        canteenWalletBalance: String(randInt(0, 320)) + ".00",
        photoUrl: `https://images.unsplash.com/photo-15${randInt(10000000, 99999999)}?w=150&auto=format&fit=crop&q=80`,
      });
      sc++;
    }
  }
  const students = await db.insert(s.students).values(studentRows).returning();

  // ================= GUARDIANS (1 per student, as parent users) =================
  const guardianUserRows = students.map((st, i) => {
    const gGender = pick(["Male", "Female"]) as "Male" | "Female";
    const { firstAr, firstEn } = fullName(gGender);
    return {
      schoolId: school.id,
      branchId: branch.id,
      email: `guardian${i + 1}@modernschoolng-parents.com`,
      fullNameAr: `${firstAr} ${st.lastNameAr} (${gGender === "Male" ? "ولي أمر" : "ولية أمر"})`,
      fullNameEn: `${firstEn} ${st.lastNameEn}`,
      role: "parent",
      phone: `+20 1${randInt(0, 2)} ${randInt(1000000, 9999999)}`,
      nationalId: `2${randInt(6, 8)}${pad(randInt(1, 12), 2)}${pad(randInt(1, 28), 2)}${randInt(1000000, 9999999)}`,
      status: "active",
    };
  });
  const guardianUsers = await db.insert(s.users).values(guardianUserRows).returning();

  const guardianRows = guardianUsers.map((gu) => ({
    userId: gu.id,
    relationship: pick(["الأب / Father", "الأم / Mother"]),
    profession: pick(["مهندس", "طبيب", "محاسب", "مدرس", "تاجر", "موظف حكومي", "ربة منزل"]),
    workplace: pick(["شركة القاهرة للاستثمار", "مستشفى النيل", "بنك مصر", "شركة خاصة"]),
    emergencyPhone: `+20 1${randInt(0, 2)} ${randInt(1000000, 9999999)}`,
    engagementScore: randInt(60, 99),
    whatsappEnabled: true,
    preferredLanguage: "ar",
  }));
  const guardians = await db.insert(s.guardians).values(guardianRows).returning();

  await db.insert(s.studentGuardians).values(
    students.map((st, i) => ({ studentId: st.id, guardianId: guardians[i].id, isPrimary: true, canPickup: true }))
  );

  // ================= ATTENDANCE (last 5 school days) =================
  const attendanceRows: any[] = [];
  for (const st of students) {
    for (let d = 1; d <= 5; d++) {
      attendanceRows.push({
        studentId: st.id,
        sectionId: st.sectionId,
        date: isoDate(daysAgo(d)),
        periodNumber: 0,
        status: pick(["present", "present", "present", "present", "present", "present", "present", "late", "absent", "excused"]),
        reason: null,
        recordedBy: registrarUser.id,
      });
    }
  }
  await db.insert(s.attendance).values(attendanceRows);

  // ================= STAFF ATTENDANCE =================
  const staffAttendanceRows: any[] = [];
  for (const u of staffUsers) {
    for (let d = 1; d <= 5; d++) {
      staffAttendanceRows.push({
        userId: u.id,
        date: isoDate(daysAgo(d)),
        status: pick(["present", "present", "present", "present", "late", "on_leave"]),
        checkInTime: "07:45",
        checkOutTime: "15:30",
      });
    }
  }
  await db.insert(s.staffAttendance).values(staffAttendanceRows);

  // ================= INVOICES + PAYMENTS =================
  const invoiceRows: any[] = [];
  let invCounter = 1;
  for (const st of students) {
    const plan = feePlanByGrade[st.gradeId!];
    invoiceRows.push({
      schoolId: school.id,
      studentId: st.id,
      invoiceNumber: `INV-2025-${pad(invCounter, 5)}`,
      titleAr: plan.titleAr,
      titleEn: plan.titleEn,
      amount: plan.totalAmount,
      paidAmount: "0.00",
      discountAmount: "0.00",
      status: "unpaid",
      dueDate: "2025-10-01",
      currency: "EGP",
      lateRiskPrediction: pick(["Low", "Low", "Low", "Medium", "High"]),
    });
    invCounter++;
  }
  const invoices = await db.insert(s.invoices).values(invoiceRows).returning();

  const paymentRows: any[] = [];
  const invoiceUpdates: { id: number; paidAmount: string; status: string }[] = [];
  let rcpCounter = 1;
  for (const inv of invoices) {
    const outcome = pick(["paid", "paid", "partial", "unpaid", "overdue"]);
    const total = Number(inv.amount);
    if (outcome === "paid") {
      paymentRows.push({
        invoiceId: inv.id, studentId: inv.studentId, receiptNumber: `REC-2025-${pad(rcpCounter, 4)}`,
        amount: String(total), method: pick(["cash", "card", "fawry", "paymob", "bank_transfer"]),
        transactionRef: `TXN-${randInt(100000, 999999)}`, notes: "سداد كامل القيمة",
      });
      rcpCounter++;
      invoiceUpdates.push({ id: inv.id, paidAmount: String(total), status: "paid" });
    } else if (outcome === "partial") {
      const paid = Math.round(total * 0.5);
      paymentRows.push({
        invoiceId: inv.id, studentId: inv.studentId, receiptNumber: `REC-2025-${pad(rcpCounter, 4)}`,
        amount: String(paid), method: pick(["cash", "card", "fawry"]),
        transactionRef: `TXN-${randInt(100000, 999999)}`, notes: "سداد قسط جزئي",
      });
      rcpCounter++;
      invoiceUpdates.push({ id: inv.id, paidAmount: String(paid), status: "partial" });
    } else {
      invoiceUpdates.push({ id: inv.id, paidAmount: "0.00", status: outcome });
    }
  }
  if (paymentRows.length) await db.insert(s.payments).values(paymentRows);
  for (const u of invoiceUpdates) {
    await db.update(s.invoices).set({ paidAmount: u.paidAmount, status: u.status }).where(sql`${s.invoices.id} = ${u.id}`);
  }

  // ================= ASSESSMENTS + GRADE RESULTS =================
  const assessmentRows: any[] = [];
  for (const g of grades) {
    for (const sec of sectionsByGrade[g.id]) {
      const subjSample = [subjects[0], subjects[2]]; // Arabic + Math for every section
      for (const subj of subjSample) {
        assessmentRows.push({
          sectionId: sec.id, subjectId: subj.id, teacherId: nextTeacher().id,
          title: `${subj.nameAr} - اختبار منتصف الفصل`, type: "exam", maxScore: "100.00", weight: 40,
          dueDate: isoDate(daysAgo(10)), description: "اختبار تحريري يغطي الوحدتين الأولى والثانية",
        });
        assessmentRows.push({
          sectionId: sec.id, subjectId: subj.id, teacherId: nextTeacher().id,
          title: `${subj.nameAr} - واجب منزلي`, type: "homework", maxScore: "20.00", weight: 10,
          dueDate: isoDate(daysAgo(3)), description: "تسليم الواجب عبر المنصة",
        });
      }
    }
  }
  const assessments = await db.insert(s.assessments).values(assessmentRows).returning();

  const gradeResultRows: any[] = [];
  for (const a of assessments) {
    const secStudents = students.filter((st) => st.sectionId === a.sectionId);
    for (const st of secStudents) {
      const max = Number(a.maxScore);
      const score = Math.max(0, Math.min(max, Math.round(max * (0.55 + Math.random() * 0.45))));
      gradeResultRows.push({
        assessmentId: a.id, studentId: st.id, score: String(score),
        feedback: score / max >= 0.85 ? "أداء ممتاز، استمر" : score / max >= 0.6 ? "أداء جيد ويحتاج مراجعة بسيطة" : "يحتاج متابعة ودعم إضافي",
        aiGeneratedFeedback: "تم إنشاء الملاحظة تلقائيًا وتنتظر مراجعة المعلم قبل الاعتماد.",
      });
    }
  }
  // Insert in chunks to keep query size reasonable
  for (let i = 0; i < gradeResultRows.length; i += 500) {
    await db.insert(s.gradesResults).values(gradeResultRows.slice(i, i + 500));
  }

  // ================= ADMISSIONS LEADS =================
  const stages = ["Inquiry", "Tour Booked", "Applied", "Assessment", "Interview", "Accepted", "Fee Paid", "Enrolled", "Rejected"];
  const leadRows = Array.from({ length: 15 }).map((_, i) => {
    const gender = pick(["Male", "Female"]) as "Male" | "Female";
    const { firstAr, lastAr } = fullName(gender);
    const parentGender = pick(["Male", "Female"]) as "Male" | "Female";
    const { firstAr: pFirst, lastAr: pLast } = fullName(parentGender);
    return {
      schoolId: school.id, branchId: branch.id,
      studentName: `${firstAr} ${lastAr}`, parentName: `${pFirst} ${pLast}`,
      phone: `+20 1${randInt(0, 2)} ${randInt(1000000, 9999999)}`,
      email: `lead${i + 1}@example.com`,
      gradeInterested: pick(gradeDefs.map((g) => g.nameEn)),
      curriculumInterested: "Egyptian National",
      source: pick(["Website", "WhatsApp", "Referral", "Facebook", "Walk-in"]),
      stage: pick(stages),
      score: randInt(40, 95),
      aiNextAction: "المتابعة عبر واتساب وإرسال دليل القبول للعام الدراسي الجديد",
      notes: "",
    };
  });
  await db.insert(s.leads).values(leadRows);

  // ================= COMMUNICATION =================
  await db.insert(s.announcements).values([
    { schoolId: school.id, branchId: branch.id, titleAr: "بدء العام الدراسي 2025/2026", titleEn: "Start of 2025/2026 School Year", contentAr: "نرحب بجميع الطلاب وأولياء الأمور في بداية عام دراسي جديد.", contentEn: "Welcome back to a new school year.", targetRole: "all", priority: "normal" },
    { schoolId: school.id, branchId: branch.id, titleAr: "اجتماع أولياء الأمور", titleEn: "Parents Meeting", contentAr: "يعقد اجتماع أولياء الأمور يوم الخميس القادم الساعة 10 صباحًا.", contentEn: "Parents meeting next Thursday at 10 AM.", targetRole: "parent", priority: "urgent" },
    { schoolId: school.id, branchId: branch.id, titleAr: "جدول الاختبارات النهائية", titleEn: "Final Exams Schedule", contentAr: "تم رفع جدول الاختبارات النهائية على المنصة.", contentEn: "Final exams schedule is now available.", targetRole: "all", priority: "normal" },
  ]);

  const messageRows: any[] = [];
  for (let i = 0; i < 20; i++) {
    const sender = pick(guardianUsers);
    const receiver = pick(teacherUsers);
    messageRows.push({
      senderId: sender.id, receiverId: receiver.id,
      subject: pick(["استفسار عن الحضور", "متابعة الدرجات", "طلب اجتماع", "استفسار عن الرسوم", "شكر وتقدير"]),
      body: "رسالة تجريبية من نظام مودرن سكول نيو جينيريشن لمتابعة شؤون الطالب.",
      isRead: Math.random() < 0.6,
      sentiment: pick(["positive", "neutral", "neutral", "negative", "urgent"]),
      category: pick(["academic", "attendance", "finance", "general"]),
    });
  }
  await db.insert(s.messages).values(messageRows);

  await db.insert(s.tickets).values(
    Array.from({ length: 10 }).map((_, i) => ({
      schoolId: school.id,
      reporterId: pick(guardianUsers).id,
      category: pick(["Academics", "Transport", "Fees", "Bullying", "Facility"]),
      title: `تذكرة دعم رقم ${i + 1}`,
      description: "وصف تجريبي لمشكلة تم الإبلاغ عنها عبر بوابة أولياء الأمور.",
      urgency: pick(["low", "medium", "high", "critical"]),
      status: pick(["open", "in_progress", "resolved", "closed"]),
      aiCategoryTriage: "تم التصنيف تلقائيًا عبر الذكاء الاصطناعي وتوجيه التذكرة للمسؤول المختص.",
    }))
  );

  // ================= OPERATIONS =================
  const routeRows = Array.from({ length: 5 }).map((_, i) => ({
    branchId: branch.id,
    nameAr: `خط سير ${i + 1}`,
    nameEn: `Route ${i + 1}`,
    busPlateNumber: `ن ع ب ${randInt(1000, 9999)}`,
    driverName: `${pick(MALE_NAMES)[0]} ${pick(LAST_NAMES)[0]}`,
    driverPhone: `+20 1${randInt(0, 2)} ${randInt(1000000, 9999999)}`,
    supervisorName: `${pick(FEMALE_NAMES)[0]} ${pick(LAST_NAMES)[0]}`,
    capacity: 30,
    currentStatus: pick(["idle", "morning_pickup", "at_school", "afternoon_drop", "completed"]),
    currentStopName: "محطة التجمع الخامس",
    etaMinutes: randInt(0, 25),
  }));
  const routes = await db.insert(s.transportRoutes).values(routeRows).returning();

  const transportStudents = students.slice(0, 80);
  await db.insert(s.studentTransport).values(
    transportStudents.map((st) => ({
      studentId: st.id,
      routeId: pick(routes).id,
      stopName: pick(["محطة التجمع الأول", "محطة الرحاب", "محطة مدينتي", "محطة الشروق"]),
      pickupTime: "06:45",
      dropoffTime: "15:15",
    }))
  );

  await db.insert(s.libraryBooks).values(
    Array.from({ length: 30 }).map((_, i) => ({
      schoolId: school.id,
      title: `كتاب رقم ${i + 1}`,
      author: `${pick(MALE_NAMES)[0]} ${pick(LAST_NAMES)[0]}`,
      isbn: `978-${randInt(1000000000, 1999999999)}`,
      category: pick(["أدب", "علوم", "تاريخ", "قصص أطفال", "مناهج دراسية"]),
      totalCopies: randInt(3, 15),
      availableCopies: randInt(0, 10),
    }))
  );

  await db.insert(s.clinicVisits).values(
    Array.from({ length: 15 }).map(() => {
      const st = pick(students);
      return {
        studentId: st.id,
        nurseId: nurseUser.id,
        complaint: pick(["صداع بسيط", "ألم في المعدة", "دوخة خفيفة", "جرح بسيط أثناء اللعب", "حمى خفيفة"]),
        temperature: `${(36 + Math.random() * 2).toFixed(1)} C`,
        treatmentGiven: "راحة في العيادة مع متابعة الحالة",
        parentNotified: Math.random() < 0.7,
        sentHome: Math.random() < 0.15,
      };
    })
  );

  // ================= BEHAVIOR =================
  await db.insert(s.behaviorIncidents).values(
    Array.from({ length: 20 }).map(() => {
      const st = pick(students);
      const type = pick(["merit", "positive", "minor_violation", "major_incident"]);
      return {
        studentId: st.id,
        recordedBy: pick(teacherUsers).id,
        type,
        title: type === "merit" || type === "positive" ? "سلوك إيجابي متميز" : "مخالفة سلوكية",
        description: "وصف تجريبي لواقعة سلوكية تم تسجيلها من قبل المعلم.",
        points: type === "merit" ? 10 : type === "positive" ? 5 : type === "minor_violation" ? -5 : -15,
        actionTaken: type.includes("violation") || type.includes("incident") ? "تنبيه شفهي وإبلاغ ولي الأمر" : "شكر وتقدير أمام الفصل",
        isConfidential: type === "major_incident",
      };
    })
  );

  await db.insert(s.counselorCases).values(
    Array.from({ length: 8 }).map(() => {
      const st = pick(students);
      return {
        studentId: st.id,
        counselorId: findAdmin("counselor").id,
        caseTitle: "متابعة حالة تكيف دراسي",
        caseCategory: pick(["Academic", "Emotional", "Social", "Family", "Behavioral"]),
        status: pick(["active", "monitoring", "resolved"]),
        confidentialNotes: "ملاحظات سرية خاصة بالأخصائي الاجتماعي حول متابعة الحالة.",
        interventionPlan: "خطة متابعة أسبوعية مع ولي الأمر والمعلم المختص",
        nextFollowUpDate: isoDate(daysAgo(-14)),
      };
    })
  );

  // ================= AI / AUDIT LOGS =================
  await db.insert(s.aiLogs).values(
    Array.from({ length: 10 }).map(() => ({
      userId: pick(staffUsers).id,
      featureName: pick(["parent_assistant", "lead_scoring", "report_card_comments", "command_center", "what_if_simulator"]),
      promptSummary: "استعلام تجريبي من مستخدم عبر لوحة الذكاء الاصطناعي",
      outputSummary: "استجابة تجريبية تم توليدها بواسطة النموذج",
      modelName: "gpt-4o-mock",
      feedback: pick(["thumbs_up", "thumbs_up", "thumbs_down", null]) as any,
    }))
  );

  await db.insert(s.auditLogs).values(
    Array.from({ length: 10 }).map(() => ({
      userId: pick(staffUsers).id,
      action: pick(["ENROLL_STUDENT", "UPDATE_INVOICE", "RECORD_PAYMENT", "UPDATE_GRADE", "APPROVE_LEAVE"]),
      entity: pick(["students", "invoices", "payments", "grades_results", "leaves"]),
      entityId: randInt(1, 200),
      details: "إجراء تجريبي تم تسجيله في سجل المراجعة",
    }))
  );

  console.log(
    `✅ Seeded: 1 school (${school.nameAr}), ${grades.length} grades, ${sections.length} sections, ${staffUsers.length} staff (${teacherUsers.length} teachers), ${students.length} students.`
  );
}
