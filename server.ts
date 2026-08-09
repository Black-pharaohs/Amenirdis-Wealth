import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Server-side Gemini API route for Financial Advice
app.post("/api/financial-advice", async (req, res) => {
  try {
    const { transactions } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.json({
        advice: "يرجى إضافة مفتاح Gemini API في إعدادات البيئة (GEMINI_API_KEY) لتفعيل نصائح الحكيم الذكي.",
      });
    }

    const summary = (transactions || [])
      .slice(0, 10)
      .map(
        (t: any) =>
          `- ${t.type === "income" ? "دخل" : "مصروف"}: ${t.description} (${t.amount} ${t.currency})`
      )
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `بصفتك مستشاراً مالياً حكيماً يمتلك حكمة الفراعنة القدماء، قم بتحليل هذه المعاملات المالية وقدم نصيحة موجزة وقوية باللغة العربية لإدارة الثروة بشكل أفضل:
      
      ${summary}
      
      اجعل النصيحة قصيرة (أقل من 50 كلمة) ومستوحاة من أسلوب الكتابة القديم ولكن عملية.`,
    });

    return res.json({
      advice: response.text || "لا توجد نصيحة متاحة حالياً.",
    });
  } catch (error: any) {
    console.error("Gemini Server Error:", error?.message || error);
    return res.json({
      advice: "ميزة الذكاء الاصطناعي تحتاج إلى مفتاح Gemini API صالح (GEMINI_API_KEY).",
    });
  }
});

// Server-side Gemini API route for Currency Insights
app.post("/api/currency-insights", async (req, res) => {
  try {
    const { baseCurrency } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.json({ insight: "" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `أعطني تحليلاً سريعاً جداً وتوقعاً بسيطاً لسوق العملات اليوم بالنسبة لـ ${baseCurrency}. باللغة العربية.`,
    });

    return res.json({
      insight: response.text || "",
    });
  } catch (error: any) {
    console.error("Gemini Currency Insight Error:", error?.message || error);
    return res.json({ insight: "" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
