import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Shield, Camera, Save, Lock } from 'lucide-react';

interface Props {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const UserProfile: React.FC<Props> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...user,
      name,
      email,
      avatar,
    });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-800">الملف الشخصي الملكي</h2>
        <p className="text-gray-600">إدارة بياناتك وصلاحياتك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Card & Preview */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-neutral-900 to-neutral-800"></div>
            
            <div className="relative mt-8 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                <img 
                  src={avatar || `https://ui-avatars.com/api/?name=${name}&background=d97706&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#d97706] p-2 rounded-full text-white shadow-sm border-2 border-white">
                <Shield size={16} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-neutral-800">{name}</h3>
            <p className="text-sm text-gray-500 mb-4">{email}</p>
            
            <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-200 inline-flex items-center gap-2">
              <Shield size={14} />
              {user.role}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold mb-6 border-b pb-2 flex items-center gap-2">
                <UserIcon size={20} className="text-[#d97706]" />
                البيانات الأساسية
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserIcon size={16} /> الاسم الكامل
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail size={16} /> البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Camera size={16} /> رابط الصورة الرمزية
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none transition-all text-left dir-ltr"
                />
              </div>

              {/* Password Section (Mock) */}
              <div className="pt-4 border-t border-gray-100">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-[#d97706]" />
                    الأمان
                </h3>
                <div className="space-y-2 opacity-60 pointer-events-none">
                     <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
                     <input type="password" value="********" readOnly className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl" />
                     <p className="text-xs text-gray-400">لا يمكن تغيير كلمة المرور في النسخة التجريبية</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-[#d97706] hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Save size={18} />
                  حفظ التعديلات
                </button>
                
                {isSuccess && (
                    <span className="text-green-600 font-medium animate-fade-in flex items-center gap-1">
                        تم الحفظ بنجاح!
                    </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;