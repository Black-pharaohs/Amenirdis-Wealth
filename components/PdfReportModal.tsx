import React from 'react';
import { Transaction, TransactionType, Client } from '../types';
import { Printer, X, Download, ShieldCheck, Sparkles, Calendar, ArrowUpRight, ArrowDownLeft, Layers } from 'lucide-react';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  clients: Client[];
  monthLabel: string;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  clients,
  monthLabel,
}) => {
  if (!isOpen) return null;

  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Group by categories
  const categorySummary = transactions.reduce<Record<string, { income: number; expense: number; count: number; icon?: string }>>((acc, t) => {
    const cat = t.category || 'عام';
    if (!acc[cat]) {
      acc[cat] = { income: 0, expense: 0, count: 0, icon: t.nubianIcon };
    }
    if (t.type === TransactionType.INCOME) {
      acc[cat].income += t.amount;
    } else {
      acc[cat].expense += t.amount;
    }
    acc[cat].count += 1;
    if (t.nubianIcon) acc[cat].icon = t.nubianIcon;
    return acc;
  }, {});

  const handlePrint = () => {
    const printContent = document.getElementById('nubian-pdf-report-container');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة التقرير.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>بردية_التقرير_المالي_أماني_ريديس_${monthLabel.replace(/\s+/g, '_')}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');
            body {
              font-family: 'Cairo', sans-serif;
              background-color: #ffffff;
              color: #1f2937;
              padding: 20px;
            }
            @media print {
              body {
                padding: 0;
                background-color: white;
              }
              .no-print {
                display: none !important;
              }
            }
            .papyrus-border {
              border: 3px double #d97706;
              outline: 1px solid #b45309;
              outline-offset: -6px;
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500)">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-amber-50/90 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 flex justify-between items-center shrink-0 border-b-2 border-amber-500">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-300" size={20} />
            <h2 className="font-bold text-lg">معاينة بردية التقرير المالي (تصدير PDF)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer size={16} /> طباعة / حفظ PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-amber-800/80 rounded-lg text-amber-200 transition-colors"
              title="إغلاق"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 text-right">
          <div
            id="nubian-pdf-report-container"
            className="bg-[#fdfaf3] p-8 rounded-xl papyrus-border shadow-inner text-neutral-900 relative"
          >
            {/* Top Hieroglyphic Decorative Banner */}
            <div className="flex justify-between items-center border-b-2 border-amber-600/40 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-[#b45309]">
                  <span className="text-3xl leading-none">𓋹</span>
                  <h1 className="text-2xl font-black tracking-wide text-amber-950">
                    خزانة الملكة أماني ريديس
                  </h1>
                  <span className="text-3xl leading-none">𓎛</span>
                </div>
                <p className="text-xs font-semibold text-amber-800 mt-1">
                  السجل المالي الرسمي والبردية الموثقة للمملكة النوبية
                </p>
              </div>

              <div className="text-left text-xs text-amber-900/80 font-semibold space-y-1">
                <div>رقم التقرير: <span className="font-mono text-neutral-900">#AMN-{Date.now().toString().slice(-6)}</span></div>
                <div>تاريخ الإصدار: <span className="text-neutral-900">{new Date().toLocaleDateString('ar-EG')}</span></div>
                <div className="text-amber-700 font-bold">الفترة: {monthLabel}</div>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-800 block mb-1">𓏎 إجمالي الدخل والواردات</span>
                <span className="text-xl font-extrabold text-emerald-900 dir-ltr inline-block">
                  +{totalIncome.toLocaleString()} EGP
                </span>
              </div>

              <div className="p-4 bg-red-50/80 border border-red-300 rounded-xl text-center">
                <span className="text-xs font-bold text-red-800 block mb-1">𓉐 إجمالي المصروفات والنفقات</span>
                <span className="text-xl font-extrabold text-red-900 dir-ltr inline-block">
                  -{totalExpense.toLocaleString()} EGP
                </span>
              </div>

              <div className="p-4 bg-amber-100/80 border border-amber-400 rounded-xl text-center">
                <span className="text-xs font-bold text-amber-900 block mb-1">𓋴 صافي الرصيد والميزانية</span>
                <span className={`text-xl font-extrabold dir-ltr inline-block ${netBalance >= 0 ? 'text-amber-950' : 'text-red-700'}`}>
                  {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()} EGP
                </span>
              </div>
            </div>

            {/* Category Summary Breakdown Table */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-amber-950 mb-3 flex items-center gap-1.5 border-b border-amber-200 pb-1">
                <span>𓇳</span> ملخص توزيع الفئات
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {Object.entries(categorySummary).map(([cat, val]) => (
                  <div key={cat} className="p-2.5 bg-white/80 border border-amber-200 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg leading-none">{val.icon || '𓋹'}</span>
                      <span className="font-bold text-neutral-800">{cat}</span>
                    </div>
                    <div className="text-left font-mono">
                      {val.income > 0 && <span className="text-emerald-700 font-bold block">+{val.income.toLocaleString()}</span>}
                      {val.expense > 0 && <span className="text-red-600 font-bold block">-{val.expense.toLocaleString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Transactions Table */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-amber-950 mb-3 flex items-center gap-1.5 border-b border-amber-200 pb-1">
                <span>𓈗</span> تفاصيل المعاملات المسجلة ({transactions.length})
              </h3>
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-amber-200/60 text-amber-950 font-bold border-b border-amber-300">
                    <th className="p-2">التاريخ</th>
                    <th className="p-2">الوصف</th>
                    <th className="p-2">الفئة</th>
                    <th className="p-2">النوع</th>
                    <th className="p-2 text-left">المبلغ (EGP)</th>
                    <th className="p-2">المحرر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-amber-100/30">
                      <td className="p-2 text-gray-700 whitespace-nowrap">{t.date}</td>
                      <td className="p-2 font-semibold text-neutral-900">{t.description}</td>
                      <td className="p-2 text-gray-800">
                        <span className="inline-flex items-center gap-1">
                          {t.nubianIcon && <span>{t.nubianIcon}</span>}
                          <span>{t.category}</span>
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {t.type === TransactionType.INCOME ? 'دخل' : 'صرف'}
                        </span>
                      </td>
                      <td className={`p-2 text-left font-bold dir-ltr whitespace-nowrap ${
                        t.type === TransactionType.INCOME ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}{t.amount.toLocaleString()} {t.currency}
                      </td>
                      <td className="p-2 text-gray-600">{t.createdBy}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                        لا توجد معاملات مسجلة في هذه البردية.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Nubian Kingdom Seal Footer */}
            <div className="pt-6 border-t-2 border-amber-600/40 flex justify-between items-center text-xs text-amber-900">
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck size={16} className="text-amber-700" />
                  موثق بحتم خزانة الملكة أماني ريديس
                </div>
                <div className="text-amber-800 text-[11px]">
                  جميع البيانات المالية محمية ببروتوكولات التشفير الحديثة والدقة الفرعونية.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-amber-700 bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-xs text-center shadow-sm p-1 leading-tight">
                  𓋹<br/>ختم نوبي
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
