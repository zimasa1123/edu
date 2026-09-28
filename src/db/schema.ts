import { pgTable, text, serial, timestamp, integer, boolean, numeric, jsonb, date, varchar } from "drizzle-orm/pg-core";

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  country: varchar("country", { length: 50 }).default("Egypt").notNull(), // Egypt, Jordan, UAE, KSA
  currency: varchar("currency", { length: 10 }).default("EGP").notNull(), // EGP, JOD, USD, SAR
  taxNumber: varchar("tax_number", { length: 100 }),
  logoUrl: text("logo_url"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 255 }),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  principalName: varchar("principal_name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const academicYears = pgTable("academic_years", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  name: varchar("name", { length: 50 }).notNull(), // e.g. "2024 - 2025"
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isCurrent: boolean("is_current").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  academicYearId: integer("academic_year_id").references(() => academicYears.id),
  name: varchar("name", { length: 50 }).notNull(), // "Term 1", "Term 2"
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isCurrent: boolean("is_current").default(false).notNull(),
});

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  stage: varchar("stage", { length: 50 }).notNull(), // KG, Primary, Prep, Secondary
  curriculum: varchar("curriculum", { length: 50 }).default("Egyptian National").notNull(), // Egyptian National, American, British, IB, Jordanian
  orderIndex: integer("order_index").default(1).notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  gradeId: integer("grade_id").references(() => grades.id),
  branchId: integer("branch_id").references(() => branches.id),
  name: varchar("name", { length: 50 }).notNull(), // "A", "B", "1/1"
  roomNumber: varchar("room_number", { length: 50 }),
  capacity: integer("capacity").default(25).notNull(),
  gender: varchar("gender", { length: 20 }).default("Mixed").notNull(), // Boys, Girls, Mixed
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  branchId: integer("branch_id").references(() => branches.id),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullNameAr: text("full_name_ar").notNull(),
  fullNameEn: text("full_name_en").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // super_admin, school_owner, principal, vice_principal, registrar, accountant, hr_manager, teacher, class_coordinator, counselor, nurse, transport_manager, librarian, parent, student
  phone: varchar("phone", { length: 50 }),
  nationalId: varchar("national_id", { length: 50 }),
  avatarUrl: text("avatar_url"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guardians = pgTable("guardians", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  relationship: varchar("relationship", { length: 50 }).notNull(), // Father, Mother, Guardian
  profession: varchar("profession", { length: 100 }),
  workplace: text("workplace"),
  emergencyPhone: varchar("emergency_phone", { length: 50 }),
  engagementScore: integer("engagement_score").default(85), // 0-100
  whatsappEnabled: boolean("whatsapp_enabled").default(true),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("ar"),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  branchId: integer("branch_id").references(() => branches.id),
  gradeId: integer("grade_id").references(() => grades.id),
  sectionId: integer("section_id").references(() => sections.id),
  studentCode: varchar("student_code", { length: 50 }).notNull().unique(),
  nationalId: varchar("national_id", { length: 50 }).notNull(),
  firstNameAr: text("first_name_ar").notNull(),
  lastNameAr: text("last_name_ar").notNull(),
  firstNameEn: text("first_name_en").notNull(),
  lastNameEn: text("last_name_en").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(), // Male, Female
  birthDate: date("birth_date").notNull(),
  nationality: varchar("nationality", { length: 50 }).default("Egyptian").notNull(),
  religion: varchar("religion", { length: 50 }).default("Muslim"),
  photoUrl: text("photo_url"),
  bloodGroup: varchar("blood_group", { length: 10 }),
  medicalNotes: text("medical_notes"),
  allergies: text("allergies"),
  specialNeedsIep: boolean("special_needs_iep").default(false),
  specialNeedsNotes: text("special_needs_notes"),
  previousSchool: text("previous_school"),
  status: varchar("status", { length: 30 }).default("enrolled").notNull(), // enrolled, transferred, graduated, suspended
  enrollmentDate: date("enrollment_date").notNull(),
  digitalPassportCode: varchar("digital_passport_code", { length: 50 }).unique(),
  riskScore: integer("risk_score").default(12), // 0 - 100
  riskFactors: jsonb("risk_factors").default([]),
  canteenWalletBalance: numeric("canteen_wallet_balance", { precision: 10, scale: 2 }).default("150.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentGuardians = pgTable("student_guardians", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  guardianId: integer("guardian_id").references(() => guardians.id).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  canPickup: boolean("can_pickup").default(true).notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  branchId: integer("branch_id").references(() => branches.id),
  studentName: text("student_name").notNull(),
  parentName: text("parent_name").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }),
  gradeInterested: varchar("grade_interested", { length: 50 }).notNull(),
  curriculumInterested: varchar("curriculum_interested", { length: 50 }).default("Egyptian National"),
  source: varchar("source", { length: 50 }).notNull(), // Website, WhatsApp, Referral, Facebook, Walk-in
  stage: varchar("stage", { length: 50 }).default("Inquiry").notNull(), // Inquiry, Tour Booked, Applied, Assessment, Interview, Accepted, Fee Paid, Enrolled, Rejected
  score: integer("score").default(60), // AI lead score
  aiNextAction: text("ai_next_action"),
  notes: text("notes"),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  gradeId: integer("grade_id").references(() => grades.id),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  creditHours: integer("credit_hours").default(3),
});

