import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Shield, UserPlus, Trash2 } from 'lucide-react';

interface Props {
  users: User[];
  onAddUser: (user: User) => void;
}

const UsersList: React.FC<Props> = ({ users, onAddUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.VIEWER);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
        id: Date.now().toString(),
        name: newName,
        email: newEmail,
        role: newRole,
        avatar: `https://ui-avatars.com/api/?name=${newName}&background=d97706&color=fff`
    };
    onAddUser(newUser);
    setNewName('');
    setNewEmail('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-neutral-800">حراس الخزينة (المستخدمين)</h2>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-neutral-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-700"
            >
                <UserPlus size={18} /> إضافة مستخدم
            </button>
        </div>

        {showForm && (
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#d97706]">
                <h3 className="font-bold mb-4">بيانات المستخدم الجديد</h3>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-gray-500">الاسم</label>
                        <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-2 rounded outline-none focus:border-[#d97706]" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-xs text-gray-500">البريد الإلكتروني</label>
                        <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border p-2 rounded outline-none focus:border-[#d97706]" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-xs text-gray-500">الدور</label>
                        <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="w-full border p-2 rounded outline-none focus:border-[#d97706] bg-white">
                            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-[#d97706] text-white px-6 py-2 rounded hover:bg-amber-700">حفظ</button>
                </form>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-[#d97706]" />
                    <div className="flex-1">
                        <h4 className="font-bold text-lg text-neutral-800">{user.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                        <span className={`px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1 ${
                            user.role === UserRole.ADMIN ? 'bg-neutral-900 text-[#d97706]' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <Shield size={12} /> {user.role}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default UsersList;