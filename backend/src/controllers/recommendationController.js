import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * Get personalized product recommendations
 * GET /api/recommendations
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's skin profile
    const user = await User.findById(userId).select('skinProfile');
    if (!user || !user.skinProfile || !user.skinProfile.assessmentCompleted) {
      return res.status(400).json({ 
        error: 'Please complete your skin assessment first',
        needsAssessment: true 
      });
    }

    const { skinType, skinConcerns, budget, preferredCategories } = user.skinProfile;

    // Rule-based recommendation logic
    const recommendationKeywords = getRecommendationKeywords(skinType, skinConcerns);
    
    // Build search query for products
    const searchQuery = {
      $or: [
        { title: { $regex: recommendationKeywords.join('|'), $options: 'i' } },
        { description: { $regex: recommendationKeywords.join('|'), $options: 'i' } }
      ],
      stock: { $gt: 0 } // Only in-stock products
    };

    // Add budget filter if specified
    if (budget && budget !== 'above-5000') {
      const budgetRanges = {
        'under-1000': { $lt: 1000 },
        '1000-3000': { $gte: 1000, $lt: 3000 },
        '3000-5000': { $gte: 3000, $lt: 5000 }
      };
      searchQuery.price = budgetRanges[budget];
    }

    // Get recommended products
    const recommendedProducts = await Product.find(searchQuery)
      .populate('sellerId', 'name email')
      .limit(12)
      .sort({ createdAt: -1 });

    // If no specific matches, get popular products
    let fallbackProducts = [];
    if (recommendedProducts.length < 6) {
      fallbackProducts = await Product.find({ 
        stock: { $gt: 0 },
        _id: { $nin: recommendedProducts.map(p => p._id) }
      })
      .populate('sellerId', 'name email')
      .limit(6 - recommendedProducts.length)
      .sort({ createdAt: -1 });
    }

    const allRecommendations = [...recommendedProducts, ...fallbackProducts];

    // Add recommendation reasons
    const recommendationsWithReasons = allRecommendations.map(product => ({
      ...product.toObject(),
      recommendationReason: getRecommendationReason(product, skinType, skinConcerns)
    }));

    res.json({
      recommendations: recommendationsWithReasons,
      skinProfile: {
        skinType,
        skinConcerns,
        budget
      },
      totalCount: recommendationsWithReasons.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recommendation keywords based on skin type and concerns
 */
function getRecommendationKeywords(skinType, skinConcerns) {
  const keywords = [];

  // Skin type based keywords
  const skinTypeKeywords = {
    'oily': ['oil-free', 'niacinamide', 'salicylic', 'clay', 'mattifying', 'pore'],
    'dry': ['hyaluronic', 'ceramide', 'moisturizing', 'hydrating', 'barrier', 'cream'],
    'combination': ['balancing', 'gentle', 'hydrating', 'oil-free', 'lightweight'],
    'sensitive': ['gentle', 'fragrance-free', 'soothing', 'aloe', 'calming', 'mild'],
    'baby': ['baby', 'gentle', 'mild', 'hypoallergenic', 'tear-free', 'infant', 'newborn']
  };

  if (skinTypeKeywords[skinType]) {
    keywords.push(...skinTypeKeywords[skinType]);
  }

  // Skin concerns based keywords
  const concernKeywords = {
    'acne': ['acne', 'salicylic', 'niacinamide', 'tea tree', 'anti-bacterial', 'pore'],
    'aging': ['retinol', 'anti-aging', 'collagen', 'peptide', 'vitamin c', 'firming'],
    'pigmentation': ['vitamin c', 'brightening', 'dark spot', 'even tone', 'kojic', 'arbutin'],
    'texture': ['exfoliating', 'aha', 'bha', 'smooth', 'resurfacing', 'glycolic'],
    'redness': ['soothing', 'calming', 'anti-inflammatory', 'centella', 'green tea', 'niacinamide'],
    'diaper rash': ['diaper', 'rash', 'zinc', 'calendula', 'protective', 'barrier'],
    'dryness': ['moisturizing', 'hydrating', 'dry skin', 'barrier', 'ceramide', 'hyaluronic'],
    'eczema': ['eczema', 'sensitive', 'fragrance-free', 'hypoallergenic', 'gentle', 'soothing']
  };

  skinConcerns.forEach(concern => {
    if (concernKeywords[concern]) {
      keywords.push(...concernKeywords[concern]);
    }
  });

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate recommendation reason for a product
 */
function getRecommendationReason(product, skinType, skinConcerns) {
  const reasons = [];

  // Check if product matches skin type
  const productText = `${product.title} ${product.description}`.toLowerCase();
  
  if (skinType === 'oily' && (productText.includes('oil-free') || productText.includes('oily'))) {
    reasons.push(`Perfect for ${skinType} skin`);
  } else if (skinType === 'dry' && (productText.includes('hydrat') || productText.includes('moistur'))) {
    reasons.push(`Great for ${skinType} skin hydration`);
  } else if (skinType === 'sensitive' && (productText.includes('gentle') || productText.includes('soothing'))) {
    reasons.push(`Gentle formula for ${skinType} skin`);
  } else if (skinType === 'baby' && (productText.includes('baby') || productText.includes('gentle') || productText.includes('mild'))) {
    reasons.push(`Safe and gentle for baby's delicate skin`);
  }

  // Check if product addresses concerns
  skinConcerns.forEach(concern => {
    if (concern === 'acne' && (productText.includes('acne') || productText.includes('salicylic'))) {
      reasons.push('Helps with acne concerns');
    } else if (concern === 'aging' && (productText.includes('anti-aging') || productText.includes('retinol'))) {
      reasons.push('Anti-aging benefits');
    } else if (concern === 'pigmentation' && (productText.includes('brightening') || productText.includes('vitamin c'))) {
      reasons.push('Brightens and evens skin tone');
    } else if (concern === 'diaper rash' && (productText.includes('diaper') || productText.includes('rash') || productText.includes('protective'))) {
      reasons.push('Helps prevent and treat diaper rash');
    } else if (concern === 'eczema' && (productText.includes('eczema') || productText.includes('hypoallergenic'))) {
      reasons.push('Suitable for eczema-prone skin');
    } else if (concern === 'dryness' && (productText.includes('moistur') || productText.includes('hydrat'))) {
      reasons.push('Provides deep hydration for dry skin');
    }
  });

  return reasons.length > 0 ? reasons[0] : `Recommended for your skin type`;
}