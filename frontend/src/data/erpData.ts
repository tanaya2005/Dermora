export interface ErpOverview {
  users: {
    total: number;
    newThisMonth: number;
    sellers: number;
    admins: number;
  };
  orders: {
    total: number;
    returns: number;
    onTimePercentage: number;
  };
  marketing: {
    roas: number;
    newUsers: number;
    attributedRevenue: number;
  };
  consultations: {
    sessions: number;
    revenue: number;
    avgRating: number;
  };
  finance: {
    revenue: number;
    expenses: number;
    netProfit: number;
  };
  inventory: {
    totalSkus: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface PlSummary {
  category: string;
  mar: number;
  feb: number;
  jan: number;
}

export interface GstSummary {
  totalTaxableSales: number;
  gstCollected: number;
  gstPayable: number;
}

export interface SellerPayouts {
  totalDisbursed: number;
  pendingPayouts: number;
  processing: number;
}

export interface FinancialData {
  plSummary: PlSummary[];
  gstSummary: GstSummary;
  sellerPayouts: SellerPayouts;
}

export interface ErpUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER' | 'DERMATOLOGIST';
  joinDate: string;
  totalSpend: number;
  status: 'Active' | 'Suspended';
}

export interface NewUserRegistration {
  date: string;
  count: number;
}

export interface UserRoleDistribution {
  role: string;
  count: number;
  color: string;
}

export const erpOverview: ErpOverview = {
  users: {
    total: 3840,
    newThisMonth: 340,
    sellers: 34,
    admins: 4
  },
  orders: {
    total: 4890,
    returns: 160,
    onTimePercentage: 96.5
  },
  marketing: {
    roas: 3.8,
    newUsers: 1450,
    attributedRevenue: 2800000
  },
  consultations: {
    sessions: 450,
    revenue: 450000,
    avgRating: 4.8
  },
  finance: {
    revenue: 7500000,
    expenses: 5300000,
    netProfit: 2200000
  },
  inventory: {
    totalSkus: 1540,
    lowStock: 23,
    outOfStock: 0
  }
};

export const financialData: FinancialData = {
  plSummary: [
    { category: "Revenue", mar: 750000, feb: 680000, jan: 610000 },
    { category: "COGS", mar: 320000, feb: 300000, jan: 280000 },
    { category: "Marketing", mar: 120000, feb: 110000, jan: 95000 },
    { category: "Operations", mar: 85000, feb: 80000, jan: 75000 },
    { category: "Net Profit", mar: 225000, feb: 190000, jan: 160000 }
  ],
  gstSummary: {
    totalTaxableSales: 3850000,
    gstCollected: 693000, // 18% of sales
    gstPayable: 125000
  },
  sellerPayouts: {
    totalDisbursed: 2890000,
    pendingPayouts: 237000,
    processing: 45000
  }
};

export const userManagementData: ErpUser[] = [
  {
    id: "usr-1",
    name: "Nehan Sharma",
    email: "nehan.sharma@gmail.com",
    role: "ADMIN",
    joinDate: "01-01-2026",
    totalSpend: 0,
    status: "Active"
  },
  {
    id: "usr-2",
    name: "Tanaya Jain",
    email: "tanaya.jain@dermatology.com",
    role: "DERMATOLOGIST",
    joinDate: "12-01-2026",
    totalSpend: 0,
    status: "Active"
  },
  {
    id: "usr-3",
    name: "Aura Botanicals Office",
    email: "payouts@aurabotanicals.com",
    role: "SELLER",
    joinDate: "15-02-2026",
    totalSpend: 0,
    status: "Active"
  },
  {
    id: "usr-4",
    name: "Karan Johar",
    email: "karan.j@yahoo.com",
    role: "BUYER",
    joinDate: "10-03-2026",
    totalSpend: 15400,
    status: "Active"
  },
  {
    id: "usr-5",
    name: "Pooja Malhotra",
    email: "poojam@hotmail.com",
    role: "BUYER",
    joinDate: "18-03-2026",
    totalSpend: 8900,
    status: "Active"
  }
];

export const newUserRegistrations: NewUserRegistration[] = [
  { date: "10-07", count: 12 },
  { date: "11-07", count: 18 },
  { date: "12-07", count: 15 },
  { date: "13-07", count: 22 },
  { date: "14-07", count: 28 },
  { date: "15-07", count: 32 }
];

export const userRoleDistribution: UserRoleDistribution[] = [
  { role: "BUYER", count: 3750, color: "#10B981" },
  { role: "SELLER", count: 34, color: "#ffd166" },
  { role: "DERMATOLOGIST", count: 52, color: "#3B82F6" },
  { role: "ADMIN", count: 4, color: "#EF4444" }
];
