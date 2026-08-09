import React, { useState } from 'react';
import { Transaction, TransactionType, Client } from '../types';
import { ArrowUpRight, ArrowDownLeft, Download, X, Calendar, Tag, User, Building2, Phone, FileText, Banknote, StickyNote, Info, TrendingUp, TrendingDown, Filter, Layers, ChevronLeft, Printer } from 'lucide-react';
import { PdfReportModal } from './PdfReportModal';

interface Props {
  transactions: Transaction[];
  clients: Client[];
}

const MONTH_NAMES_AR: Record<string, string> = {
  '01': 'يناير',
  '02': 'فبراير',
  '03': 'مارس',
  '04': 'أبريل',
  '05': 'مايو',
  '06': 'يونيو',
  '07': 'يوليو',
  '08': 'أغسطس',
  '09': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر'
};

const getArabicMonthLabel = (ym: string) => {
  if (ym === 'all') return 'جميع الأشهر';
  const [year, month] = ym.split('-');
  return `${MONTH_NAMES_AR[month] || month} ${year}`;
};

const TransactionList: React.FC<Props> = ({ transactions, clients }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Extract available unique months from transactions (formatted YYYY-MM)
  const availableMonths = Array.from(
    new Set(transactions.map(t => t.date.substring(0, 7)))
  ).sort((a, b) => b.localeCompare(a)); // Sort descending (latest first)

  // Filter transactions by selected month
  const filteredTransactions = selectedMonth === 'all'
    ? transactions
    : transactions.filter(t => t.date.startsWith(selectedMonth));

  // Compute stats for a given month
  const getMonthStats = (monthKey: string) => {
    const list = monthKey === 'all' 
      ? transactions 
      : transactions.filter(t => t.date.startsWith(monthKey));
    
    const income = list.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = list.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance, count: list.length };
  };

  const currentStats = getMonthStats(selectedMonth);

  // Compute comparative stats with previous month if a specific month is selected
  let prevMonthKey: string | null = null;
  if (selectedMonth !== 'all') {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex !== -1 && currentIndex < availableMonths.length - 1) {
      prevMonthKey = availableMonths[currentIndex + 1];
    }
  }

  const prevStats = prevMonthKey ? getMonthStats(prevMonthKey) : null;

  // Percentage changes
  const calcChange = (curr: number, prev: number) => {
    if (!prev || prev === 0) return null;
    return ((curr - prev) / prev) * 100;
  };

  const incomeChange = prevStats ? calcChange(currentStats.income, prevStats.income) : null;
  const expenseChange = prevStats ? calcChange(currentStats.expense, prevStats.expense) : null;

  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    // Define headers
    const headers = ['ID', 'الوصف', 'المبلغ', 'العملة', 'سعر الصرف', 'النوع', 'الفئة', 'الأيقونة النوبية', 'التاريخ', 'بواسطة', 'ملاحظات', 'العميل'];
    
    // Map data to rows
    const csvContent = filteredTransactions.map(t => {
      const clientName = t.clientId ? clients.find(c => c.id === t.clientId)?.name : '';
      return [
        t.id,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
        t.amount,
        t.currency,
        t.exchangeRate || '',
        t.type === TransactionType.INCOME ? 'دخل' : 'صرف',
        t.category,
        t.nubianIcon || '',
        t.date,
        t.createdBy,
        `"${(t.notes || '').replace(/"/g, '""')}"`,
        `"${(clientName || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    // Add headers to the beginning
    csvContent.unshift(headers.join(','));

    // Join all rows with newlines
    const csvString = csvContent.join('\n');

    // Create a Blob with BOM for Arabic support in Excel
    const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `amenirdis_transactions_${selectedMonth}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getClient = (id?: string) => clients.find(c => c.id === id);

  return (
    <>
      {/* Month Selection & Comparative Analytics Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
              <Calendar className="text-[#d97706]" size={22} />
              تصفح السجلات ومقارنة الأشهر
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              تابع حركة الأموال ومستوى نمو الثروة شهر بشهر عبر الزمن
            </p>
          </div>

          {/* Month Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-xl">
            <button
              onClick={() => setSelectedMonth('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMonth === 'all'
                  ? 'bg-[#d97706] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              جميع الأشهر
            </button>
            {availableMonths.map(ym => (
              <button
                key={ym}
                onClick={() => setSelectedMonth(ym)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedMonth === ym
                    ? 'bg-[#d97706] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {getArabicMonthLabel(ym)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Month Summary & MoM Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Income Card */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-emerald-800">إجمالي الواردات (الدخل)</span>
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg"><ArrowUpRight size={16} /></span>
            </div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {currentStats.income.toLocaleString()} <span className="text-sm font-normal text-emerald-700">EGP</span>
            </div>
            {prevStats && incomeChange !== null && (
              <div className="mt-2 text-[11px] font-semibold flex items-center gap-1">
                {incomeChange >= 0 ? (
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <TrendingUp size={12} /> +{incomeChange.toFixed(1)}% مقارنة بـ {getArabicMonthLabel(prevMonthKey!)}
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-0.5">
                    <TrendingDown size={12} /> {incomeChange.toFixed(1)}% مقارنة بـ {getArabicMonthLabel(prevMonthKey!)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Expense Card */}
          <div className="bg-red-50/60 border border-red-100 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-red-800">إجمالي المصروفات</span>
              <span className="p-1.5 bg-red-100 text-red-700 rounded-lg"><ArrowDownLeft size={16} /></span>
            </div>
            <div className="text-2xl font-bold text-red-900 mt-1">
              {currentStats.expense.toLocaleString()} <span className="text-sm font-normal text-red-700">EGP</span>
            </div>
            {prevStats && expenseChange !== null && (
              <div className="mt-2 text-[11px] font-semibold flex items-center gap-1">
                {expenseChange <= 0 ? (
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <TrendingDown size={12} /> {expenseChange.toFixed(1)}% انخفاض عن {getArabicMonthLabel(prevMonthKey!)}
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-0.5">
                    <TrendingUp size={12} /> +{expenseChange.toFixed(1)}% زيادة عن {getArabicMonthLabel(prevMonthKey!)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Net Balance Card */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-amber-900">صافي التدفق للفترة</span>
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg"><Layers size={16} /></span>
            </div>
            <div className={`text-2xl font-bold mt-1 ${currentStats.balance >= 0 ? 'text-amber-900' : 'text-red-700'}`}>
              {currentStats.balance >= 0 ? '+' : ''}{currentStats.balance.toLocaleString()} <span className="text-sm font-normal text-amber-800">EGP</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-800 font-medium">
              عدد السجلات: <span className="font-bold">{currentStats.count} معاملة</span>
            </div>
          </div>
        </div>

        {/* Timeline Bar Comparison */}
        {availableMonths.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1">
              <Filter size={12} /> مقارنة سريعة بين كافة الأشهر المتاحة:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableMonths.map(ym => {
                const s = getMonthStats(ym);
                const isSel = selectedMonth === ym;
                return (
                  <div
                    key={ym}
                    onClick={() => setSelectedMonth(ym)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSel
                        ? 'bg-amber-100/90 border-[#d97706] ring-1 ring-[#d97706]'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-neutral-800">{getArabicMonthLabel(ym)}</div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                      <span className="text-emerald-600 font-semibold">+{s.income.toLocaleString()}</span>
                      <span className="text-red-600 font-semibold">-{s.expense.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-700">أرشيف المعاملات</h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {getArabicMonthLabel(selectedMonth)} ({filteredTransactions.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
              title="تصدير تقرير PDF منسق بأسلوب التراث النوبي"
            >
              <FileText size={16} />
              <span>تصدير تقرير PDF</span>
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:text-[#d97706] hover:border-[#d97706] transition-colors shadow-sm"
              title="تحميل كملف CSV"
            >
              <Download size={16} />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-neutral-50 text-neutral-600 font-medium text-xs">
              <tr>
                <th className="p-4">النوع</th>
                <th className="p-4">الوصف</th>
                <th className="p-4">الفئة والأيقونة النوبية</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">بواسطة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTransactions.map((t) => (
                <tr 
                    key={t.id} 
                    onClick={() => setSelectedTransaction(t)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                      {t.type === TransactionType.INCOME ? (
                          <span className="flex items-center gap-1 text-green-600 bg-green-50 w-fit px-2 py-1 rounded text-xs font-bold">
                              <ArrowUpRight size={14} /> دخل
                          </span>
                      ) : (
                          <span className="flex items-center gap-1 text-red-600 bg-red-50 w-fit px-2 py-1 rounded text-xs font-bold">
                              <ArrowDownLeft size={14} /> صرف
                          </span>
                      )}
                  </td>
                  <td className="p-4 font-medium text-gray-800 group-hover:text-[#d97706] transition-colors">
                      {t.description}
                      {t.clientId && (
                          <span className="block text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Building2 size={10} /> {getClient(t.clientId)?.name}
                          </span>
                      )}
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-xs">
                      {t.nubianIcon && <span className="text-base leading-none">{t.nubianIcon}</span>}
                      <span>{t.category}</span>
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{t.date}</td>
                  <td className={`p-4 font-bold dir-ltr text-right ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{t.amount.toLocaleString()} {t.currency}
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{t.createdBy}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                  <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                          لا توجد سجلات لـ {getArabicMonthLabel(selectedMonth)} في البردية بعد.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#d97706] animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
             
             {/* Header */}
             <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                <h3 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
                    <FileText className="text-[#d97706]" />
                    تفاصيل السجل
                </h3>
                <button 
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                >
                    <X size={24} />
                </button>
             </div>

             {/* Content */}
             <div className="p-6 space-y-6 overflow-y-auto">
                
                {/* Main Amount Info */}
                <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-dashed border-gray-300">
                    <span className="text-gray-500 text-sm mb-1">المبلغ الإجمالي</span>
                    <span className={`text-4xl font-bold ${selectedTransaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedTransaction.type === TransactionType.INCOME ? '+' : '-'}{selectedTransaction.amount.toLocaleString()} <span className="text-xl text-gray-400">{selectedTransaction.currency}</span>
                    </span>
                    <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${selectedTransaction.type === TransactionType.INCOME ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedTransaction.type === TransactionType.INCOME ? 'واردات (دخل)' : 'مصروفات (خروج)'}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-gray-100 hover:border-[#d97706]/30 transition-colors">
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <Tag size={12} /> الفئة والأيقونة
                        </div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {selectedTransaction.nubianIcon && (
                            <span className="text-xl bg-amber-50 p-1 rounded border border-amber-200 leading-none">
                              {selectedTransaction.nubianIcon}
                            </span>
                          )}
                          <span>{selectedTransaction.category}</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-100 hover:border-[#d97706]/30 transition-colors">
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <Calendar size={12} /> التاريخ
                        </div>
                        <div className="font-semibold text-gray-800">{selectedTransaction.date}</div>
                    </div>
                    
                    {selectedTransaction.exchangeRate && (
                        <div className="p-3 rounded-lg border border-gray-100 hover:border-[#d97706]/30 transition-colors col-span-2">
                             <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                <Banknote size={12} /> سعر الصرف (وقت المعاملة)
                            </div>
                            <div className="font-semibold text-gray-800 dir-ltr text-right">{selectedTransaction.exchangeRate} / USD</div>
                        </div>
                    )}

                     <div className="col-span-2 p-3 rounded-lg border border-gray-100 hover:border-[#d97706]/30 transition-colors">
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <FileText size={12} /> الوصف
                        </div>
                        <div className="font-semibold text-gray-800">{selectedTransaction.description}</div>
                    </div>

                    {selectedTransaction.notes && (
                         <div className="col-span-2 p-3 rounded-lg border border-gray-100 bg-amber-50/20 hover:border-[#d97706]/30 transition-colors">
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                <StickyNote size={12} /> ملاحظات
                            </div>
                            <div className="text-gray-700 text-sm whitespace-pre-wrap">{selectedTransaction.notes}</div>
                        </div>
                    )}
                </div>

                {/* Client / User Info */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    {selectedTransaction.clientId && (
                        <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <div className="bg-[#d97706] p-2 rounded-full text-white mt-1">
                                <Building2 size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-neutral-800">
                                    {getClient(selectedTransaction.clientId)?.name || 'عميل غير معروف'}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    <p className="text-xs text-gray-600">
                                        <span className="font-semibold">جهة التعامل:</span> {
                                            getClient(selectedTransaction.clientId)?.type === 'vendor' ? 'مورد' :
                                            getClient(selectedTransaction.clientId)?.type === 'beneficiary' ? 'مستفيد' : 'عميل'
                                        }
                                    </p>
                                    {getClient(selectedTransaction.clientId)?.contactInfo && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Phone size={10} /> {getClient(selectedTransaction.clientId)?.contactInfo}
                                        </div>
                                    )}
                                </div>
                                {getClient(selectedTransaction.clientId)?.notes && (
                                    <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-amber-200/50 italic flex items-start gap-1">
                                         <Info size={10} className="mt-0.5" />
                                         {getClient(selectedTransaction.clientId)?.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-400 px-2">
                        <div className="flex items-center gap-1">
                            <User size={12} />
                            <span>سُجل بواسطة: <span className="text-gray-600 font-medium">{selectedTransaction.createdBy}</span></span>
                        </div>
                        <div>
                            ID: #{selectedTransaction.id}
                        </div>
                    </div>
                </div>

             </div>
           </div>
        </div>
      )}

      {/* Nubian PDF Report Export Modal */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        transactions={filteredTransactions}
        clients={clients}
        monthLabel={getArabicMonthLabel(selectedMonth)}
      />
    </>
  );
};

export default TransactionList;