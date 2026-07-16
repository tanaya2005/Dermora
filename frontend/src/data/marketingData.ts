export interface MarketingOverview {
  overallRoas: number;
  newUsersFromMarketing: number;
  emailSubscribers: number;
  totalMarketingSpend: number;
  revenueAttributed: number;
}

export interface GoogleAdsData {
  spend: number;
  clicks: number;
  ctr: number;
  roas: number;
  dailyData: {
    date: string;
    clicks: number;
    conversions: number;
  }[];
  topKeywords: {
    keyword: string;
    clicks: number;
    conversions: number;
    cpa: number;
  }[];
}

export interface MetaAdsData {
  spend: number;
  reach: number;
  engagement: number;
  revenue: number;
  roas: number;
  ctr: number;
  topCreative: {
    name: string;
    views: number;
    engagement: number;
  };
  retargeting: {
    cartAbandoners: number;
    conversionRate: number;
  };
}

export interface EmailMarketingData {
  totalEmailsSent: number;
  openRate: number;
  ctr: number;
  unsubscribeRate: number;
  campaigns: {
    name: string;
    sent: number;
    opened: number;
    clicked: number;
    revenue: number;
  }[];
}

export interface ReferralProgramData {
  totalReferrals: number;
  successfulReferrals: number;
  revenueFromReferred: number;
  conversionRate: number;
  topReferrers: {
    name: string;
    referrals: number;
    coinsEarned: number;
  }[];
}

export interface ContentSeoData {
  bounceRate: number;
  organicTraffic: number;
  avgSessionDuration: string;
  topBlogPosts: {
    title: string;
    traffic: number;
    estimatedRevenue: number;
  }[];
}

export interface SocialMediaData {
  instagram: {
    followers: number;
    engagement: number;
  };
  youtube: {
    subscribers: number;
    monthlyViews: number;
  };
  followerGrowth: {
    month: string;
    instagram: number;
    youtube: number;
  }[];
}

export const marketingOverview: MarketingOverview = {
  overallRoas: 4.2,
  newUsersFromMarketing: 1450,
  emailSubscribers: 15400,
  totalMarketingSpend: 330000,
  revenueAttributed: 1390000
};

export const googleAdsData: GoogleAdsData = {
  spend: 150000,
  clicks: 12500,
  ctr: 3.4,
  roas: 4.5,
  dailyData: [
    { date: "10-07", clicks: 1200, conversions: 45 },
    { date: "11-07", clicks: 1450, conversions: 52 },
    { date: "12-07", clicks: 1100, conversions: 38 },
    { date: "13-07", clicks: 1600, conversions: 65 },
    { date: "14-07", clicks: 1800, conversions: 78 },
    { date: "15-07", clicks: 1950, conversions: 82 }
  ],
  topKeywords: [
    { keyword: "anti acne serum", clicks: 4200, conversions: 180, cpa: 125 },
    { keyword: "board certified dermatologist online", clicks: 2500, conversions: 95, cpa: 190 },
    { keyword: "dry skin gel moisturizer", clicks: 1800, conversions: 72, cpa: 140 },
    { keyword: "best chemical peel india", clicks: 1200, conversions: 44, cpa: 175 }
  ]
};

export const metaAdsData: MetaAdsData = {
  spend: 180000,
  reach: 345000,
  engagement: 48900,
  revenue: 720000,
  roas: 4.0,
  ctr: 1.8,
  topCreative: {
    name: "Video: AI Skin Quiz walkthrough by Dr. Sarah",
    views: 45000,
    engagement: 3400
  },
  retargeting: {
    cartAbandoners: 5400,
    conversionRate: 8.5
  }
};

export const emailMarketingData: EmailMarketingData = {
  totalEmailsSent: 45000,
  openRate: 24.5,
  ctr: 4.2,
  unsubscribeRate: 0.18,
  campaigns: [
    {
      name: "Weekly Newsletter: How to treat adult acne",
      sent: 15000,
      opened: 3800,
      clicked: 650,
      revenue: 45000
    },
    {
      name: "Cart Recovery Email: You left something behind!",
      sent: 5000,
      opened: 2400,
      clicked: 780,
      revenue: 154000
    },
    {
      name: "Promotional Launch: Cetaphil 15% Off Sale",
      sent: 25000,
      opened: 5800,
      clicked: 1200,
      revenue: 220000
    }
  ]
};

export const referralProgramData: ReferralProgramData = {
  totalReferrals: 1250,
  successfulReferrals: 450,
  revenueFromReferred: 675000,
  conversionRate: 36,
  topReferrers: [
    { name: "Kirti Sen", referrals: 24, coinsEarned: 240 },
    { name: "Aria Malhotra", referrals: 18, coinsEarned: 180 },
    { name: "Rahul Deshmukh", referrals: 15, coinsEarned: 150 },
    { name: "Neha Roy", referrals: 12, coinsEarned: 120 }
  ]
};

export const contentSeoData: ContentSeoData = {
  bounceRate: 42,
  organicTraffic: 14500,
  avgSessionDuration: "2m 14s",
  topBlogPosts: [
    {
      title: "The Ultimate Morning Skincare Routine for Combination Skin",
      traffic: 8500,
      estimatedRevenue: 125000
    },
    {
      title: "Salicylic Acid vs Benzoyl Peroxide: Which is best for acne?",
      traffic: 6400,
      estimatedRevenue: 85000
    },
    {
      title: "5 Skin Mistakes You Are Making In Your 20s",
      traffic: 5200,
      estimatedRevenue: 62000
    }
  ]
};

export const socialMediaData: SocialMediaData = {
  instagram: {
    followers: 24500,
    engagement: 4.8
  },
  youtube: {
    subscribers: 15800,
    monthlyViews: 125000
  },
  followerGrowth: [
    { month: "Jan", instagram: 12000, youtube: 8000 },
    { month: "Feb", instagram: 14500, youtube: 9500 },
    { month: "Mar", instagram: 17000, youtube: 11000 },
    { month: "Apr", instagram: 19800, youtube: 12800 },
    { month: "May", instagram: 22000, youtube: 14200 },
    { month: "Jun", instagram: 24500, youtube: 15800 }
  ]
};
