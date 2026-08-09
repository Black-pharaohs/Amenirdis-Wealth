import React, { useState } from 'react';
import { Transaction, TransactionType, Client } from '../types';
import { PlusCircle, MinusCircle, Sparkles } from 'lucide-react';
import { INITIAL_RATES, NUBIAN_ICONS } from '../constants';

interface Props {
  onAdd: (t: Omit<Transaction, 'id' | 'createdBy'>) => void;
  clients: Client[];
}

const TransactionForm: React.FC<Props> = ({ onAdd, clients }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedNubianIcon, setSelectedNubianIcon] = useState<string>('𓋹');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientId, setClientId] = useState('');
  
  // New State Fields
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRate, setExchangeRate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category: category || 'عام',
      nubianIcon: selectedNubianIcon,
      currency: currency,
      date,
      clientId: clientId || undefined,
      exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
      notes: notes || undefined
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setSelectedNubianIcon('𓋹');
    setClientId('');
    setExchangeRate('');
    setNotes('');
    setCurrency('EGP');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-4 text-neutral-800 border-b pb-2">تسجيل معاملة جديدة</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="col-span-1 md:col-span-3 flex gap-4 mb-2">
            <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border-2 transition-colors ${type === TransactionType.INCOME ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
            >
                <PlusCircle size={18} /> دخل
            </button>
            <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border-2 transition-colors ${type === TransactionType.EXPENSE ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500'}`}
            >
                <MinusCircle size={18} /> صرف
            </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">الوصف</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none"
            placeholder="مثال: بيع قمح"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">المبلغ</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none"
            placeholder="0.00"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">العملة</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none bg-white"
          >
            {INITIAL_RATES.map(rate => (
                <option key={rate.code} value={rate.code}>{rate.name} ({rate.code})</option>
            ))}
          </select>
        </div>

         <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">سعر الصرف (مقابل الدولار)</label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none"
            placeholder="اختياري"
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 mb-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#d97706]" />
              اختيار أيقونة مستوحاة من الحضارة النوبية
            </label>
            <span className="text-xs text-amber-700 font-medium">
              الأيقونة المختارة: <span className="text-lg font-bold bg-white px-2 py-0.5 rounded border border-amber-300 shadow-sm">{selectedNubianIcon}</span>
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {NUBIAN_ICONS.map((item) => (
              <button
                key={item.symbol}
                type="button"
                onClick={() => {
                  setSelectedNubianIcon(item.symbol);
                  if (!category) {
                    setCategory(item.categoryDefault);
                  }
                }}
                title={`${item.name} - ${item.label}`}
                className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                  selectedNubianIcon === item.symbol
                    ? 'bg-[#d97706] text-white shadow-md scale-105 ring-2 ring-amber-300'
                    : 'bg-white hover:bg-amber-100/80 text-gray-800 border border-amber-200/60'
                }`}
              >
                <span className="text-2xl leading-none mb-1">{item.symbol}</span>
                <span className="text-[10px] font-semibold text-center line-clamp-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">الفئة</label>
          <div className="relative">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 pr-9 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none"
              placeholder="مثال: زراعة"
            />
            <span className="absolute right-2 top-2.5 text-lg leading-none">{selectedNubianIcon}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">التاريخ</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">العميل / المستفيد (اختياري)</label>
            <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none bg-white"
            >
                <option value="">-- اختر --</option>
                {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">ملاحظات إضافية</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none h-20 resize-none"
            placeholder="أضف أي تفاصيل أخرى هنا..."
          />
        </div>

        <div className="col-span-1 md:col-span-3 flex items-end mt-2">
          <button
            type="submit"
            className="w-full bg-[#d97706] hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            حفظ السجل
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;