import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const TransactionList: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-neutral-50 text-neutral-600 font-medium">
            <tr>
              <th className="p-4">النوع</th>
              <th className="p-4">الوصف</th>
              <th className="p-4">الفئة</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">المبلغ</th>
              <th className="p-4">بواسطة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
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
                <td className="p-4 font-medium text-gray-800">{t.description}</td>
                <td className="p-4 text-gray-500">{t.category}</td>
                <td className="p-4 text-gray-500">{t.date}</td>
                <td className={`p-4 font-bold dir-ltr text-right ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{t.amount.toLocaleString()} {t.currency}
                </td>
                <td className="p-4 text-gray-500 text-sm">{t.createdBy}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                        لا توجد سجلات في البردية بعد.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;