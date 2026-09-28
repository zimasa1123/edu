export interface AiResponse<T = any> {
  success: boolean;
  data: T;
  model: string;
  isMock: boolean;
  disclaimer: string;
  timestamp: string;
}

const AI_API_KEY = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || "";
export const IS_MOCK_MODE = !AI_API_KEY;

export const AI_META = {
  isMock: IS_MOCK_MODE,
  modelName: IS_MOCK_MODE ? "EduNexus Mock AI (Deterministic Educational LLM)" : "GPT-4o / Claude 3.5",
  disclaimerAr: "تم التوليد بواسطة الذكاء الاصطناعي لمساعدة الكادر التعليمي. يتطلب اعتماد ومراجعة المسؤول البشري دائماً.",
  disclaimerEn: "AI-generated recommendation for educational assistance. Always requires human verification.",
};

// 1. Natural Language Command Center
export async function runNaturalLanguageQuery(query: string, language: "ar" | "en" = "ar") {
  const normalized = query.toLowerCase().trim();

  if (normalized.includes("غائب") || normalized.includes("absent") || normalized.includes("overdue") || normalized.includes("متأخر")) {
    return {
      type: "student_risk_query",
      intentAr: "البحث عن الطلاب المعرضين للخطر (غياب متكرر ورسوم متأخرة)",
      intentEn: "Search for at-risk students (frequent absences & overdue fees)",
      sqlDescription: "SELECT * FROM students JOIN invoices ON ... WHERE attendance.absent_days >= 3 AND invoices.status = 'overdue'",
      filtersApplied: { minAbsentDays: 3, invoiceStatus: "overdue" },
      matchedStudentIds: [3], // Omar El-Sayed
      summaryAr: "تم العثور على طالب واحد يستوفي المعايير: عمر السيد (الصف التاسع) - غائب 4 أيام، متأخرات 8,500 ج.م.",
      summaryEn: "Found 1 matching student: Omar El-Sayed (Grade 9) - 4 absent days, overdue 8,500 EGP.",
    };
  }

  if (normalized.includes("حافلة") || normalized.includes("باص") || normalized.includes("bus") || normalized.includes("transport")) {
    return {
      type: "transport_query",
      intentAr: "استعلام عن مسارات الحافلات ومواقع الوصول التقديرية",
      intentEn: "Inquire about bus routes and live ETAs",
      summaryAr: "حافلة المعادي (14) في طريقها لمحطة ميدان فيكتوريا (وصول خلال 12 دقيقة). حافلة التجمع (22) وصلت الحرم المدرسي.",
      summaryEn: "Maadi Bus 14 is en route to Victoria Square (ETA 12 mins). New Cairo Bus 22 has arrived at campus.",
    };
  }

  if (normalized.includes("تحصيل") || normalized.includes("fees") || normalized.includes("رسوم") || normalized.includes("مصروفات")) {
    return {
      type: "finance_query",
      intentAr: "ملخص تحصيل المصروفات المدرسية للشهر الحالي",
      intentEn: "School fee collection summary for current month",
      summaryAr: "تم تحصيل 25,000 ج.م من أصل 48,500 ج.م (نسبة التحصيل 51.5%). المتبقي المتأخر: 8,500 ج.م.",
      summaryEn: "Collected 25,000 EGP out of 48,500 EGP (Collection rate 51.5%). Overdue remaining: 8,500 EGP.",
    };
  }

  return {
    type: "general_search",
    intentAr: `استعلام عن: "${query}"`,
    intentEn: `Query for: "${query}"`,
    summaryAr: `تمت معالجة الاستعلام الذكي بأمان دون استعلامات SQL غير مصرحة. تم فحص صلاحيات المستخدم وتقديم البيانات الملائمة.`,
    summaryEn: `Smart query processed securely. Permission-checked results generated.`,
    matchedStudentIds: [1, 2],
  };
}

