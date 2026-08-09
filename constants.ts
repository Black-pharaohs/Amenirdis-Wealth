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

export const NUBIAN_ICONS = [
  { symbol: '𓋹', name: 'عنخ (مفتاح الحياة)', label: 'بركة وصحة', categoryDefault: 'صحة ومعيشة' },
  { symbol: '𓎛', name: 'نوب (وعاء الذهب)', label: 'ثروة ومقتنيات', categoryDefault: 'تجارة ومقتنيات' },
  { symbol: '𓈗', name: 'إتيرو (أمواج النيل)', label: 'زراعة ومياه', categoryDefault: 'زراعة ومياه' },
  { symbol: '𓉐', name: 'بر (المعبد النوبي)', label: 'عقارات وبناء', categoryDefault: 'صيانة وبناء' },
  { symbol: '𓏎', name: 'القوافل والتجارة', label: 'تجارة وشحن', categoryDefault: 'تجارة ونقل' },
  { symbol: '𓋴', name: 'دشرت (التاج الملكي)', label: 'إدارة ورواتب', categoryDefault: 'رواتب وإدارة' },
  { symbol: '𓃭', name: 'ماي (الأسد النوبي)', label: 'حراسة وأمن', categoryDefault: 'أمن وحماية' },
  { symbol: '𓂀', name: 'أودجات (عين حورس)', label: 'رعاية وعناية', categoryDefault: 'خدمات وطبابة' },
  { symbol: '𓄿', name: 'مروي (الهرم النوبي)', label: 'مشاريع واستثمار', categoryDefault: 'استثمار وتشييد' },
  { symbol: '𓇳', name: 'رع (قرص الشمس)', label: 'طاقة ومؤن', categoryDefault: 'مؤن وخدمات' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // نوفمبر 2023
  { id: '10', description: 'تجهيز شحنة قطن نوبي', amount: 28000, currency: 'EGP', date: '2023-11-05', type: TransactionType.INCOME, category: 'تجارة', nubianIcon: '𓏎', createdBy: 'أماني ريديس' },
  { id: '11', description: 'شراء أواني فخارية من نبتة', amount: 3500, currency: 'EGP', date: '2023-11-12', type: TransactionType.EXPENSE, category: 'مؤن وخدمات', nubianIcon: '𓇳', createdBy: 'تحارقا' },
  
  // أكتوبر 2023
  { id: '1', description: 'بيع محاصيل قمح', amount: 15000, currency: 'EGP', date: '2023-10-25', type: TransactionType.INCOME, category: 'زراعة', nubianIcon: '𓈗', createdBy: 'أماني ريديس', notes: 'محصول الموسم الشتوي' },
  { id: '2', description: 'ترميم أعمدة المعبد', amount: 5000, currency: 'EGP', date: '2023-10-26', type: TransactionType.EXPENSE, category: 'صيانة', nubianIcon: '𓉐', clientId: '1', createdBy: 'تحارقا' },
  { id: '3', description: 'تجارة ذهب نوبي', amount: 45000, currency: 'EGP', date: '2023-10-27', type: TransactionType.INCOME, category: 'تجارة', nubianIcon: '𓎛', createdBy: 'أماني ريديس' },
  { id: '4', description: 'شراء ورق بردي', amount: 1200, currency: 'EGP', date: '2023-10-28', type: TransactionType.EXPENSE, category: 'أدوات مكتبية', nubianIcon: '𓋹', createdBy: 'تحارقا' },
  { id: '5', description: 'رواتب حراس القصر', amount: 8000, currency: 'EGP', date: '2023-10-29', type: TransactionType.EXPENSE, category: 'رواتب', nubianIcon: '𓋴', createdBy: 'أماني ريديس' },

  // سبتمبر 2023
  { id: '6', description: 'صادر أحجار الكريمة إلى ممفيس', amount: 32000, currency: 'EGP', date: '2023-09-15', type: TransactionType.INCOME, category: 'تجارة', nubianIcon: '𓎛', createdBy: 'أماني ريديس' },
  { id: '7', description: 'حراسة وصيانة أسطول النيل', amount: 6200, currency: 'EGP', date: '2023-09-20', type: TransactionType.EXPENSE, category: 'أمن وحماية', nubianIcon: '𓃭', clientId: '2', createdBy: 'تحارقا' },
  { id: '8', description: 'مستلزمات علاجية وأطباء القصر', amount: 2400, currency: 'EGP', date: '2023-09-28', type: TransactionType.EXPENSE, category: 'خدمات وطبابة', nubianIcon: '𓂀', createdBy: 'أماني ريديس' },

  // أغسطس 2023
  { id: '9', description: 'حصاد النخيل والبلح النوبي', amount: 21000, currency: 'EGP', date: '2023-08-10', type: TransactionType.INCOME, category: 'زراعة ومياه', nubianIcon: '𓈗', createdBy: 'أماني ريديس' },
  { id: '12', description: 'بناء سور حماية للمحاصيل', amount: 9500, currency: 'EGP', date: '2023-08-18', type: TransactionType.EXPENSE, category: 'استثمار وتشييد', nubianIcon: '𓄿', createdBy: 'تحارقا' }
];

export const INITIAL_RATES: CurrencyRate[] = [
  { code: 'USD', rate: 1, name: 'دولار أمريكي' },
  { code: 'EUR', rate: 0.92, name: 'يورو' },
  { code: 'EGP', rate: 48.50, name: 'جنيه مصري' },
  { code: 'SAR', rate: 3.75, name: 'ريال سعودي' },
  { code: 'AED', rate: 3.67, name: 'درهم إماراتي' },
  { code: 'SDG', rate: 580.00, name: 'جنيه سوداني' },
];