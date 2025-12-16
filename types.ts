export enum UserRole {
  ADMIN = 'مسؤول',
  ACCOUNTANT = 'محاسب',
  VIEWER = 'مشاهد'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'beneficiary' | 'vendor' | 'customer'; // مستفيد | مورد | عميل
  contactInfo: string;
  notes: string;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  type: TransactionType;
  category: string;
  clientId?: string; // Link to a client
  createdBy: string;
  exchangeRate?: number;
  notes?: string;
}

export interface CurrencyRate {
  code: string;
  rate: number; // Against base currency (EGP or USD)
  name: string;
}

export type ViewState = 'dashboard' | 'transactions' | 'currency' | 'users' | 'clients' | 'profile';