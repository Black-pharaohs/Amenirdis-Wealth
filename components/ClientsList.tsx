import React, { useState } from 'react';
import { Client } from '../types';
import { Building2, Plus, Phone } from 'lucide-react';

interface Props {
  clients: Client[];
  onAddClient: (client: Client) => void;
}

const ClientsList: React.FC<Props> = ({ clients, onAddClient }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState<Client['type']>('customer');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({
        id: Date.now().toString(),
        name,
        contactInfo: contact,
        type,
        notes
    });
    setName(''); setContact(''); setNotes(''); setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-neutral-800">سجل الرعية والعملاء</h2>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-[#d97706] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700"
            >
                <Plus size={18} /> إضافة جديد
            </button>
        </div>

        {showForm && (
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500">الاسم</label>
                        <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">معلومات الاتصال</label>
                        <input required value={contact} onChange={e => setContact(e.target.value)} className="w-full border p-2 rounded outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">النوع</label>
                        <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border p-2 rounded outline-none bg-white">
                            <option value="customer">عميل</option>
                            <option value="vendor">مورد</option>
                            <option value="beneficiary">مستفيد</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">ملاحظات</label>
                        <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full border p-2 rounded outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <button className="w-full bg-neutral-900 text-white py-2 rounded">حفظ</button>
                    </div>
                 </form>
            </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="p-4 text-neutral-600">الاسم</th>
                        <th className="p-4 text-neutral-600">النوع</th>
                        <th className="p-4 text-neutral-600">الاتصال</th>
                        <th className="p-4 text-neutral-600">ملاحظات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {clients.map(client => (
                        <tr key={client.id} className="hover:bg-amber-50/30">
                            <td className="p-4 font-bold flex items-center gap-2">
                                <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                                    <Building2 size={16} />
                                </div>
                                {client.name}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    client.type === 'vendor' ? 'bg-blue-100 text-blue-700' :
                                    client.type === 'beneficiary' ? 'bg-purple-100 text-purple-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {client.type === 'vendor' ? 'مورد' : client.type === 'beneficiary' ? 'مستفيد' : 'عميل'}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                                <Phone size={14} /> {client.contactInfo}
                            </td>
                            <td className="p-4 text-sm text-gray-500">{client.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ClientsList;