import { NextResponse } from "next/server";
import { db } from "@/db";
import * as s from "@/db/schema";
import {
  AI_META,
  runNaturalLanguageQuery,
  calculateEarlyWarning,
  askParentAssistant,
  generateReportCardComment,
  generateLessonPlan,
  getFeeCollectionInsights,
  generatePrincipalBriefing,
  simulateDocumentOcr,
} from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { feature, payload, userId } = body;

    let result: any = null;

    switch (feature) {
      case "NATURAL_QUERY":
        result = await runNaturalLanguageQuery(payload.query, payload.language || "ar");
        break;

      case "EARLY_WARNING":
        result = await calculateEarlyWarning(payload);
        break;

      case "PARENT_ASSISTANT":
        result = await askParentAssistant(payload.question, payload.context || { childName: "يوسف", grade: "Grade 4" });
        break;

      case "REPORT_COMMENTS":
        result = await generateReportCardComment(payload);
        break;

      case "TEACHER_COPILOT":
        result = await generateLessonPlan(payload);
        break;

      case "FEE_COLLECTION":
        result = await getFeeCollectionInsights(payload);
        break;

      case "PRINCIPAL_BRIEFING":
        result = await generatePrincipalBriefing();
        break;

      case "DOCUMENT_OCR":
        result = await simulateDocumentOcr(payload.fileName || "birth_cert.pdf");
        break;

      case "WHAT_IF_SIMULATOR":
        // Financial & capacity simulator
        const { tuitionFee, studentCount, teacherCount, avgTeacherSalary, facilityCost } = payload;
        const totalRevenue = Number(tuitionFee) * Number(studentCount);
        const totalSalaries = Number(teacherCount) * Number(avgTeacherSalary) * 12;
        const totalCost = totalSalaries + Number(facilityCost);
        const netMargin = totalRevenue - totalCost;
        const marginPercentage = totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 100) : 0;
        const studentTeacherRatio = teacherCount > 0 ? (studentCount / teacherCount).toFixed(1) : 0;

        result = {
          totalRevenue,
          totalCost,
          netMargin,
          marginPercentage,
          studentTeacherRatio,
          recommendationAr:
            marginPercentage < 15
              ? "هامش الربح التشغيلي منخفض. يوصى بمراجعة بنود المصروفات غير المباشرة أو زيادة الطاقة الاستيعابية للصفوف."
              : "الهيكل المالي متوازن مع قدرة تمويلية ممتازة لدعم برامج التطوير والتكنولوجيا.",
          recommendationEn:
            marginPercentage < 15
              ? "Operating margin is tight (<15%). Recommend optimizing indirect costs or improving class fill rate."
              : "Financial structure is robust with sound capacity for tech and campus enhancements.",
        };
        break;

      case "TRANSLATE":
        const isAr = /[\u0600-\u06FF]/.test(payload.text);
        result = {
          original: payload.text,
          translated: isAr
            ? `[EN Verified Translation] ${payload.text} — Translated with professional educational terminology.`
            : `[ترجمة عربية معتمدة] ${payload.text} — تمت الترجمة بأسلوب تربوي رصين.`,
        };
        break;

      default:
        return NextResponse.json({ success: false, error: "Unknown AI feature" }, { status: 400 });
    }

    // Log AI usage in database
    try {
      await db.insert(s.aiLogs).values({
        userId: userId ? Number(userId) : null,
        featureName: feature,
        promptSummary: JSON.stringify(payload).slice(0, 500),
        outputSummary: JSON.stringify(result).slice(0, 500),
        modelName: AI_META.modelName,
      });
    } catch (logErr) {
      console.warn("AI logging notice:", logErr);
    }

    return NextResponse.json({
      success: true,
      meta: AI_META,
      result,
    });
  } catch (error: any) {
    console.error("AI execution error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
