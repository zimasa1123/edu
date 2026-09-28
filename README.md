# EduNexus — K-12 School CRM & ERP with Embedded AI

> Built for private K-12 schools in Egypt, Jordan, and the Arab world. Delivered with real PostgreSQL database schema, Drizzle ORM, multi-role RBAC, Arabic-first i18n, and an embedded provider-agnostic AI layer.

---

## 🌟 Key Differentiators Built & Working

1. **Digital Student Passport (`EGP-NOOR-STU-***`)**:
   - Transfer-ready student identity passport with QR code verification, cumulative GPA, medical allergies, and civil registry data.
2. **Live Campus Pulse**:
   - Real-time ticker tracking GPS fleet status (buses en route), clinic emergency visits, student attendance rates, and security status.
3. **Owner's Strategic What-If Simulator**:
   - Interactive sliders for tuition fees, student capacity, teacher headcount, and salaries with real-time operating margin projections and AI financial recommendations.
4. **Command Palette (`Ctrl+K`) with Natural Language AI Queries**:
   - Safe, validated query builder (e.g. *"students absent 3 days with overdue fees"*). Never runs raw SQL from models.
5. **Smart Substitute Teacher Matcher**:
   - Automatically identifies absent staff and recommends qualified substitutes with schedule availability and curriculum alignment.
6. **Parent AI Assistant (Arabic-First Chatbot)**:
   - Dedicated chatbot answering questions regarding attendance, bus routes, homework, and tuition payments from the student's authorized records only.
7. **Offline-Tolerant Attendance**:
   - One-tap mobile roll call with local cache toggle and automated guardian WhatsApp/SMS notification triggers.

---

## 👥 Seeded Demo Personas (One-Click Role Switcher)

Switch persona anytime from the top bar:
- **Principal**: `د. طارق المنشاوي` (`principal@edunexus.demo`)
- **School Owner**: `الحاج عصام نور الدين` (`owner@edunexus.demo`)
- **Registrar & Admissions**: `أ. نورهان صادق` (`registrar@edunexus.demo`)
- **Chief Accountant**: `أ. مجدي عبد الفتاح` (`accountant@edunexus.demo`)
- **Lead Math Teacher**: `أ. أحمد فؤاد` (`teacher.math@edunexus.demo`)
- **School Counselor**: `د. سلمى عبد العزيز` (`counselor@edunexus.demo`)
- **Clinic Nurse**: `م. هالة الشامي` (`nurse@edunexus.demo`)
- **Transport Manager**: `كابتن محمود الباز` (`transport@edunexus.demo`)
- **Parent**: `م. حازم الكيلاني` (`parent.youssef@edunexus.demo`)
- **Student**: `يوسف حازم الكيلاني` (`student.youssef@edunexus.demo`)

---

## 🤖 AI Service Layer (`src/lib/ai/index.ts`)

- Fully **provider-agnostic** (OpenAI / Anthropic / Local).
- Clearly labeled **MOCK mode** when no API key exists, delivering deterministic educational responses across 15 tools:
  1. Natural Language Command Center
  2. Student Early-Warning Radar
  3. Parent AI Assistant Chatbot
  4. Report Card Comment Generator
  5. Teacher Copilot (Lesson plans & Quizzes)
  6. Assisted Essay Grading
  7. Student Study Helper
  8. Fee Collection Intelligence & WhatsApp Reminders
  9. Smart Timetable Optimizer
  10. Admissions CRM Lead Scoring
  11. Document OCR Extractor Simulator
  12. Principal Executive Briefing
  13. Sentiment & Complaint Triage
  14. Knowledge Base RAG
  15. Instant Educational Translation (AR ↔ EN)

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript (Strict)
- **Styling**: Tailwind CSS, Cairo & Inter typography, RTL / LTR layout
- **Database**: PostgreSQL with Drizzle ORM
- **Icons**: Lucide Icons
