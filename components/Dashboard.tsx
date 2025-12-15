import React, { useEffect, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';
import { Wallet, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('جاري استشارة الحكيم...');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Calculate Totals
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare Chart Data
  const data = transactions.map(t => ({
    name: t.date,
    amount: t.type === TransactionType.INCOME ? t.amount : -t.amount,
    type: t.type === TransactionType.INCOME ? 'دخل' : 'صرف'
  }));

  const pieData = [
    { name: 'الدخل', value: totalIncome },
    { name: 'المصروفات', value: totalExpense },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  useEffect(() => {
    const fetchAdvice = async () => {
        setLoadingAdvice(true);
        const result = await getFinancialAdvice(transactions);
        setAdvice(result);
        setLoadingAdvice(false);
    };
    if (process.env.API_KEY) {
        fetchAdvice();
    } else {
        setAdvice("أدخل مفتاح API للحصول على نصائح الذكاء الاصطناعي.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]); // Only re-fetch if transactions change

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-neutral-800">تدفق الخزينة</h3>
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
                        <Area type="monotone" dataKey="amount" stroke="#d97706" fillOpacity={1} fill="url(#colorAmt)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-xl font-bold mb-6 text-neutral-800">توزيع الثروة</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;