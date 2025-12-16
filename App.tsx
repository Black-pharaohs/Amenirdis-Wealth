import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CurrencyConverter from './components/CurrencyConverter';
import UsersList from './components/UsersList';
import ClientsList from './components/ClientsList';
import UserProfile from './components/UserProfile';
import { ViewState, Transaction, User, Client } from './types';
import { MOCK_TRANSACTIONS, MOCK_USERS, MOCK_CLIENTS, INITIAL_RATES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
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
    setTransactions([tx, ...transactions]);
  };

  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
  };

  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Also update this user in the users list
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
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