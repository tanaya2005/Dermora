export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface ProductRecommendation {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  match: number;
}

export interface SkinAnalysisResults {
  skinProfile: {
    type: string;
    description: string;
    concerns: string[];
    sensitivity: string;
  };
  recommendedRoutine: {
    morning: string[];
    evening: string[];
  };
  recommendedProducts: ProductRecommendation[];
  tips: string[];
}

export const skinQuizQuestions: QuizQuestion[] = [
  {
    question: "How would you describe the shine on your face during midday?",
    options: [
      "Shiny all over my face (oil slick feeling)",
      "Shiny only in the T-zone (forehead, nose, chin)",
      "Mostly dry, flaky, or tight feeling",
      "Normal and comfortable, no major shine or dry patches"
    ]
  },
  {
    question: "How does your skin react to new skincare products?",
    options: [
      "Rarely reacts, I can use almost anything",
      "Occasionally gets slightly red or tingles",
      "Frequently gets red, itchy, or breaks out",
      "Reacts primarily to heavy, pore-clogging products"
    ]
  },
  {
    question: "What is your primary skincare concern?",
    options: [
      "Acne breakouts and clogged pores",
      "Hyperpigmentation, dark spots, or uneven tone",
      "Fine lines, wrinkles, and loss of elasticity",
      "Redness, irritation, and compromised barrier"
    ]
  }
];

export const skinAnalysisResults: SkinAnalysisResults = {
  skinProfile: {
    type: "Combination Skin",
    description: "Your skin shows excess sebum production in the T-zone (forehead, nose, and chin) and normal-to-dry characteristics on the cheeks.",
    concerns: ["T-zone Shine", "Occasional Acne", "Mild Redness"],
    sensitivity: "Moderate"
  },
  recommendedRoutine: {
    morning: [
      "Gentle Foaming Cleanser: Cleanse to remove overnight oil buildup without stripping cheeks.",
      "Hydrating Toner: Balance skin pH and prep for active serums.",
      "Niacinamide Serum (5%): Regulate sebum production in T-zone while strengthening the skin barrier.",
      "Lightweight Gel-Cream Moisturizer: Hydrate dry zones without clogging oily patches.",
      "SPF 50+ Sunscreen: Shield skin from UV rays to prevent premature aging and hyperpigmentation."
    ],
    evening: [
      "Salicylic Acid Cleanser: Deeply cleanse pores, focusing on the T-zone.",
      "Hyaluronic Acid Serum: Bind moisture to skin cells for overnight hydration.",
      "Retinol Cream (0.2%): Promote cell turnover and address occasional breakouts.",
      "Barrier Repair Cream: Provide nourishment to cheeks and restore barrier strength overnight."
    ]
  },
  recommendedProducts: [
    {
      id: "prod-1",
      name: "Dermora Foaming Cleanser",
      category: "Cleanser",
      price: 349,
      rating: 4.6,
      match: 95
    },
    {
      id: "prod-2",
      name: "Dermora Niacinamide Serum",
      category: "Serum",
      price: 499,
      rating: 4.8,
      match: 92
    },
    {
      id: "prod-3",
      name: "Dermora Gel Moisturizer",
      category: "Moisturizer",
      price: 399,
      rating: 4.7,
      match: 88
    }
  ],
  tips: [
    "Use multi-masking techniques: apply clay masks only on the T-zone, and hydrating masks on the cheeks.",
    "Avoid harsh physical scrubs which can stimulate excess oil production and irritate cheeks.",
    "Apply lightweight gel layers first, followed by heavier creams only on dry areas.",
    "Wash your face with lukewarm water, as hot water strips moisture and triggers oil glands."
  ]
};
