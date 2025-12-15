import React, { useEffect, useState } from 'react';
import { CurrencyRate } from '../types';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { getCurrencyInsights } from '../services/geminiService';

interface Props {
  rates: CurrencyRate[];
}

const CurrencyConverter: React.FC<Props> = ({ rates }) => {
  const [amount, setAmount] = useState<number>(1);
  const [base, setBase] = useState('USD');
  const [insight, setInsight] = useState('');

  // Mocking "Real-time" update
  const [displayRates, setDisplayRates] = useState(rates);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
     // Simulate fetching new rates with slight randomization for "Live" feel
     const newRates = displayRates.map(r => ({
         ...r,
         rate: r.code === 'USD' ? 1 : r.rate * (1 + (Math.random() * 0.02 - 0.01))
     }));
     setDisplayRates(newRates);
     setLastUpdated(new Date());
  };

  useEffect(() => {
    const fetchInsight = async () => {
        if(process.env.API_KEY) {
            const txt = await getCurrencyInsights(base);
            setInsight(txt);
        }
    };
    fetchInsight();
  }, [base]);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-neutral-800">ميزان الذهب (أسعار الصرف)</h2>
            <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 text-[#d97706] hover:text-amber-800 transition-colors"
            >
                <RefreshCw size={18} /> تحديث الأسعار
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Converter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">محول العملات السريع</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">المبلغ</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#d97706]"
                        />
                    </div>
                    <div>
                         <label className="block text-sm text-gray-500 mb-1">العملة الأساسية</label>
                         <select 
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#d97706] bg-white"
                         >
                            {displayRates.map(r => <option key={r.code} value={r.code}>{r.name} ({r.code})</option>)}
                         </select>
                    </div>

                    <div className="pt-4 border-t mt-4">
                        <p className="text-sm text-gray-500 mb-2">القيم المقابلة:</p>
                        <div className="space-y-2">
                            {displayRates.filter(r => r.code !== base).map(r => {
                                const baseRate = displayRates.find(x => x.code === base)?.rate || 1;
                                const converted = (amount / baseRate) * r.rate;
                                return (
                                    <div key={r.code} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                                        <span className="font-medium text-gray-700">{r.name}</span>
                                        <span className="font-bold text-[#d97706]">{converted.toFixed(2)} {r.code}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Ticker & AI */}
            <div className="space-y-6">
                <div className="bg-neutral-900 text-[#d97706] p-6 rounded-2xl shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-[#d97706] opacity-50"></div>
                     <div className="flex items-center gap-3 mb-4">
                        <TrendingUp size={24} />
                        <h3 className="text-xl font-bold text-white">تحليل السوق</h3>
                     </div>
                     <p className="text-white/80 leading-relaxed text-sm">
                        {insight || "جاري تحميل بيانات السوق الحكيمة..."}
                     </p>
                     <p className="text-xs text-neutral-500 mt-4 text-left dir-ltr">Last Updated: {lastUpdated.toLocaleTimeString()}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">الأسعار الحالية (مقابل الدولار)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {displayRates.map(r => (
                            <div key={r.code} className="text-center p-3 border rounded-lg hover:border-[#d97706] transition-colors">
                                <div className="text-gray-500 text-xs">{r.code}</div>
                                <div className="font-bold text-lg">{r.rate.toFixed(3)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CurrencyConverter;