export const timetableSlots = pgTable("timetable_slots", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => sections.id).notNull(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(), // Sunday, Monday, Tuesday, Wednesday, Thursday
  periodNumber: integer("period_number").notNull(), // 1 through 7
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  room: varchar("room", { length: 50 }),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  sectionId: integer("section_id").references(() => sections.id),
  date: date("date").notNull(),
  periodNumber: integer("period_number").default(0), // 0 = full-day morning roll call
  status: varchar("status", { length: 20 }).notNull(), // present, late, absent, excused
  reason: text("reason"),
  recordedBy: integer("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staffAttendance = pgTable("staff_attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // present, late, absent, on_leave
  checkInTime: varchar("check_in_time", { length: 10 }),
  checkOutTime: varchar("check_out_time", { length: 10 }),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => sections.id).notNull(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  type: varchar("type", { length: 30 }).notNull(), // exam, quiz, homework, project
  maxScore: numeric("max_score", { precision: 5, scale: 2 }).default("100.00").notNull(),
  weight: integer("weight").default(20).notNull(),
  dueDate: date("due_date").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gradesResults = pgTable("grades_results", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").references(() => assessments.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  score: numeric("score", { precision: 5, scale: 2 }).notNull(),
  feedback: text("feedback"),
  aiGeneratedFeedback: text("ai_generated_feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feePlans = pgTable("fee_plans", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  gradeId: integer("grade_id").references(() => grades.id),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EGP").notNull(),
  installmentCount: integer("installment_count").default(3).notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  studentId: integer("student_id").references(() => students.id).notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  status: varchar("status", { length: 30 }).default("unpaid").notNull(), // paid, partial, unpaid, overdue
  dueDate: date("due_date").notNull(),
  currency: varchar("currency", { length: 10 }).default("EGP").notNull(),
  lateRiskPrediction: varchar("late_risk_prediction", { length: 20 }).default("Low"), // Low, Medium, High
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  receiptNumber: varchar("receipt_number", { length: 50 }).notNull().unique(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 30 }).notNull(), // cash, fawry, paymob, card, bank_transfer
  transactionRef: varchar("transaction_ref", { length: 100 }),
  notes: text("notes"),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  jobTitleAr: text("job_title_ar").notNull(),
  jobTitleEn: text("job_title_en").notNull(),
  department: varchar("department", { length: 50 }).notNull(),
  hireDate: date("hire_date").notNull(),
  basicSalary: numeric("basic_salary", { precision: 10, scale: 2 }).notNull(),
  allowance: numeric("allowance", { precision: 10, scale: 2 }).default("0.00"),
  contractType: varchar("contract_type", { length: 30 }).default("full_time"),
  status: varchar("status", { length: 30 }).default("active"),
});

