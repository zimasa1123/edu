import { db } from "./index";
import * as s from "./schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  console.log("Seeding EduNexus database with demo data...");

  // Clear existing data in reverse order of foreign keys
  await db.execute(sql`TRUNCATE TABLE 
    audit_logs, ai_logs, counselor_cases, behavior_incidents, clinic_visits, 
    library_books, student_transport, transport_routes, tickets, announcements, 
    messages, leaves, staff, payments, invoices, fee_plans, grades_results, 
    assessments, staff_attendance, attendance, timetable_slots, subjects, 
    leads, student_guardians, students, guardians, users, sections, grades, 
    terms, academic_years, branches, schools RESTART IDENTITY CASCADE`);

  // 1. Schools
  const [cairoSchool, ammanSchool] = await db
    .insert(s.schools)
    .values([
      {
        nameAr: "مدرسة النور الدولية (بيانات تجريبية)",
        nameEn: "Al Noor International School (DEMO)",
        code: "NOOR-CAI",
        country: "Egypt",
        currency: "EGP",
        phone: "+20 2 2750 8800",
        email: "info@alnoor-school.eg",
        website: "https://alnoor-demo.edu.eg",
        settings: {
          enableAiGrading: true,
          enableParentAi: true,
          offlineAttendanceSync: true,
          primaryLanguage: "ar",
        },
      },
      {
        nameAr: "أكاديمية عمّان الحديثة (بيانات تجريبية)",
        nameEn: "Amman Modern Academy (DEMO)",
        code: "AMA-AMM",
        country: "Jordan",
        currency: "JOD",
        phone: "+962 6 580 4400",
        email: "admissions@ammanmodern.edu.jo",
        website: "https://ammanmodern-demo.edu.jo",
        settings: {
          enableAiGrading: true,
          enableParentAi: true,
          offlineAttendanceSync: true,
          primaryLanguage: "ar",
        },
      },
    ])
    .returning();

  // 2. Branches
  const [cairoMainBranch, newCairoBranch, ammanWestBranch] = await db
    .insert(s.branches)
    .values([
      {
        schoolId: cairoSchool.id,
        nameAr: "فرع المعادي الرئيسي",
        nameEn: "Maadi Main Campus",
        code: "MAADI-01",
        city: "Cairo",
        address: "شارع 250، دجلة، المعادي، القاهرة",
        principalName: "د. طارق المنشاوي / Dr. Tarek El-Minshawy",
        phone: "+20 2 2519 1200",
      },
      {
        schoolId: cairoSchool.id,
        nameAr: "فرع التجمع الخامس",
        nameEn: "New Cairo Campus",
        code: "NC-02",
        city: "New Cairo",
        address: "التجمع الخامس، الحي الدبلوماسي",
        principalName: "أ. منى زهران / Mrs. Mona Zahran",
        phone: "+20 2 2813 9000",
      },
      {
        schoolId: ammanSchool.id,
        nameAr: "فرع دابوق",
        nameEn: "Dabouq Campus",
        code: "DAB-01",
        city: "Amman",
        address: "شارع المدينة الطبية، دابوق، عمّان",
        principalName: "د. بشرى حداد / Dr. Bushra Haddad",
        phone: "+962 6 541 2200",
      },
    ])
    .returning();

  // 3. Academic Years & Terms
  const [academicYear] = await db
    .insert(s.academicYears)
    .values([
      {
        schoolId: cairoSchool.id,
        name: "2024 - 2025",
        startDate: "2024-09-01",
        endDate: "2025-06-30",
        isCurrent: true,
      },
    ])
    .returning();

  await db.insert(s.terms).values([
    {
      academicYearId: academicYear.id,
      name: "الفصل الدراسي الأول / Term 1",
      startDate: "2024-09-01",
      endDate: "2025-01-20",
      isCurrent: false,
    },
    {
      academicYearId: academicYear.id,
      name: "الفصل الدراسي الثاني / Term 2",
      startDate: "2025-02-01",
      endDate: "2025-06-30",
      isCurrent: true,
    },
  ]);

  // 4. Grades
  const [gradeKg2, grade4, grade9, grade11] = await db
    .insert(s.grades)
    .values([
      {
        schoolId: cairoSchool.id,
        nameAr: "الروضة الثانية (KG2)",
        nameEn: "Kindergarten 2",
        code: "KG-2",
        stage: "KG",
        curriculum: "British Early Years",
        orderIndex: 2,
      },
      {
        schoolId: cairoSchool.id,
        nameAr: "الصف الرابع الابتدائي (Grade 4)",
        nameEn: "Grade 4 Primary",
        code: "G-4",
        stage: "Primary",
        curriculum: "American Diploma",
        orderIndex: 4,
      },
      {
        schoolId: cairoSchool.id,
        nameAr: "الصف الثالث الإعدادي / التاسع (Grade 9)",
        nameEn: "Grade 9 Prep / Middle",
        code: "G-9",
        stage: "Prep",
        curriculum: "Egyptian National Thanaweya Prep",
        orderIndex: 9,
      },
      {
        schoolId: cairoSchool.id,
        nameAr: "الصف الثاني الثانوي (Grade 11)",
        nameEn: "Grade 11 Secondary",
        code: "G-11",
        stage: "Secondary",
        curriculum: "British IGCSE / Cambridge",
        orderIndex: 11,
      },
    ])
    .returning();

  // 5. Sections
  const [section4A, section4B, section9A, section11A] = await db
    .insert(s.sections)
    .values([
      {
        gradeId: grade4.id,
        branchId: cairoMainBranch.id,
        name: "4-A (Blue Jay)",
        roomNumber: "Building B - Room 204",
        capacity: 25,
        gender: "Mixed",
      },
      {
        gradeId: grade4.id,
        branchId: cairoMainBranch.id,
        name: "4-B (Falcon)",
        roomNumber: "Building B - Room 205",
        capacity: 25,
        gender: "Mixed",
      },
      {
        gradeId: grade9.id,
        branchId: cairoMainBranch.id,
        name: "9-A",
        roomNumber: "Building C - Room 301",
        capacity: 28,
        gender: "Mixed",
      },
      {
        gradeId: grade11.id,
        branchId: cairoMainBranch.id,
        name: "11-IGCSE-Science",
        roomNumber: "Science Wing - Lab 2",
        capacity: 22,
        gender: "Mixed",
      },
    ])
    .returning();

  // 6. Users (Multi-role demo accounts)
  const createdUsers = await db
    .insert(s.users)
    .values([
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "superadmin@edunexus.demo",
        fullNameAr: "المهندس كريم الشريف (سوبر أدمن)",
        fullNameEn: "Eng. Karim El-Sherif (Super Admin)",
        role: "super_admin",
        phone: "+20 100 111 2233",
        nationalId: "28809150102394",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "owner@edunexus.demo",
        fullNameAr: "الحاج عصام نور الدين (مالك المدارس)",
        fullNameEn: "Haj Essam Nour El-Din (School Owner)",
        role: "school_owner",
        phone: "+20 100 555 7788",
        nationalId: "26001010103492",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "principal@edunexus.demo",
        fullNameAr: "د. طارق المنشاوي (مدير المدرسة)",
        fullNameEn: "Dr. Tarek El-Minshawy (Principal)",
        role: "principal",
        phone: "+20 100 222 3344",
        nationalId: "27503140101234",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "registrar@edunexus.demo",
        fullNameAr: "أ. نورهان صادق (مسؤولة القبول والتسجيل)",
        fullNameEn: "Ms. Nourhan Sadek (Registrar & Admissions)",
        role: "registrar",
        phone: "+20 102 334 5566",
        nationalId: "29204050101982",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "accountant@edunexus.demo",
        fullNameAr: "أ. مجدي عبد الفتاح (المدير المالي)",
        fullNameEn: "Mr. Magdy Abdel-Fattah (Chief Accountant)",
        role: "accountant",
        phone: "+20 100 778 9900",
        nationalId: "27811120102456",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "teacher.math@edunexus.demo",
        fullNameAr: "أ. أحمد فؤاد (معلم الرياضيات والمنسق)",
        fullNameEn: "Mr. Ahmed Fouad (Math Teacher & Coordinator)",
        role: "teacher",
        phone: "+20 106 777 4433",
        nationalId: "28508200103456",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "counselor@edunexus.demo",
        fullNameAr: "د. سلمى عبد العزيز (الأخصائية النفسية)",
        fullNameEn: "Dr. Salma Abdel-Aziz (Counselor)",
        role: "counselor",
        phone: "+20 101 445 6677",
        nationalId: "28912250101567",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "nurse@edunexus.demo",
        fullNameAr: "م. هالة الشامي (طبيبة العيادة المدرسية)",
        fullNameEn: "Nurse Hala El-Shamy (School Nurse)",
        role: "nurse",
        phone: "+20 109 888 1122",
        nationalId: "29107140102876",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "transport@edunexus.demo",
        fullNameAr: "كابتن محمود الباز (مسؤول النقل والحافلات)",
        fullNameEn: "Capt. Mahmoud El-Baz (Transport Manager)",
        role: "transport_manager",
        phone: "+20 100 999 4455",
        nationalId: "27606060101890",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "parent.youssef@edunexus.demo",
        fullNameAr: "المهندس حازم الكيلاني (ولي أمر)",
        fullNameEn: "Eng. Hazem El-Kilany (Parent)",
        role: "parent",
        phone: "+20 100 888 9911",
        nationalId: "28205100101789",
      },
      {
        schoolId: cairoSchool.id,
        branchId: cairoMainBranch.id,
        email: "student.youssef@edunexus.demo",
        fullNameAr: "يوسف حازم الكيلاني (طالب)",
        fullNameEn: "Youssef Hazem El-Kilany (Student)",
        role: "student",
        phone: "+20 102 111 7766",
        nationalId: "31304220104523",
      },
    ])
    .returning();

  const userMap = Object.fromEntries(createdUsers.map((u) => [u.email, u]));

  // 7. Guardians
  const [parentGuardian] = await db
    .insert(s.guardians)
    .values([
      {
        userId: userMap["parent.youssef@edunexus.demo"].id,
        relationship: "Father / الأب",
        profession: "Senior Software Architect / مهندس برمجيات استشاري",
        workplace: "Vodafone International Services - Smart Village",
        emergencyPhone: "+20 122 345 6789",
        engagementScore: 94,
        whatsappEnabled: true,
        preferredLanguage: "ar",
      },
    ])
    .returning();

  // 8. Students
  const [studentYoussef, studentZeina, studentOmar, studentMariam, studentAli] =
    await db
      .insert(s.students)
      .values([
        {
          schoolId: cairoSchool.id,
          branchId: cairoMainBranch.id,
          gradeId: grade4.id,
          sectionId: section4A.id,
          studentCode: "STU-2024-001",
          nationalId: "31304220104523",
          firstNameAr: "يوسف",
          lastNameAr: "الكيلاني",
          firstNameEn: "Youssef",
          lastNameEn: "El-Kilany",
          gender: "Male",
          birthDate: "2014-04-22",
          nationality: "Egyptian",
          religion: "Muslim",
          bloodGroup: "O+",
          medicalNotes: "حساسية موسمية من الغبار واللقاح. يحمل بخاخ وقائي.",
          allergies: "غبار الطلع، الفول السوداني (Peanuts)",
          specialNeedsIep: false,
          previousSchool: "Modern English School (MES Cairo)",
          status: "enrolled",
          enrollmentDate: "2021-09-01",
          digitalPassportCode: "EGP-NOOR-STU-001",
          riskScore: 12,
          riskFactors: ["نسبة الحضور 96%", "أداء متميز في الرياضيات والعلوم"],
          canteenWalletBalance: "245.50",
          photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
        },
        {
          schoolId: cairoSchool.id,
          branchId: cairoMainBranch.id,
          gradeId: grade4.id,
          sectionId: section4A.id,
          studentCode: "STU-2024-002",
          nationalId: "31309100109921",
          firstNameAr: "زينة",
          lastNameAr: "المهدي",
          firstNameEn: "Zeina",
          lastNameEn: "El-Mahdy",
          gender: "Female",
          birthDate: "2014-09-10",
          nationality: "Egyptian",
          religion: "Muslim",
          bloodGroup: "A+",
          medicalNotes: "سليمة تماماً ولا توجد ملاحظات طبية",
          status: "enrolled",
          enrollmentDate: "2021-09-01",
          digitalPassportCode: "EGP-NOOR-STU-002",
          riskScore: 8,
          riskFactors: ["حضور كامل 100%", "لوحة الشرف للأذكياء"],
          canteenWalletBalance: "180.00",
          photoUrl: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=150&auto=format&fit=crop&q=80",
        },
        {
          schoolId: cairoSchool.id,
          branchId: cairoMainBranch.id,
          gradeId: grade9.id,
          sectionId: section9A.id,
          studentCode: "STU-2024-003",
          nationalId: "30911040108876",
          firstNameAr: "عمر",
          lastNameAr: "السيد",
          firstNameEn: "Omar",
          lastNameEn: "El-Sayed",
          gender: "Male",
          birthDate: "2009-11-04",
          nationality: "Egyptian",
          religion: "Muslim",
          bloodGroup: "B+",
          medicalNotes: "ضعف نظر بسيط - يرتدي نظارة طبية أثناء الحصص",
          status: "enrolled",
          enrollmentDate: "2019-09-01",
          digitalPassportCode: "EGP-NOOR-STU-003",
          riskScore: 78,
          riskFactors: [
            "غياب 4 أيام متتالية دون إذن مسبق",
            "انخفاض درجات منتصف الفصل في مادة العلوم",
            "قسط دراسي متأخر بقيمة 8,500 ج.م",
          ],
          canteenWalletBalance: "20.00",
          photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        },
        {
          schoolId: cairoSchool.id,
          branchId: cairoMainBranch.id,
          gradeId: grade11.id,
          sectionId: section11A.id,
          studentCode: "STU-2024-004",
          nationalId: "30702150106677",
          firstNameAr: "مريم",
          lastNameAr: "سليمان",
          firstNameEn: "Mariam",
          lastNameEn: "Soliman",
          gender: "Female",
          birthDate: "2007-02-15",
          nationality: "Jordanian",
          religion: "Christian",
          bloodGroup: "AB+",
          medicalNotes: "لا توجد أمراض مزمنة",
          status: "enrolled",
          enrollmentDate: "2023-09-01",
          digitalPassportCode: "EGP-NOOR-STU-004",
          riskScore: 15,
          riskFactors: ["متفوقة في مادة الأحياء Cambridge AS Level"],
          canteenWalletBalance: "310.00",
          photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        },
        {
          schoolId: cairoSchool.id,
          branchId: cairoMainBranch.id,
          gradeId: grade4.id,
          sectionId: section4A.id,
          studentCode: "STU-2024-005",
          nationalId: "31401050104432",
          firstNameAr: "علي",
          lastNameAr: "منصور",
          firstNameEn: "Ali",
          lastNameEn: "Mansour",
          gender: "Male",
          birthDate: "2014-01-05",
          nationality: "Egyptian",
          religion: "Muslim",
          bloodGroup: "O+",
          medicalNotes: "حساسية من مادة اللاكتوز (مشتقات الألبان)",
          status: "enrolled",
          enrollmentDate: "2022-09-01",
          digitalPassportCode: "EGP-NOOR-STU-005",
          riskScore: 35,
          riskFactors: ["تأخر صباحي متكرر مرتين أسبوعياً"],
          canteenWalletBalance: "95.00",
          photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        },
      ])
      .returning();

  // Link student with guardian
  await db.insert(s.studentGuardians).values([
    {
      studentId: studentYoussef.id,
      guardianId: parentGuardian.id,
      isPrimary: true,
      canPickup: true,
    },
  ]);

  // 9. Subjects
  const [mathSubj, scienceSubj, arabicSubj, englishSubj] = await db
    .insert(s.subjects)
    .values([
      {
        schoolId: cairoSchool.id,
        gradeId: grade4.id,
        nameAr: "الرياضيات المتقدمة",
        nameEn: "Mathematics",
        code: "MATH-401",
        creditHours: 5,
      },
      {
        schoolId: cairoSchool.id,
        gradeId: grade4.id,
        nameAr: "العلوم العامة واستكشاف الفضاء",
        nameEn: "General Science",
        code: "SCI-401",
        creditHours: 4,
      },
      {
        schoolId: cairoSchool.id,
        gradeId: grade4.id,
        nameAr: "اللغة العربية والتربية الإسلامية",
        nameEn: "Arabic Language",
        code: "ARB-401",
        creditHours: 5,
      },
      {
        schoolId: cairoSchool.id,
        gradeId: grade4.id,
        nameAr: "اللغة الإنجليزية والأدب",
        nameEn: "English Literature",
        code: "ENG-401",
        creditHours: 5,
      },
    ])
    .returning();

  // 10. Timetable Slots
  await db.insert(s.timetableSlots).values([
    {
      sectionId: section4A.id,
      subjectId: mathSubj.id,
      teacherId: userMap["teacher.math@edunexus.demo"].id,
      dayOfWeek: "Sunday",
      periodNumber: 1,
      startTime: "08:00",
      endTime: "08:45",
      room: "Room 204",
    },
    {
      sectionId: section4A.id,
      subjectId: scienceSubj.id,
      teacherId: userMap["teacher.math@edunexus.demo"].id,
      dayOfWeek: "Sunday",
      periodNumber: 2,
      startTime: "08:50",
      endTime: "09:35",
      room: "Lab 1",
    },
    {
      sectionId: section4A.id,
      subjectId: englishSubj.id,
      teacherId: userMap["teacher.math@edunexus.demo"].id,
      dayOfWeek: "Monday",
      periodNumber: 1,
      startTime: "08:00",
      endTime: "08:45",
      room: "Room 204",
    },
    {
      sectionId: section4A.id,
      subjectId: arabicSubj.id,
      teacherId: userMap["teacher.math@edunexus.demo"].id,
      dayOfWeek: "Monday",
      periodNumber: 2,
      startTime: "08:50",
      endTime: "09:35",
      room: "Room 204",
    },
  ]);

  // 11. Admissions CRM Leads (Pipelines with AI Lead Scoring)
  await db.insert(s.leads).values([
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      studentName: "حمزة شريف الهواري",
      parentName: "المستشار شريف الهواري",
      phone: "+20 101 234 5678",
      email: "sherif.elhawary@lawfirm.eg",
      gradeInterested: "الصف الرابع الابتدائي (Grade 4)",
      curriculumInterested: "American Diploma",
      source: "WhatsApp",
      stage: "Tour Booked",
      score: 92,
      aiNextAction: "إرسال تذكير عبر واتساب بجولة الحرم المدرسي يوم الثلاثاء 10 صباحاً مع د. طارق",
      notes: "ولي الأمر مهتم جداً ببرامج الروبوتكس وملاعب كرة القدم. لديه شقيق أصغر في KG1.",
      scheduledAt: new Date(Date.now() + 86400000 * 2),
    },
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      studentName: "ليلى محمود عبد الدايم",
      parentName: "د. هبة عبد الغفار",
      phone: "+20 112 345 6789",
      email: "dr.heba@cleopatra-hosp.com",
      gradeInterested: "الروضة الثانية (KG2)",
      curriculumInterested: "British Early Years",
      source: "Website",
      stage: "Assessment",
      score: 85,
      aiNextAction: "جدولة اختبار تحديد المستوى السلوكي واللغوي وإشعار الأخصائية النفسية",
      notes: "محولة من مدرسة دولية في دبي بعد عودة الأسرة للاستقرار في مصر.",
      scheduledAt: new Date(Date.now() + 86400000 * 3),
    },
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      studentName: "زياد طلال الرواشدة",
      parentName: "المهندس طلال الرواشدة",
      phone: "+962 7 9123 4567",
      email: "talal.rawashdeh@aramco.com",
      gradeInterested: "الصف الثاني الثانوي (Grade 11)",
      curriculumInterested: "British IGCSE / Cambridge",
      source: "Referral",
      stage: "Accepted",
      score: 98,
      aiNextAction: "إرسال خطاب القبول الرسمي ورابط سداد الدفعة الأولى من المصروفات (فوري / بطاقة)",
      notes: "طالب متفوق حاصل على شهادات في الأولمبياد العربي للرياضيات.",
    },
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      studentName: "سيف الدين رامز",
      parentName: "أ. رامز الفايد",
      phone: "+20 100 456 7890",
      email: "ramez.fayed@fayedgroup.com",
      gradeInterested: "الصف الثالث الإعدادي (Grade 9)",
      curriculumInterested: "Egyptian National",
      source: "Walk-in",
      stage: "Inquiry",
      score: 64,
      aiNextAction: "إرسال كتيب المدرسة الرقمي وتفاصيل باقات الأنشطة اللامنهجية",
      notes: "استفسر عن رسوم الانتقال بالحافلة لمنطقة المعادي والتجمع.",
    },
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      studentName: "نادين تامر القاضي",
      parentName: "د. تامر القاضي",
      phone: "+20 122 789 0123",
      email: "tamer.kadi@aun.edu.eg",
      gradeInterested: "الصف الرابع الابتدائي (Grade 4)",
      curriculumInterested: "American Diploma",
      stage: "Fee Paid",
      source: "Facebook",
      score: 100,
      aiNextAction: "تجهيز الزي المدرسي والكتب وتوليد كود الدخول لبوابة أولياء الأمور",
      notes: "تم سداد القسط الأول بالكامل عبر خدمة Fawry Pay.",
    },
  ]);

  // 12. Attendance Records
  const today = new Date().toISOString().split("T")[0];
  await db.insert(s.attendance).values([
    {
      studentId: studentYoussef.id,
      sectionId: section4A.id,
      date: today,
      status: "present",
      recordedBy: userMap["teacher.math@edunexus.demo"].id,
    },
    {
      studentId: studentZeina.id,
      sectionId: section4A.id,
      date: today,
      status: "present",
      recordedBy: userMap["teacher.math@edunexus.demo"].id,
    },
    {
      studentId: studentOmar.id,
      sectionId: section9A.id,
      date: today,
      status: "absent",
      reason: "غياب بدون إشعار مسبق - جاري المتابعة الهاتفية من شؤون الطلاب",
      recordedBy: userMap["teacher.math@edunexus.demo"].id,
    },
    {
      studentId: studentAli.id,
      sectionId: section4A.id,
      date: today,
      status: "late",
      reason: "تأخر 20 دقيقة بسبب زحام مروري في محور الشهيد",
      recordedBy: userMap["teacher.math@edunexus.demo"].id,
    },
  ]);

  // 13. Assessments & Grades
  const [midtermAssessment, quizAssessment] = await db
    .insert(s.assessments)
    .values([
      {
        sectionId: section4A.id,
        subjectId: mathSubj.id,
        teacherId: userMap["teacher.math@edunexus.demo"].id,
        title: "اختبار منتصف الفصل الدراسي - الكسور والعمليات الحسابية",
        type: "exam",
        maxScore: "100.00",
        weight: 30,
        dueDate: "2025-03-15",
        description: "اختبار يشمل المفاهيم الهندسية، المقامات المشتركة، وحل المسائل الحياتية المعقدة.",
      },
      {
        sectionId: section4A.id,
        subjectId: scienceSubj.id,
        teacherId: userMap["teacher.math@edunexus.demo"].id,
        title: "مشروع العلوم: دورة المياه والتغير المناخي",
        type: "project",
        maxScore: "50.00",
        weight: 20,
        dueDate: "2025-03-22",
        description: "مجسم أو عرض تقديمي يشرح دورة الماء مع حلول الحفاظ على البيئة في الوطن العربي.",
      },
    ])
    .returning();

  await db.insert(s.gradesResults).values([
    {
      assessmentId: midtermAssessment.id,
      studentId: studentYoussef.id,
      score: "96.50",
      feedback: "إجابات ممتازة ودقة عالية في العمليات المركبة. بارك الله فيك يا يوسف.",
      aiGeneratedFeedback: "أظهر الطالب يوسف إتقاناً بارزاً (A+)، يوصى بإشراكه في نادي التحدي الرياضي.",
    },
    {
      assessmentId: midtermAssessment.id,
      studentId: studentZeina.id,
      score: "99.00",
      feedback: "المركز الأول على الفصل! إتقان تام لخطوات الحل والترتيب.",
      aiGeneratedFeedback: "أداء استثنائي كامل، استيعاب سريع للمسائل المنطقية.",
    },
    {
      assessmentId: midtermAssessment.id,
      studentId: studentAli.id,
      score: "74.00",
      feedback: "أداء جيد، لكن يحتاج لمراجعة قسم ضرب الأعداد الكسرية.",
      aiGeneratedFeedback: "يحتاج تدريباً إضافياً على الكسور غير المتجانسة لرفع الدرجة إلى مستوى B+.",
    },
  ]);

  // 14. Fee Structures & Invoices & Payments
  const [feePlanGrade4] = await db
    .insert(s.feePlans)
    .values([
      {
        schoolId: cairoSchool.id,
        gradeId: grade4.id,
        titleAr: "الخطة الدراسية السنوية - الصف الرابع الأمريكي",
        titleEn: "Annual Tuition - Grade 4 American Division",
        totalAmount: "45000.00",
        currency: "EGP",
        installmentCount: 3,
      },
    ])
    .returning();

  const [invYoussef1, invOmar1] = await db
    .insert(s.invoices)
    .values([
      {
        schoolId: cairoSchool.id,
        studentId: studentYoussef.id,
        invoiceNumber: "INV-2025-00101",
        titleAr: "القسط الدراسي الثاني (2024-2025) - الصف الرابع",
        titleEn: "Term 2 Tuition Installment - Grade 4",
        amount: "15000.00",
        paidAmount: "15000.00",
        discountAmount: "0.00",
        status: "paid",
        dueDate: "2025-02-15",
        currency: "EGP",
        lateRiskPrediction: "Low",
      },
      {
        schoolId: cairoSchool.id,
        studentId: studentOmar.id,
        invoiceNumber: "INV-2025-00102",
        titleAr: "القسط الدراسي الثاني (2024-2025) - الصف التاسع",
        titleEn: "Term 2 Tuition Installment - Grade 9",
        amount: "18500.00",
        paidAmount: "10000.00",
        discountAmount: "0.00",
        status: "overdue",
        dueDate: "2025-02-01",
        currency: "EGP",
        lateRiskPrediction: "High",
      },
      {
        schoolId: cairoSchool.id,
        studentId: studentZeina.id,
        invoiceNumber: "INV-2025-00103",
        titleAr: "القسط الدراسي الثالث (2024-2025) - الصف الرابع",
        titleEn: "Term 3 Tuition Installment - Grade 4",
        amount: "15000.00",
        paidAmount: "0.00",
        discountAmount: "1500.00", // Sibling / Merit discount
        status: "unpaid",
        dueDate: "2025-04-30",
        currency: "EGP",
        lateRiskPrediction: "Low",
      },
    ])
    .returning();

  await db.insert(s.payments).values([
    {
      invoiceId: invYoussef1.id,
      studentId: studentYoussef.id,
      receiptNumber: "REC-2025-0899",
      amount: "15000.00",
      method: "card",
      transactionRef: "PAYMOB-AUTH-8890123",
      notes: "تم السداد إلكترونياً عبر بوابة الدفع الإلكتروني بالفيزا البنكية",
    },
    {
      invoiceId: invOmar1.id,
      studentId: studentOmar.id,
      receiptNumber: "REC-2025-0720",
      amount: "10000.00",
      method: "fawry",
      transactionRef: "FAWRY-REF-998822",
      notes: "سداد جزئي عبر منافذ فوري، متبقي 8,500 ج.م",
    },
  ]);

  // 15. Staff records
  await db.insert(s.staff).values([
    {
      userId: userMap["principal@edunexus.demo"].id,
      jobTitleAr: "مدير المجمع المدرسي",
      jobTitleEn: "School Principal",
      department: "Administration",
      hireDate: "2018-08-01",
      basicSalary: "42000.00",
      allowance: "8000.00",
      contractType: "full_time",
      status: "active",
    },
    {
      userId: userMap["teacher.math@edunexus.demo"].id,
      jobTitleAr: "كبير معلمي الرياضيات والمنسق الأكاديمي",
      jobTitleEn: "Lead Mathematics Teacher & Academic Coordinator",
      department: "Mathematics",
      hireDate: "2020-09-01",
      basicSalary: "18500.00",
      allowance: "3500.00",
      contractType: "full_time",
      status: "active",
    },
    {
      userId: userMap["counselor@edunexus.demo"].id,
      jobTitleAr: "المستشارة النفسية والإرشاد الطلابي",
      jobTitleEn: "Head School Counselor",
      department: "Student Wellbeing",
      hireDate: "2021-09-01",
      basicSalary: "16000.00",
      allowance: "2000.00",
      contractType: "full_time",
      status: "active",
    },
  ]);

  // 16. Transport & Buses
  const [routeMaadi] = await db
    .insert(s.transportRoutes)
    .values([
      {
        branchId: cairoMainBranch.id,
        nameAr: "خط المعادي - دجلة وزهراء المعادي (حافلة 14)",
        nameEn: "Maadi - Degla & Zahraa Route (Bus 14)",
        busPlateNumber: "ق ر س 4821",
        driverName: "عماد فتحي السويفي",
        driverPhone: "+20 100 443 1188",
        supervisorName: "أ. سهام عبد الرؤوف",
        capacity: 28,
        currentStatus: "morning_pickup",
        currentStopName: "ميدان فيكتوريا - دجلة المعادي",
        etaMinutes: 12,
      },
      {
        branchId: cairoMainBranch.id,
        nameAr: "خط التجمع والنرجس (حافلة 22)",
        nameEn: "New Cairo & Nargess Route (Bus 22)",
        busPlateNumber: "ط ف ن 9154",
        driverName: "صابر المليجي",
        driverPhone: "+20 101 992 3344",
        supervisorName: "أ. مروة حسنين",
        capacity: 30,
        currentStatus: "at_school",
        currentStopName: "المبنى الرئيسي - بوابة 2",
        etaMinutes: 0,
      },
    ])
    .returning();

  await db.insert(s.studentTransport).values([
    {
      studentId: studentYoussef.id,
      routeId: routeMaadi.id,
      stopName: "شارع 216 - تقاطع دجلة أمام بنك CIB",
      pickupTime: "07:15",
      dropoffTime: "15:20",
    },
  ]);

  // 17. Clinic Visits
  await db.insert(s.clinicVisits).values([
    {
      studentId: studentAli.id,
      nurseId: userMap["nurse@edunexus.demo"].id,
      complaint: "صداع خفيف بعد حصة التربية الرياضية",
      temperature: "37.1 C",
      treatmentGiven: "راحة لمدة 20 دقيقة في العيادة، كمادات ماء معتدلة، وتناول وجبة خفيفة ومشروب عصير.",
      parentNotified: true,
      sentHome: false,
    },
  ]);

  // 18. Announcements & Messages
  await db.insert(s.announcements).values([
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      titleAr: "انطلاق أسبوع الابتكار والذكاء الاصطناعي 2025",
      titleEn: "Innovation & AI Week 2025 Kickoff",
      contentAr: "يسر إدارة مدارس النور دعوة أولياء الأمور والطلاب للمشاركة في معرض مشروعات الذكاء الاصطناعي والروبوتكس المقام يوم الخميس القادم بالمسرح الكبير.",
      contentEn: "Al Noor Schools invite parents and students to join the Annual AI & Robotics Exhibition next Thursday at the Grand Auditorium.",
      targetRole: "all",
      priority: "normal",
    },
    {
      schoolId: cairoSchool.id,
      branchId: cairoMainBranch.id,
      titleAr: "إجراءات التحديث الصحي ومتابعة اللقاحات الموسمية",
      titleEn: "Health & Immunization Records Update",
      contentAr: "تطلب العيادة المدرسية من أولياء الأمور تحديث بطاقات التطعيمات وشهادات الحساسية الطبية للطلاب قبل نهاية الشهر الجاري.",
      contentEn: "The school clinic requests parents to update immunization records and allergy forms before the end of this month.",
      targetRole: "parents",
      priority: "urgent",
    },
  ]);

  // 19. Behavior Incidents & Counselor Cases
  await db.insert(s.behaviorIncidents).values([
    {
      studentId: studentYoussef.id,
      recordedBy: userMap["teacher.math@edunexus.demo"].id,
      type: "merit",
      title: "مساعدة زملاء الصف في فهم المسائل الهندسية المعقدة",
      description: "بادر الطالب يوسف بمساعدة زملائه في حصة الرياضيات التفاعلية وشرح الخطوات بروح تعاونية مميزة.",
      points: 10,
      actionTaken: "منح وسام التميز وشهادة تقدير من معلم المادة",
      isConfidential: false,
    },
    {
      studentId: studentOmar.id,
      recordedBy: userMap["teacher.math@edunexus.demo"].id,
      type: "minor_violation",
      title: "تأخر غير مبرر وعدم إحضار الواجب المنزلي",
      description: "تكرار عدم تسليم التكليف الأسبوعي للعلوم للمرة الثانية هذا الشهر.",
      points: -5,
      actionTaken: "جلسة إرشادية وتنبيه شفهي وإخطار الأخصائي النفسي للمتابعة",
      isConfidential: false,
    },
  ]);

  await db.insert(s.counselorCases).values([
    {
      studentId: studentOmar.id,
      counselorId: userMap["counselor@edunexus.demo"].id,
      caseTitle: "متابعة تراجع الدافعية الدراسية والغياب المتكرر",
      caseCategory: "Academic & Emotional",
      status: "active",
      confidentialNotes: "لوحظ على الطالب تشتت ذهني بعد انتقال شقيقه الأكبر للجامعة خارج البلاد. تم عقد جلسة أولى دافئة والتفاهم على خطة أهداف أسبوعية صغيرة.",
      interventionPlan: "1) جلستان إرشاديتان أسبوعياً. 2) تنسيق مع معلم الرياضيات لتقديم دعم إيجابي. 3) اجتماع دوري مع ولي الأمر يوم الخميس.",
      nextFollowUpDate: "2025-03-20",
    },
  ]);

  // 20. Tickets / Complaints
  await db.insert(s.tickets).values([
    {
      schoolId: cairoSchool.id,
      reporterId: userMap["parent.youssef@edunexus.demo"].id,
      category: "Transport",
      title: "طلب تعديل نقطة التوقف الصباحية للحافلة 14 بضعة أمتار",
      description: "نظراً لأعمال صيانة الطريق عند تقاطع 216، نرجو أن تتوقف الحافلة أمام بوابة الكومباوند لضمان سلامة الأطفال.",
      urgency: "medium",
      status: "open",
      assignedTo: userMap["transport@edunexus.demo"].id,
      aiCategoryTriage: "تم التصنيف تلقائياً: [مواصلات وحافلات - أمان الطلاب]، تم تحويلها لمسؤول الحركة بموجب اتفاقية مستوى الخدمة (SLA 24h).",
    },
  ]);

  // 21. Library Books
  await db.insert(s.libraryBooks).values([
    {
      schoolId: cairoSchool.id,
      title: "موسوعة تاريخ الحضارة المصرية القديمة للناشئة",
      author: "د. زاهي حواس",
      isbn: "978-977-09-2144-8",
      category: "History & Culture",
      totalCopies: 6,
      availableCopies: 4,
    },
    {
      schoolId: cairoSchool.id,
      title: "Cambridge Primary Science Learner's Book 4",
      author: "Fiona Baxter & Liz Dilley",
      isbn: "978-1108742726",
      category: "Science",
      totalCopies: 20,
      availableCopies: 18,
    },
    {
      schoolId: cairoSchool.id,
      title: "مقدمة في الذكاء الاصطناعي وبايثون لطلاب المدارس",
      author: "م. محمد عبد المنعم",
      isbn: "978-977-14-5512-1",
      category: "Technology",
      totalCopies: 8,
      availableCopies: 5,
    },
  ]);

  console.log("EduNexus demo database successfully seeded!");
}

// Execute if run directly via ts-node / tsx
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
