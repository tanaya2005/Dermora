export interface CrmMetrics {
  repeatPurchaseRate: number;
  customerLifetimeValue: number;
  churnRate: number;
  resolutionTime: number;
  npsScore: number;
  totalTickets: number;
  averageRating: number;
}

export interface TicketCategory {
  category: string;
  count: number;
}

export interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  product: string;
  rating: number;
  reviewText: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  status: 'Replied' | 'Pending';
}

export interface NpsDistribution {
  score: string;
  count: number;
}

export interface LoyaltyProgram {
  totalCoinsIssued: number;
  totalCoinsRedeemed: number;
  membersByTier: {
    bronze: number;
    silver: number;
    gold: number;
  };
}

export interface CustomerSegment {
  segment: string;
  count: number;
  avgOrderValue: number;
  recommendedAction: string;
}

export interface CriticalAlert {
  ticketCount: number;
  type: string;
  percentage: number;
  status: string;
  timeline: {
    date: string;
    event: string;
    status: string;
  }[];
}

export const crmMetrics: CrmMetrics = {
  repeatPurchaseRate: 64,
  customerLifetimeValue: 3450,
  churnRate: 3.2,
  resolutionTime: 4.5,
  npsScore: 78,
  totalTickets: 342,
  averageRating: 4.6
};

export const ticketCategories: TicketCategory[] = [
  { category: "Delivery Issues", count: 120 },
  { category: "Product Quality", count: 85 },
  { category: "Refund Request", count: 64 },
  { category: "Account Issue", count: 42 },
  { category: "Consulting Inquiry", count: 30 }
];

export const sentimentData: SentimentData[] = [
  { name: "Positive", value: 68, color: "#10B981" },
  { name: "Neutral", value: 20, color: "#9B8EC4" },
  { name: "Negative", value: 12, color: "#EF4444" }
];

export const customerReviews: CustomerReview[] = [
  {
    id: "rev-1",
    customerName: "Aishwarya Sen",
    product: "Dermora Foaming Cleanser",
    rating: 5,
    reviewText: "Absolutely love the foaming texture. It cleared my acne breakouts within a week without drying out my cheeks!",
    sentiment: "Positive",
    status: "Replied"
  },
  {
    id: "rev-2",
    customerName: "Rahul Verma",
    product: "Dermora Niacinamide Serum",
    rating: 4,
    reviewText: "Good serum, absorbs quickly. Helped reduce oiliness on my nose but bottle is slightly small.",
    sentiment: "Positive",
    status: "Replied"
  },
  {
    id: "rev-3",
    customerName: "Sneha Reddy",
    product: "Dermora Gel Moisturizer",
    rating: 2,
    reviewText: "Too lightweight for my dry skin patches. Felt like I needed another layer immediately.",
    sentiment: "Negative",
    status: "Pending"
  }
];

export const npsDistribution: NpsDistribution[] = [
  { score: "1-2", count: 12 },
  { score: "3-4", count: 25 },
  { score: "5-6", count: 48 },
  { score: "7-8", count: 132 },
  { score: "9-10", count: 180 }
];

export const loyaltyProgram: LoyaltyProgram = {
  totalCoinsIssued: 154000,
  totalCoinsRedeemed: 98000,
  membersByTier: {
    bronze: 1250,
    silver: 450,
    gold: 120
  }
};

export const customerSegments: CustomerSegment[] = [
  {
    segment: "VIP / High Spenders",
    count: 120,
    avgOrderValue: 2450,
    recommendedAction: "Send early access invite to new launches + premium gift voucher"
  },
  {
    segment: "Repeat Buyers",
    count: 450,
    avgOrderValue: 1200,
    recommendedAction: "Target with personalized recommendations based on past purchases"
  },
  {
    segment: "At Risk / Inactive",
    count: 180,
    avgOrderValue: 850,
    recommendedAction: "Trigger re-engagement email with special 15% discount code"
  }
];

export const criticalAlert: CriticalAlert = {
  ticketCount: 15,
  type: "Payment Failures (UPI Gateway)",
  percentage: 12,
  status: "Active - High Priority",
  timeline: [
    { date: "15-07", event: "Incident detected by monitoring system", status: "open" },
    { date: "15-07", event: "Devops team assigned, investigating Gateway logs", status: "investigating" },
    { date: "16-07", event: "Backup gateway routing enabled", status: "workaround" },
    { date: "16-07", event: "Patch deployed for UPI callback handler", status: "resolved" }
  ]
};
