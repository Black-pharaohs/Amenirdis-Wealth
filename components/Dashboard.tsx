import React, { useEffect, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';
import { Wallet, TrendingUp, TrendingDown, Sparkles, AlertTriangle, AlertCircle, CheckCircle2, Bell, Edit3, Save } from 'lucide-react';
import { useToast } from './ToastContext';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const { showToast } = useToast();
  const [advice, setAdvice] = useState<string>('جاري استشارة الحكيم...');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Budget state
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem('amenirdis_monthly_budget');
    return saved ? Number(saved) : 15000;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState<string>(monthlyBudget.toString());

  const handleSaveBudget = () => {
    const num = parseFloat(tempBudgetInput);
    if (!isNaN(num) && num > 0) {
      setMonthlyBudget(num);
      localStorage.setItem('amenirdis_monthly_budget', num.toString());
      showToast(
        'تم تحديث سقف الميزانية الملكية',
        `السقف الجديد للمصروفات الشهرية: ${num.toLocaleString()} EGP`,
        'success',
        '𓋴'
      );
    }
    setIsEditingBudget(false);
  };

  // Calculate Totals
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Budget calculations
  const budgetUsagePercent = monthlyBudget > 0 ? (totalExpense / monthlyBudget) * 100 : 0;
  const isOverBudget = totalExpense > monthlyBudget;
  const isNearBudget = budgetUsagePercent >= 85 && !isOverBudget;

  // Prepare Chart Data
  const data = transactions.map(t => ({
    name: t.date,
    amount: t.type === TransactionType.INCOME ? t.amount : -t.amount,
    type: t.type === TransactionType.INCOME ? 'دخل' : 'صرف'
  }));

  // Prepare Expense Categories Data for Pie Chart
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const expensesByCategory = expenseTransactions.reduce<Record<string, number>>((acc, t) => {
    const category = t.category?.trim() || 'أخرى';
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {});

  const categoryPieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const CATEGORY_COLORS = ['#d97706', '#1e3a8a', '#dc2626', '#059669', '#7c3aed', '#db2777', '#ea580c', '#0284c7'];

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const result = await getFinancialAdvice(transactions);
      setAdvice(result);
      setLoadingAdvice(false);
    };
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]); // Only re-fetch if transactions change

  // Trigger Toast Notification on budget status
  useEffect(() => {
    if (isOverBudget) {
      showToast(
        'تنبيه حرج: تجاوز سقف الميزانية!',
        `المصروفات الحالية (${totalExpense.toLocaleString()} EGP) تجاوزت السقف المحدد (${monthlyBudget.toLocaleString()} EGP).`,
        'danger',
        '𓃭'
      );
    } else if (isNearBudget) {
      showToast(
        'تحذير: اقتراب من حد الميزانية',
        `وصلت المصروفات إلى ${budgetUsagePercent.toFixed(1)}% من الميزانية المحددة.`,
        'warning',
        '𓃭'
      );
    }
  }, [isOverBudget, isNearBudget, monthlyBudget, totalExpense]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-neutral-800">نظرة عامة على المملكة</h2>
           <p className="text-gray-600">ملخص الثروة والتحركات المالية</p>
        </div>
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 max-w-md shadow-sm">
            <div className="flex items-center gap-2 mb-1 text-amber-800 font-bold">
                <Sparkles size={16} />
                <span>نصيحة الحكيم</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed min-h-[40px]">
                {loadingAdvice ? 'يفكر...' : advice}
            </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-900 flex items-center justify-between">
            <div>
                <p className="text-gray-500 mb-1">صافي الثروة</p>
                <h3 className="text-3xl font-bold text-blue-900">{balance.toLocaleString()} EGP</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-900">
                <Wallet size={32} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500 flex items-center justify-between">
            <div>
                <p className="text-gray-500 mb-1">إجمالي الدخل</p>
                <h3 className="text-3xl font-bold text-green-600">+{totalIncome.toLocaleString()} EGP</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-green-600">
                <TrendingUp size={32} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-500 flex items-center justify-between">
            <div>
                <p className="text-gray-500 mb-1">إجمالي المصروفات</p>
                <h3 className="text-3xl font-bold text-red-600">-{totalExpense.toLocaleString()} EGP</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full text-red-600">
                <TrendingDown size={32} />
            </div>
        </div>
      </div>

      {/* Monthly Budget & Alerts Section */}
      <div className={`p-6 rounded-2xl shadow-sm border transition-all ${
        isOverBudget 
          ? 'bg-red-50/70 border-red-300' 
          : isNearBudget 
            ? 'bg-amber-50/70 border-amber-300' 
            : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              isOverBudget ? 'bg-red-600 text-white animate-pulse' : isNearBudget ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {isOverBudget ? <AlertTriangle size={24} /> : isNearBudget ? <Bell size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-800">مراقبة الميزانية الشهرية</h3>
                {isOverBudget && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                    تنبيه: تجاوز الميزانية!
                  </span>
                )}
                {isNearBudget && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                    تحذير: اقتربت من الحد
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                تحديد سقف النفقات ومتابعة التجاوزات لحظة بلحظة
              </p>
            </div>
          </div>

          {/* Budget Editor Controls */}
          <div className="flex items-center gap-2">
            {isEditingBudget ? (
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-amber-300 shadow-sm">
                <input
                  type="number"
                  value={tempBudgetInput}
                  onChange={(e) => setTempBudgetInput(e.target.value)}
                  className="w-28 px-2 py-1 text-sm rounded focus:outline-none border border-gray-200"
                  placeholder="الميزانية"
                />
                <span className="text-xs text-gray-500">EGP</span>
                <button
                  onClick={handleSaveBudget}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                >
                  <Save size={14} /> حفظ
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isOverBudget) {
                      showToast(
                        'تنبيه حرج: تجاوز الميزانية الملكية!',
                        `المصروفات الحالية (${totalExpense.toLocaleString()} EGP) تجاوزت سقف الميزانية (${monthlyBudget.toLocaleString()} EGP).`,
                        'danger',
                        '𓃭'
                      );
                    } else if (isNearBudget) {
                      showToast(
                        'تحذير: اقتربت من حد الميزانية',
                        `وصلت المصروفات إلى ${budgetUsagePercent.toFixed(1)}% من الميزانية المحددة.`,
                        'warning',
                        '𓃭'
                      );
                    } else {
                      showToast(
                        'وضع الميزانية مستقر ومثالي',
                        `المصروفات الحالية (${totalExpense.toLocaleString()} EGP) ضمن الحدود الآمنة للميزانية (${monthlyBudget.toLocaleString()} EGP).`,
                        'success',
                        '𓋹'
                      );
                    }
                  }}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
                  title="عرض حالة التنبيه النوبي الحالية"
                >
                  <Bell size={14} className="text-amber-700" /> اختبر التنبيه
                </button>

                <button
                  onClick={() => {
                    setTempBudgetInput(monthlyBudget.toString());
                    setIsEditingBudget(true);
                  }}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 size={14} /> تعديل الميزانية ({monthlyBudget.toLocaleString()} EGP)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        {isOverBudget && (
          <div className="mb-4 p-4 bg-red-600 text-white rounded-xl flex items-start gap-3 shadow-md">
            <AlertCircle size={24} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base">تنبيه حرج: لقد تجاوزت الميزانية الشهرية المحددة!</h4>
              <p className="text-sm text-red-100 mt-1 leading-relaxed">
                إجمالي المصروفات الحالية ({totalExpense.toLocaleString()} EGP) تجاوز سقف الميزانية ({monthlyBudget.toLocaleString()} EGP) بمقدار <span className="font-bold text-white underline">{(totalExpense - monthlyBudget).toLocaleString()} EGP</span> ({budgetUsagePercent.toFixed(1)}%). يُنصح بضبط النفقات القادمة.
              </p>
            </div>
          </div>
        )}

        {isNearBudget && (
          <div className="mb-4 p-3.5 bg-amber-500 text-white rounded-xl flex items-start gap-3 shadow-sm">
            <Bell size={20} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">تحذير اقتراب من حد الميزانية</h4>
              <p className="text-xs text-amber-50 mt-0.5">
                استهلكت حتى الآن {budgetUsagePercent.toFixed(1)}% من الميزانية المحددة. المتبقي لك هو {(monthlyBudget - totalExpense).toLocaleString()} EGP فقط.
              </p>
            </div>
          </div>
        )}

        {!isOverBudget && !isNearBudget && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>ممتاز! المصروفات الحالية في نطاق آمن ومستقر بالنسبة للميزانية الشهرية المحددة.</span>
          </div>
        )}

        {/* Progress Bar & Key Numbers */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-700">
            <span>نسبة استهلاك الميزانية</span>
            <span className={isOverBudget ? 'text-red-600 font-bold' : isNearBudget ? 'text-amber-600' : 'text-emerald-600'}>
              {budgetUsagePercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-gray-200/80 rounded-full overflow-hidden p-0.5 border border-gray-300/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget 
                  ? 'bg-red-600' 
                  : isNearBudget 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100">
              <span className="text-gray-500 block text-[11px] mb-0.5">الميزانية المحددة</span>
              <span className="font-bold text-neutral-800">{monthlyBudget.toLocaleString()} EGP</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100">
              <span className="text-gray-500 block text-[11px] mb-0.5">المصروفات الفعلية</span>
              <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-neutral-800'}`}>
                {totalExpense.toLocaleString()} EGP
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100">
              <span className="text-gray-500 block text-[11px] mb-0.5">
                {isOverBudget ? 'الفائض والتجاوز' : 'المتبقي في الميزانية'}
              </span>
              <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                {Math.abs(monthlyBudget - totalExpense).toLocaleString()} EGP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Expense Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <div>
                 <h3 className="text-xl font-bold text-neutral-800">توزيع النفقات حسب الفئات</h3>
                 <p className="text-xs text-gray-500 mt-1">توزيع مصروفات المملكة وفقاً لنوع النشاط</p>
               </div>
               <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                 {categoryPieData.length} فئات
               </span>
             </div>
             <div className="h-64">
                {categoryPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={categoryPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                              {categoryPieData.map((entry, index) => (
                                  <Cell key={`cat-cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value.toLocaleString()} EGP`, 'المبلغ']}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    لا توجد مصروفات مسجلة بعد
                  </div>
                )}
             </div>
        </div>

        {/* Treasury Flow Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-1 text-neutral-800">تدفق الخزينة</h3>
            <p className="text-xs text-gray-500 mb-4">حركة المعاملات عبر الزمن</p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Area type="monotone" dataKey="amount" stroke="#d97706" fillOpacity={1} fill="url(#colorAmt)" name="المبلغ" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;