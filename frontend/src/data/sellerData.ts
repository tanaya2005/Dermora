export interface SellerDashboardData {
  products: {
    totalListed: number;
    totalStockValue: number;
    pendingApproval: number;
    lowStockItems: number;
  };
  orders: {
    new: number;
    processing: number;
    shipped: number;
    delivered: number;
    returns: number;
  };
  revenue: {
    thisMonth: number;
    totalAllTime: number;
    pendingPayout: number;
  };
  reviews: {
    avgRating: number;
    totalReviews: number;
    pendingResponse: number;
  };
  performanceScore: number;
}

export interface SellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Low Stock' | 'Out of Stock';
}

export interface SellerOrder {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  date: string;
  status: 'New' | 'Processing' | 'Shipped' | 'Delivered';
}

export interface SubscriptionPlans {
  current: string;
  plans: {
    name: string;
    price: number;
    current: boolean;
    popular: boolean;
    features: string[];
  }[];
}

export const sellerDashboardData: SellerDashboardData = {
  products: {
    totalListed: 12,
    totalStockValue: 185000,
    pendingApproval: 2,
    lowStockItems: 3
  },
  orders: {
    new: 5,
    processing: 8,
    shipped: 15,
    delivered: 142,
    returns: 2
  },
  revenue: {
    thisMonth: 85000,
    totalAllTime: 450000,
    pendingPayout: 23500
  },
  reviews: {
    avgRating: 4.7,
    totalReviews: 68,
    pendingResponse: 4
  },
  performanceScore: 94
};

export const sellerProducts: SellerProduct[] = [
  {
    id: "sp-1",
    name: "Centella Calming Gel Cream",
    category: "Moisturizer",
    price: 349,
    stock: 3,
    status: "Low Stock"
  },
  {
    id: "sp-2",
    name: "Salicylic Acid Cleanser",
    category: "Cleanser",
    price: 299,
    stock: 45,
    status: "Active"
  },
  {
    id: "sp-3",
    name: "Hyaluronic Acid Serum",
    category: "Serum",
    price: 499,
    stock: 0,
    status: "Out of Stock"
  },
  {
    id: "sp-4",
    name: "Zinc & Niacinamide Serum",
    category: "Serum",
    price: 449,
    stock: 85,
    status: "Active"
  }
];

export const sellerOrders: SellerOrder[] = [
  {
    id: "ORD-9382",
    customer: "Rohan Sharma",
    product: "Salicylic Acid Cleanser",
    quantity: 1,
    amount: 299,
    date: "15-07-2026",
    status: "New"
  },
  {
    id: "ORD-9375",
    customer: "Priya Nair",
    product: "Centella Calming Gel Cream",
    quantity: 2,
    amount: 698,
    date: "14-07-2026",
    status: "Processing"
  },
  {
    id: "ORD-9310",
    customer: "Kunal Sen",
    product: "Zinc & Niacinamide Serum",
    quantity: 1,
    amount: 449,
    date: "12-07-2026",
    status: "Shipped"
  },
  {
    id: "ORD-9285",
    customer: "Divya Rao",
    product: "Centella Calming Gel Cream",
    quantity: 1,
    amount: 349,
    date: "10-07-2026",
    status: "Delivered"
  }
];

export const subscriptionPlans: SubscriptionPlans = {
  current: "Standard Seller Plan",
  plans: [
    {
      name: "Standard Seller Plan",
      price: 0,
      current: true,
      popular: false,
      features: [
        "List up to 15 products",
        "15% flat commission fee",
        "Basic sales analytics",
        "Standard seller support"
      ]
    },
    {
      name: "Premium Seller Plan",
      price: 999,
      current: false,
      popular: true,
      features: [
        "Unlimited product listings",
        "10% reduced commission fee",
        "Advanced buyer behavior insights",
        "2x search visibility boost",
        "24/7 priority seller support"
      ]
    }
  ]
};
