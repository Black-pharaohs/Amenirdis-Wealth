import React, { useState } from 'react';
import { Transaction, TransactionType, Client } from '../types';
import { ArrowUpRight, ArrowDownLeft, Download, X, Calendar, Tag, User, Building2, Phone, FileText, Banknote, StickyNote, Info } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  clients: Client[];
}

const TransactionList: React.FC<Props> = ({ transactions, clients }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    // Define headers
    const headers = ['ID', 'الوصف', 'المبلغ', 'العملة', 'سعر الصرف', 'النوع', 'الفئة', 'التاريخ', 'بواسطة', 'ملاحظات', 'العميل'];
    
    // Map data to rows
    const csvContent = transactions.map(t => {
      const clientName = t.clientId ? clients.find(c => c.id === t.clientId)?.name : '';
      return [
        t.id,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
        t.amount,
        t.currency,
        t.exchangeRate || '',
        t.type === TransactionType.INCOME ? 'دخل' : 'صرف',
        t.category,
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
    link.setAttribute('download', `amenirdis_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getClient = (id?: string) => clients.find(c => c.id === id);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-700">أرشيف المعاملات</h3>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-[#d97706] hover:border-[#d97706] transition-colors shadow-sm"
            title="تحميل كملف CSV"
          >
            <Download size={16} />
            <span>تصدير CSV</span>
          </button>
        </div>

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
                            <Tag size={12} /> الفئة
                        </div>
                        <div className="font-semibold text-gray-800">{selectedTransaction.category}</div>
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
    </>
  );
};

export default TransactionList;