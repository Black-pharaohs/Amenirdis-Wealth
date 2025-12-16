import { User, UserRole, Client, Transaction, TransactionType, CurrencyRate } from './types';

// Palette: Black, Gold, Lapis Lazuli, Papyrus
export const COLORS = {
  primary: '#000000', // Black
  secondary: '#d97706', // Gold (amber-600)
  accent: '#1e3a8a', // Lapis Lazuli (blue-900)
  bg: '#fcf9f2', // Papyrus
  white: '#ffffff',
  danger: '#ef4444',
  success: '#10b981'
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'أماني ريديس', email: 'amenirdis@pharaohs.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/100/100' },
  { id: '2', name: 'تحارقا', email: 'taharqa@pharaohs.com', role: UserRole.ACCOUNTANT },
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'معبد الكرنك للتوريدات', type: 'vendor', contactInfo: 'sales@karnak.com', notes: 'مورد مواد بناء رئيسي' },
  { id: '2', name: 'شركة النيل للشحن', type: 'beneficiary', contactInfo: '+2010000000', notes: 'خدمات لوجستية' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'بيع محاصيل قمح', amount: 15000, currency: 'EGP', date: '2023-10-25', type: TransactionType.INCOME, category: 'زراعة', createdBy: 'أماني ريديس', notes: 'محصول الموسم الشتوي' },
  { id: '2', description: 'ترميم أعمدة المعبد', amount: 5000, currency: 'EGP', date: '2023-10-26', type: TransactionType.EXPENSE, category: 'صيانة', clientId: '1', createdBy: 'تحارقا' },
  { id: '3', description: 'تجارة ذهب', amount: 45000, currency: 'EGP', date: '2023-10-27', type: TransactionType.INCOME, category: 'تجارة', createdBy: 'أماني ريديس' },
  { id: '4', description: 'شراء ورق بردي', amount: 1200, currency: 'EGP', date: '2023-10-28', type: TransactionType.EXPENSE, category: 'أدوات مكتبية', createdBy: 'تحارقا' },
  { id: '5', description: 'رواتب الحراس', amount: 8000, currency: 'EGP', date: '2023-10-29', type: TransactionType.EXPENSE, category: 'رواتب', createdBy: 'أماني ريديس' },
];

export const INITIAL_RATES: CurrencyRate[] = [
  { code: 'USD', rate: 1, name: 'دولار أمريكي' },
  { code: 'EUR', rate: 0.92, name: 'يورو' },
  { code: 'EGP', rate: 48.50, name: 'جنيه مصري' },
  { code: 'SAR', rate: 3.75, name: 'ريال سعودي' },
  { code: 'AED', rate: 3.67, name: 'درهم إماراتي' },
  { code: 'SDG', rate: 580.00, name: 'جنيه سوداني' },
];