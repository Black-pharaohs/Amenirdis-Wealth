import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  try {
    const response = await fetch("/api/financial-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data.advice || "لا توجد نصيحة متاحة حالياً.";
  } catch (error) {
    console.error("Financial Advice Error:", error);
    return "حدث خطأ أثناء استشارة الحكيم الإلكتروني.";
  }
};

export const getCurrencyInsights = async (baseCurrency: string): Promise<string> => {
  try {
    const response = await fetch("/api/currency-insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ baseCurrency }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data.insight || "";
  } catch (error) {
    console.error("Currency Insights Error:", error);
    return "";
  }
};
