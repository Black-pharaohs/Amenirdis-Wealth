import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Note: In a real production app, currency rates should come from a specialized financial API.
// We use Gemini here to interpret data or provide "estimated" advice based on context.

const getAiClient = () => {
    // Ideally use an environment variable. For this simulated output, we assume it's set.
    // If not set, we'll handle gracefully in the UI.
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.warn("API Key missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "عذراً، خدمة الذكاء الاصطناعي غير متوفرة حالياً (مفتاح API مفقود).";

    const summary = transactions.slice(0, 10).map(t => 
        `- ${t.type === 'income' ? 'دخل' : 'مصروف'}: ${t.description} (${t.amount} ${t.currency})`
    ).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `بصفتك مستشاراً مالياً حكيماً يمتلك حكمة الفراعنة القدماء، قم بتحليل هذه المعاملات المالية وقدم نصيحة موجزة وقوية باللغة العربية لإدارة الثروة بشكل أفضل:
            
            ${summary}
            
            اجعل النصيحة قصيرة (أقل من 50 كلمة) ومستوحاة من أسلوب الكتابة القديم ولكن عملية.`,
        });
        return response.text || "لا توجد نصيحة متاحة حالياً.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "حدث خطأ أثناء استشارة الحكيم الإلكتروني.";
    }
};

export const getCurrencyInsights = async (baseCurrency: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "";

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `أعطني تحليلاً سريعاً جداً وتوقعاً بسيطاً لسوق العملات اليوم بالنسبة لـ ${baseCurrency}. باللغة العربية.`,
        });
        return response.text || "";
    } catch (error) {
        return "";
    }
}