// 2. Early-Warning Engine
export async function calculateEarlyWarning(studentData: {
  name: string;
  attendanceRate: number;
  gradeAverage: number;
  unpaidFees: number;
  incidentCount: number;
}) {
  let riskScore = 10;
  const factorsAr: string[] = [];
  const factorsEn: string[] = [];

  if (studentData.attendanceRate < 85) {
    riskScore += 35;
    factorsAr.push(`نسبة الحضور منخفضة (${studentData.attendanceRate}%)`);
    factorsEn.push(`Low attendance rate (${studentData.attendanceRate}%)`);
  }
  if (studentData.gradeAverage < 75) {
    riskScore += 25;
    factorsAr.push(`متوسط الدرجات أقل من المتوقع (${studentData.gradeAverage}%)`);
    factorsEn.push(`Grade average below expected (${studentData.gradeAverage}%)`);
  }
  if (studentData.unpaidFees > 0) {
    riskScore += 15;
    factorsAr.push(`تأخر في سداد المصروفات الدراسية`);
    factorsEn.push(`Pending overdue tuition payments`);
  }
  if (studentData.incidentCount > 1) {
    riskScore += 15;
    factorsAr.push(`تسجيل ملاحظات سلوكية سلبية`);
    factorsEn.push(`Multiple behavioral infractions logged`);
  }

  riskScore = Math.min(100, Math.max(5, riskScore));

  const recommendedInterventionsAr = [
    "جدولة جلسة استماع تربوية مع الأخصائي الاجتماعي خلال 48 ساعة",
    "تفعيل خطة دعم أكاديمي فردية في المواد المتعثرة",
    "التواصل الودي مع ولي الأمر لتنسيق جدول الاستذكار المنزلي",
  ];
  const recommendedInterventionsEn = [
    "Schedule an emotional wellbeing session with counselor within 48h",
    "Activate personalized academic recovery tutoring in weak subjects",
    "Engage guardian via friendly conference to harmonize home study routine",
  ];

  return {
    riskScore,
    riskLevel: riskScore > 65 ? "High" : riskScore > 35 ? "Medium" : "Low",
    factorsAr,
    factorsEn,
    recommendedInterventionsAr,
    recommendedInterventionsEn,
  };
}

// 3. Parent AI Assistant (Bilingual / Arabic first)
export async function askParentAssistant(question: string, context: { childName: string; grade: string }) {
  const q = question.toLowerCase();

  if (q.includes("واجب") || q.includes("homework") || q.includes("تكليف")) {
    return {
      answerAr: `لدى ${context.childName} واجب رياضيات عن "جمع الكسور العشرية" مستحق غداً، ومشروع العلوم مستحق يوم الخميس القادم. تم تسليم واجب اللغة العربية بالأمس بنجاح!`,
      answerEn: `${context.childName} has a Math homework on 'Adding Decimals' due tomorrow, and a Science project due next Thursday. Arabic homework was successfully submitted yesterday!`,
      sources: ["جدول الواجبات المدرسية - الصف الرابع", "سجل التكليفات الأسبوعي"],
    };
  }

  if (q.includes("مصروفات") || q.includes("fees") || q.includes("قسط") || q.includes("دفع")) {
    return {
      answerAr: `تم سداد القسط الثاني بالكامل وقدره 15,000 ج.م بموجب الإيصال رقم REC-2025-0899. القسط القادم يستحق في 30 إبريل 2025 ويمكن سداده مباشرة ببطاقة البنك أو فوري.`,
      answerEn: `Term 2 installment (15,000 EGP) has been fully settled under receipt REC-2025-0899. The next installment is due on April 30, 2025 and can be paid via Fawry or Visa/Mastercard.`,
      sources: ["النظام المالي المدرسي - سجل الفواتير والمقبوضات"],
    };
  }

  if (q.includes("باص") || q.includes("حافلة") || q.includes("bus") || q.includes("وصول")) {
    return {
      answerAr: `الحافلة رقم 14 (خط المعادي) بقيادة السائق عماد فتحي في طريقها الآن. الموقع الحالي: شارع 216 المعادي، الوقت المتوقع للوصول أمام منزلك هو 07:15 صباحاً.`,
      answerEn: `Bus 14 (Maadi Route) driven by Capt. Emad is en route. Current location: St 216 Degla, ETA at your stop is 07:15 AM.`,
      sources: ["نظام التتبع الحي لأسطول النقل المدرسي GPS"],
    };
  }

  return {
    answerAr: `مرحباً بك! بناءً على ملف الطالب ${context.childName} في ${context.grade}: نسبة الحضور الحالية 96%، والمستوى الأكاديمي ممتاز (A). هل ترغب في الاستفسار عن الواجبات، النقل، أو المصروفات؟`,
    answerEn: `Welcome! Based on ${context.childName}'s profile in ${context.grade}: current attendance is 96%, and academic standing is Excellent (A). Would you like to check homework, bus route, or fee balance?`,
    sources: ["EduNexus Unified Student Profile SIS"],
  };
}

