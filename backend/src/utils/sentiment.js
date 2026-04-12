const POSITIVE_KEYWORDS = [
  'love', 'loved', 'excellent', 'amazing', 'perfect', 'great', 'fantastic', 'wonderful',
  'best', 'recommend', 'awesome', 'outstanding', 'brilliant', 'superb', 'impressed',
  'happy', 'satisfied', 'effective', 'works', 'smooth', 'gentle', 'glowing', 'clear',
  'moisturized', 'visible', 'results', 'difference', 'repurchase', 'buying again',
  'good', 'soft', 'improved', 'worth', 'quality', 'nice', 'beautiful', 'radiant'
];

const NEGATIVE_KEYWORDS = [
  'terrible', 'awful', 'horrible', 'waste', 'bad', 'worst', 'hate',
  'broke', 'damaged', 'fake', 'return', 'refund', 'useless', 'irritated', 'burned', 'rash',
  'allergic', 'reaction', 'smell', 'sticky', 'greasy', 'broke out', 'acne', 'pimple',
  'expired', 'leaked', 'no results', 'no difference', 'overpriced', 'scam', 'fraud',
  'disappointing', 'disappointed', 'not working', 'breakout', 'burning', 'stinging'
];

/**
 * Classify sentiment of review text based on keyword matching
 * @param {string} text - Review text to analyze
 * @returns {Object} - { sentiment: 'positive'|'neutral'|'negative', matched: string[] }
 */
export function classifySentiment(text) {
  const lower = text.toLowerCase();
  const positiveMatched = POSITIVE_KEYWORDS.filter(k => lower.includes(k));
  const negativeMatched = NEGATIVE_KEYWORDS.filter(k => lower.includes(k));

  let sentiment = 'neutral';
  if (positiveMatched.length > negativeMatched.length) {
    sentiment = 'positive';
  } else if (negativeMatched.length > positiveMatched.length) {
    sentiment = 'negative';
  } else if (positiveMatched.length === 0 && negativeMatched.length === 0) {
    sentiment = 'neutral';
  }

  return {
    sentiment,
    matched: [...positiveMatched, ...negativeMatched]
  };
}

/**
 * Get keyword frequency from multiple reviews
 * @param {Array} reviews - Array of review objects with sentimentKeywordsMatched
 * @param {string} sentimentFilter - Filter by sentiment type
 * @returns {Array} - Top keywords with counts
 */
export function getKeywordFrequency(reviews, sentimentFilter = null) {
  const keywordCounts = {};
  
  reviews.forEach(review => {
    if (sentimentFilter && review.sentiment !== sentimentFilter) {
      return;
    }
    
    if (review.sentimentKeywordsMatched && Array.isArray(review.sentimentKeywordsMatched)) {
      review.sentimentKeywordsMatched.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    }
  });

  return Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
}
