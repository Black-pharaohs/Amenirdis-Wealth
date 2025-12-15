import React, { useState } from 'react';
import { Transaction, TransactionType, Client } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface Props {
  onAdd: (t: Omit<Transaction, 'id' | 'createdBy'>) => void;
  clients: Client[];
}

const TransactionForm: React.FC<Props> = ({ onAdd, clients }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientId, setClientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category: category || 'عام',
      currency: 'EGP',
      date,
      clientId: clientId || undefined
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setClientId('');
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
          <label className="text-sm font-medium text-gray-600">المبلغ (EGP)</label>
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
          <label className="text-sm font-medium text-gray-600">الفئة</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none"
            placeholder="مثال: زراعة"
          />
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

        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-end">
          <button
            type="submit"
            className="w-full bg-[#d97706] hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md"
          >
            حفظ السجل
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;