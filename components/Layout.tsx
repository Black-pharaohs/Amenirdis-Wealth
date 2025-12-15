import React, { useState } from 'react';
import { LayoutGrid, ScrollText, Scale, Users, Contact, Menu, X, Pyramid, Coins } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'اللوحة الرئيسية', icon: LayoutGrid },
    { id: 'transactions', label: 'سجل المعاملات', icon: ScrollText },
    { id: 'currency', label: 'أسعار الصرف', icon: Scale },
    { id: 'users', label: 'الحراس والمستخدمين', icon: Users },
    { id: 'clients', label: 'الرعية والعملاء', icon: Contact },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f2] flex text-gray-800 font-cairo">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-neutral-900 text-[#d97706] shadow-xl border-l-4 border-[#d97706] relative">
        <div className="p-6 flex items-center justify-center border-b border-neutral-800">
           <div className="text-center">
             <div className="mx-auto bg-[#d97706] text-black w-12 h-12 rounded-full flex items-center justify-center mb-3">
               <Pyramid size={24} />
             </div>
             <h1 className="text-2xl font-bold tracking-wider text-white">أماني ريديس</h1>
             <p className="text-xs text-[#d97706] opacity-80 mt-1">إدارة الثروة والحكمة</p>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onChangeView(item.id as ViewState)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-[#d97706] text-black font-bold shadow-lg transform scale-105'
                        : 'hover:bg-neutral-800 text-gray-300 hover:text-[#d97706]'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-neutral-800 text-center">
          <p className="text-xs text-gray-500">من تطوير</p>
          <p className="text-sm font-semibold text-white">Black Pharaohs Code</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden bg-neutral-900 text-[#d97706] p-4 flex justify-between items-center shadow-md z-20">
          <div className="flex items-center gap-2">
             <Pyramid size={20} className="text-[#d97706]" />
             <span className="font-bold text-lg text-white">أماني ريديس</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-0 bg-neutral-900 z-10 pt-20 px-4">
             <ul className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onChangeView(item.id as ViewState);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg border border-neutral-700 ${
                      currentView === item.id ? 'bg-[#d97706] text-black' : 'text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
           {/* Decorative Background Element */}
           <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0 flex items-center justify-center overflow-hidden">
              <Coins size={400} />
           </div>
           <div className="relative z-1 max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;