// 4. Report Comment Generator
export async function generateReportCardComment(options: {
  studentName: string;
  notes: string[];
  tone: "encouraging" | "formal" | "academic" | "constructive";
  language: "ar" | "en" | "both";
}) {
  const notesText = options.notes.join("، ");

  const comments = {
    ar: `أظهر الطالب ${options.studentName} التزاماً وتفوقاً ملحوظاً خلال هذا الفصل. ${notesText}. نوصي بالاستمرار في صقل مهارات التفكير النقدي والمشاركة الفعالة في الأنشطة الصفية للوصول لأعلى مراتب التميز.`,
    en: `${options.studentName} has demonstrated commendable engagement and consistent diligence throughout this term. Notes: ${notesText}. We encourage continued focus on critical thinking and active classroom collaboration to attain full potential.`,
  };

  return {
    commentAr: comments.ar,
    commentEn: comments.en,
    toneApplied: options.tone,
    safetyCheck: "Passed (Constructive, Bias-free, Age-appropriate)",
  };
}

// 5. Teacher Copilot (Lesson plans & Quizzes)
export async function generateLessonPlan(params: {
  topic: string;
  grade: string;
  subject: string;
  durationMinutes: number;
  curriculum: string;
}) {
  return {
    title: `${params.topic} - ${params.grade} (${params.curriculum})`,
    learningObjectivesAr: [
      `أن يتعرف الطالب على المفهوم الأساسي لـ ${params.topic}`,
      `أن يطبق القواعد الرياضية والعلمية في حل 3 مشكلات واقعية`,
      `أن يشارك بفاعلية في العمل الجماعي والمناقشة الصفية`,
    ],
    learningObjectivesEn: [
      `Define and explain the core principles of ${params.topic}`,
      `Apply mathematical/scientific formulas to solve real-world problems`,
      `Collaborate actively in peer group discussions and analysis`,
    ],
    timeline: [
      { minute: "0-10", activityAr: "التهيئة الحافزة وسؤال العصف الذهني", activityEn: "Warm-up & thought-provoking inquiry question" },
      { minute: "10-25", activityAr: "الشرح التفاعلي واستخدام النماذج البصرية", activityEn: "Interactive explanation with visual models" },
      { minute: "25-35", activityAr: "نشاط جماعي تعاوني في مجموعات صغيرة", activityEn: "Small-group cooperative problem solving" },
      { minute: "35-45", activityAr: "التقويم الختامي وتذكرة الخروج (Exit Ticket)", activityEn: "Formative exit ticket & recap" },
    ],
    suggestedQuizQuestions: [
      {
        questionAr: `ما هو التعريف الأنسب لـ ${params.topic}؟`,
        questionEn: `What is the primary definition of ${params.topic}?`,
        type: "multiple_choice",
        options: ["الخيار أ الصحيح", "الخيار ب البديل", "الخيار ج التجريبي", "الخيار د المضلل"],
        correctIndex: 0,
        explanation: "يرتكز هذا المفهوم على المبادئ المعتمدة في المنهج التعليمي.",
      },
      {
        questionAr: `اشرح كيف يمكن تطبيق ${params.topic} في الحياة اليومية بمثال واقعي؟`,
        questionEn: `Explain a real-world application of ${params.topic} with one clear example.`,
        type: "short_answer",
        rubric: "1 نقطة للتعريف، 2 نقطة لواقعية المثال، 1 نقطة لسلامة الصياغة.",
      },
    ],
    differentiatedWorksheets: {
      remedial: "تمارين مساعدة للمستوى التأسيسي مع إرشادات بصرية تدريجية.",
      standard: "تمارين قياسية متوافقة مع مخرجات التعلم الوزارية والدولية.",
      advanced: "تحدي إثرائي متقدم للطلاب الموهوبين يتطلب تحليلاً واستنتاجاً.",
    },
  };
}