export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  leaveType: varchar("leave_type", { length: 50 }).notNull(), // Sick, Annual, Emergency
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 30 }).default("pending").notNull(), // pending, approved, rejected
  substituteTeacherId: integer("substitute_teacher_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  sentiment: varchar("sentiment", { length: 20 }).default("neutral"), // positive, neutral, negative, urgent
  category: varchar("category", { length: 50 }).default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  branchId: integer("branch_id").references(() => branches.id),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en").notNull(),
  targetRole: varchar("target_role", { length: 50 }).default("all").notNull(),
  priority: varchar("priority", { length: 20 }).default("normal").notNull(), // low, normal, urgent
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  reporterId: integer("reporter_id").references(() => users.id).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Academics, Transport, Fees, Bullying, Facility
  title: text("title").notNull(),
  description: text("description").notNull(),
  urgency: varchar("urgency", { length: 20 }).default("medium").notNull(), // low, medium, high, critical
  status: varchar("status", { length: 30 }).default("open").notNull(), // open, in_progress, resolved, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  aiCategoryTriage: text("ai_category_triage"),
  slaDeadline: timestamp("sla_deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transportRoutes = pgTable("transport_routes", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branches.id),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  busPlateNumber: varchar("bus_plate_number", { length: 30 }).notNull(),
  driverName: varchar("driver_name", { length: 100 }).notNull(),
  driverPhone: varchar("driver_phone", { length: 50 }).notNull(),
  supervisorName: varchar("supervisor_name", { length: 100 }),
  capacity: integer("capacity").default(30).notNull(),
  currentStatus: varchar("current_status", { length: 50 }).default("idle"), // idle, morning_pickup, at_school, afternoon_drop, completed
  currentStopName: text("current_stop_name"),
  etaMinutes: integer("eta_minutes").default(0),
});

export const studentTransport = pgTable("student_transport", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  routeId: integer("route_id").references(() => transportRoutes.id).notNull(),
  stopName: text("stop_name").notNull(),
  pickupTime: varchar("pickup_time", { length: 10 }),
  dropoffTime: varchar("dropoff_time", { length: 10 }),
});

export const libraryBooks = pgTable("library_books", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: varchar("isbn", { length: 50 }),
  category: varchar("category", { length: 50 }).notNull(),
  totalCopies: integer("total_copies").default(5).notNull(),
  availableCopies: integer("available_copies").default(5).notNull(),
});

export const clinicVisits = pgTable("clinic_visits", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  nurseId: integer("nurse_id").references(() => users.id).notNull(),
  visitTime: timestamp("visit_time").defaultNow().notNull(),
  complaint: text("complaint").notNull(),
  temperature: varchar("temperature", { length: 10 }),
  treatmentGiven: text("treatment_given").notNull(),
  parentNotified: boolean("parent_notified").default(false).notNull(),
  sentHome: boolean("sent_home").default(false).notNull(),
});

export const behaviorIncidents = pgTable("behavior_incidents", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  recordedBy: integer("recorded_by").references(() => users.id).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // merit, positive, minor_violation, major_incident
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").default(0).notNull(), // +5, -10
  actionTaken: text("action_taken"),
  isConfidential: boolean("is_confidential").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const counselorCases = pgTable("counselor_cases", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  counselorId: integer("counselor_id").references(() => users.id).notNull(),
  caseTitle: text("case_title").notNull(),
  caseCategory: varchar("case_category", { length: 50 }).notNull(), // Academic, Emotional, Social, Family, Behavioral
  status: varchar("status", { length: 30 }).default("active").notNull(), // active, monitoring, resolved
  confidentialNotes: text("confidential_notes").notNull(),
  interventionPlan: text("intervention_plan"),
  nextFollowUpDate: date("next_follow_up_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiLogs = pgTable("ai_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  featureName: varchar("feature_name", { length: 100 }).notNull(),
  promptSummary: text("prompt_summary").notNull(),
  outputSummary: text("output_summary").notNull(),
  modelName: varchar("model_name", { length: 50 }).default("gpt-4o-mock"),
  feedback: varchar("feedback", { length: 20 }), // thumbs_up, thumbs_down
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 50 }).notNull(),
  entityId: integer("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
