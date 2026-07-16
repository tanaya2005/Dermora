export interface ScmOverview {
  activeSellers: number;
  totalSkus: number;
  monthlyOrders: number;
  onTimeDelivery: number;
  avgFulfillment: number;
  returnRate: number;
}

export interface OrderLifecycleStage {
  stage: string;
  count: number;
  color: string;
}

export interface LowStockAlert {
  id: string;
  productName: string;
  seller: string;
  currentStock: number;
  threshold: number;
  status: 'Critical' | 'Warning';
}

export interface SellerPerformance {
  id: string;
  sellerName: string;
  ordersFulfilled: number;
  onTimePercentage: number;
  returnRate: number;
  rating: number;
  performanceScore: number;
}

export interface DeliveryAnalytics {
  deliveryTimeDistribution: {
    timeframe: string;
    percentage: number;
    color: string;
  }[];
  geographicData: {
    city: string;
    orders: number;
    deliveryTime: number;
  }[];
  returnReasons: {
    reason: string;
    percentage: number;
  }[];
}

export const scmOverview: ScmOverview = {
  activeSellers: 34,
  totalSkus: 1540,
  monthlyOrders: 4890,
  onTimeDelivery: 96.5,
  avgFulfillment: 1.8,
  returnRate: 4.1
};

export const orderLifecycle: OrderLifecycleStage[] = [
  { stage: "Ordered", count: 180, color: "#9B8EC4" },
  { stage: "Confirmed", count: 154, color: "#a78bfa" },
  { stage: "Packed", count: 112, color: "#3B82F6" },
  { stage: "Shipped", count: 320, color: "#10B981" },
  { stage: "Out for Delivery", count: 85, color: "#ffd166" },
  { stage: "Delivered", count: 3840, color: "#22C55E" },
  { stage: "Returned", count: 160, color: "#EF4444" }
];

export const lowStockAlerts: LowStockAlert[] = [
  {
    id: "low-1",
    productName: "Centella Calming Gel Cream",
    seller: "Aura Botanicals",
    currentStock: 3,
    threshold: 20,
    status: "Critical"
  },
  {
    id: "low-2",
    productName: "Hyaluronic Acid Hydrating Serum",
    seller: "Zen Skincare Labs",
    currentStock: 8,
    threshold: 50,
    status: "Critical"
  },
  {
    id: "low-3",
    productName: "Mineral Sunscreen SPF 50",
    seller: "Glow & Co",
    currentStock: 15,
    threshold: 25,
    status: "Warning"
  },
  {
    id: "low-4",
    productName: "C-Glow Serum 15% Vitamin C",
    seller: "Pure & Organic",
    currentStock: 18,
    threshold: 30,
    status: "Warning"
  }
];

export const sellerPerformance: SellerPerformance[] = [
  {
    id: "sel-perf-1",
    sellerName: "Aura Botanicals",
    ordersFulfilled: 1250,
    onTimePercentage: 98.4,
    returnRate: 2.1,
    rating: 4.8,
    performanceScore: 97
  },
  {
    id: "sel-perf-2",
    sellerName: "Zen Skincare Labs",
    ordersFulfilled: 980,
    onTimePercentage: 97.2,
    returnRate: 3.4,
    rating: 4.7,
    performanceScore: 95
  },
  {
    id: "sel-perf-3",
    sellerName: "Glow & Co",
    ordersFulfilled: 750,
    onTimePercentage: 94.8,
    returnRate: 4.2,
    rating: 4.5,
    performanceScore: 88
  },
  {
    id: "sel-perf-4",
    sellerName: "Pure & Organic",
    ordersFulfilled: 520,
    onTimePercentage: 92.1,
    returnRate: 5.8,
    rating: 4.3,
    performanceScore: 82
  }
];

export const deliveryAnalytics: DeliveryAnalytics = {
  deliveryTimeDistribution: [
    { timeframe: "Same Day", percentage: 12, color: "#10B981" },
    { timeframe: "Next Day", percentage: 38, color: "#3B82F6" },
    { timeframe: "2-3 Days", percentage: 40, color: "#ffd166" },
    { timeframe: "4+ Days", percentage: 10, color: "#EF4444" }
  ],
  geographicData: [
    { city: "Mumbai", orders: 1450, deliveryTime: 1.2 },
    { city: "Delhi NCR", orders: 1200, deliveryTime: 1.5 },
    { city: "Bangalore", orders: 980, deliveryTime: 1.4 },
    { city: "Chennai", orders: 620, deliveryTime: 2.1 },
    { city: "Pune", orders: 510, deliveryTime: 1.1 }
  ],
  returnReasons: [
    { reason: "Product damaged", percentage: 45 },
    { reason: "Incorrect product received", percentage: 25 },
    { reason: "Customer changed mind", percentage: 18 },
    { reason: "Delayed delivery", percentage: 12 }
  ]
};