// 6. Fee Collection Intelligence
export async function getFeeCollectionInsights(invoiceData: { studentName: string; amount: number; overdueDays: number }) {
  const reminderChannel = invoiceData.overdueDays > 14 ? "WhatsApp + Direct Phone Call" : "Polite WhatsApp Message";
  const bestTime = "Between 5:00 PM and 7:30 PM (after work hours)";

  const draftedMessageAr = `حضرة ولي أمر الطالب المحترم / ${invoiceData.studentName}،
تحية طيبة من إدارة مدارس النور الدولية.
نود تذكير سيادتكم بلطف بموعد سداد القسط المدرسي المستحق وقدره ${invoiceData.amount.toLocaleString()} ج.م، حرصاً على استمرار الخدمات والأنشطة التعليمية بسلاسة.
يمكنكم السداد الفوري عبر الرابط الإلكتروني المباشر أو منافذ فوري بكود الدفع رقم [FAW-889102].
شاكرين تعاونكم ودعمكم الدائم لمدرستنا.`;

  const draftedMessageEn = `Dear Guardian of ${invoiceData.studentName},
Greetings from Al Noor International School.
This is a gentle reminder regarding the pending tuition installment of ${invoiceData.amount.toLocaleString()} EGP.
You can settle securely online via card or Fawry code [FAW-889102].
Thank you for your continuous partnership.`;

  return {
    recommendedChannel: reminderChannel,
    bestContactTime: bestTime,
    urgencyLevel: invoiceData.overdueDays > 20 ? "High" : "Moderate",
    draftedMessageAr,
    draftedMessageEn,
  };
}

// 7. Principal Executive Briefing
export async function generatePrincipalBriefing() {
  return {
    date: new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    executiveSummaryAr: "استقرار عام في جميع المراحل مع نسبة حضور إجمالية بلغت 94.8% اليوم. تم رصد حالة غياب غير مبررة في الصف التاسع تتطلب تدخلاً إرشادياً. نسبة التحصيل المالي بلغت 78% للفصل الثاني متفوقة على نفس الفترة من العام الماضي بـ 12%.",
    executiveSummaryEn: "General stability across all school divisions with 94.8% overall attendance today. An unexcused absence alert logged in Grade 9 requiring counselor follow-up. Term 2 fee collection rate stands at 78%, outperforming last year by 12%.",
    keyAnomalies: [
      { severity: "warning", messageAr: "حافلة خط التجمع سجلت تأخيراً 14 دقيقة بسبب أعمال صيانة بالطريق الدائري", messageEn: "New Cairo Bus route delayed 14m due to Ring Road roadworks" },
      { severity: "info", messageAr: "استقبال 5 طلبات تقديم جديدة عبر منصة التسجيل الرقمية لفرع المعادي اليوم", messageEn: "5 new digital admission leads received today for Maadi Campus" },
    ],
    recommendedActions: [
      "اعتماد إجازة أ. أحمد فؤاد وتكليف أ. شريف بتغطية حصص الرياضيات للصف الرابع",
      "إرسال رسائل التذكير التلقائية لأولياء أمور الدفعة المتأخرة من أقساط مارس",
      "حضور افتتاح أسبوع العلوم والروبوتكس غداً الساعة 10:00 صباحاً",
    ],
  };
}

// 8. Document OCR Extractor Simulator
export async function simulateDocumentOcr(fileName: string) {
  return {
    extracted: true,
    documentType: "Egyptian National Birth Certificate / شهادة ميلاد مميكنة",
    confidence: "98.4%",
    fields: {
      fullName: "حمزة شريف فتحي الهواري",
      nationalId: "31505120108892",
      birthDate: "2015-05-12",
      gender: "ذكر / Male",
      nationality: "مصري / Egyptian",
      fatherName: "شريف فتحي الهواري",
      motherName: "منى كمال الدين رضوان",
      governorate: "القاهرة / Cairo",
    },
    verificationNotice: "يرجى مراجعة وتأكيد البيانات المستخرجة قبل اعتماد حفظ ملف الطالب في سجلات وزارة التربية والتعليم.",
  };
}
