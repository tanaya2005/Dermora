export interface RevenueOverview {
  totalMonthlyRevenue: number;
  gmv: number;
  commissionEarned: number;
  activeProSubscribers: number;
  activeSellerSubscriptions: number;
  proSubscriberRevenue: number;
  sellerSubscriptionRevenue: number;
}

export interface RevenueStream {
  id: string;
  name: string;
  description: string;
  icon: string;
  monthlyRevenue: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  target: number;
}

export interface TopSeller {
  id: string;
  name: string;
  productsSold: number;
  gmv: number;
  commission: number;
  netPayout: number;
  status: 'Paid' | 'Processing' | 'Pending';
}

export const revenueOverview: RevenueOverview = {
  totalMonthlyRevenue: 750000,
  gmv: 4500000,
  commissionEarned: 675000, // 15% of GMV
  activeProSubscribers: 240,
  activeSellerSubscriptions: 50,
  proSubscriberRevenue: 48000, // 240 * 199
  sellerSubscriptionRevenue: 49950 // 50 * 999
};

export const revenueStreams: RevenueStream[] = [
  {
    id: "stream-1",
    name: "Marketplace Commission",
    description: "15% flat commission fee charged on all successful sales transactions.",
    icon: "🛍️",
    monthlyRevenue: 675000,
    percentage: 90
  },
  {
    id: "stream-2",
    name: "Seller Subscriptions",
    description: "Premium plans purchased by sellers for listing products and advanced tools.",
    icon: "🏪",
    monthlyRevenue: 49950,
    percentage: 6.6
  },
  {
    id: "stream-3",
    name: "Buyer Pro Subscriptions",
    description: "Paid buyer memberships for free shipping, priority consulting, and early sales.",
    icon: "💎",
    monthlyRevenue: 25050,
    percentage: 3.4
  }
];

export const monthlyRevenueData: MonthlyRevenue[] = [
  { month: "Jan", revenue: 450000, target: 500000 },
  { month: "Feb", revenue: 520000, target: 550000 },
  { month: "Mar", revenue: 610000, target: 600000 },
  { month: "Apr", revenue: 680000, target: 650000 },
  { month: "May", revenue: 750000, target: 700000 }
];

export const topSellers: TopSeller[] = [
  {
    id: "seller-1",
    name: "Aura Botanicals",
    productsSold: 1250,
    gmv: 1250000,
    commission: 187500,
    netPayout: 1062500,
    status: "Paid"
  },
  {
    id: "seller-2",
    name: "Zen Skincare Labs",
    productsSold: 980,
    gmv: 980000,
    commission: 147000,
    netPayout: 833000,
    status: "Paid"
  },
  {
    id: "seller-3",
    name: "Glow & Co",
    productsSold: 750,
    gmv: 750000,
    commission: 112500,
    netPayout: 637500,
    status: "Processing"
  },
  {
    id: "seller-4",
    name: "Pure & Organic",
    productsSold: 520,
    gmv: 520000,
    commission: 78000,
    netPayout: 442000,
    status: "Pending"
  }
];
