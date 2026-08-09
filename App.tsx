import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CurrencyConverter from './components/CurrencyConverter';
import UsersList from './components/UsersList';
import ClientsList from './components/ClientsList';
import UserProfile from './components/UserProfile';
import { ViewState, Transaction, TransactionType, User, Client } from './types';
import { MOCK_TRANSACTIONS, MOCK_USERS, MOCK_CLIENTS, INITIAL_RATES } from './constants';
import { useToast } from './components/ToastContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const { showToast } = useToast();
  
  // App State
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdBy'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Date.now().toString(),
      createdBy: currentUser.name, // Use dynamic current user name
    };
    
    const updatedTransactions = [tx, ...transactions];
    setTransactions(updatedTransactions);

    // Show success toast
    showToast(
      'تم تسجيل المعاملة في البردية',
      `تمت إضافة "${tx.description}" بقيمة ${tx.amount.toLocaleString()} ${tx.currency}`,
      'success',
      tx.nubianIcon || '𓋹'
    );

    // Check budget alert
    const monthlyBudget = Number(localStorage.getItem('amenirdis_monthly_budget') || '15000');
    const totalExpenses = updatedTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    if (totalExpenses > monthlyBudget) {
      const excess = totalExpenses - monthlyBudget;
      showToast(
        'تنبيه حرج: تجاوز الميزانية الملكية!',
        `المصروفات الحالية (${totalExpenses.toLocaleString()} EGP) تجاوزت سقف الميزانية (${monthlyBudget.toLocaleString()} EGP) بمقدار ${excess.toLocaleString()} EGP!`,
        'danger',
        '𓃭'
      );
    } else if (monthlyBudget > 0 && (totalExpenses / monthlyBudget) >= 0.85) {
      const percent = ((totalExpenses / monthlyBudget) * 100).toFixed(1);
      showToast(
        'تحذير: اقتربت من حد الميزانية',
        `وصلت المصروفات حتى الآن إلى ${percent}% من الميزانية المحددة.`,
        'warning',
        '𓃭'
      );
    }
  };

  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
    showToast('تمت إضافة كاتب جديد', `تم تسجيل "${user.name}" بنجاح في النظام`, 'success', '𓋴');
  };

  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
    showToast('تم تسطير عميل جديد', `تمت إضافة "${client.name}" إلى قائمة المتعاملين`, 'success', '𓏎');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast('تم تحديث بيانات الملف الشخصي', 'تمت الحفظ وتحديث شارات الهوية بنجاح', 'success', '𓋹');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'transactions':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-neutral-800">سجل المعاملات</h2>
             </div>
            <TransactionForm onAdd={handleAddTransaction} clients={clients} />
            <TransactionList transactions={transactions} clients={clients} />
          </div>
        );
      case 'currency':
        return <CurrencyConverter rates={INITIAL_RATES} />;
      case 'users':
        return <UsersList users={users} onAddUser={handleAddUser} />;
      case 'clients':
        return <ClientsList clients={clients} onAddClient={handleAddClient} />;
      case 'profile':
        return <UserProfile user={currentUser} onUpdate={handleUpdateProfile} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;