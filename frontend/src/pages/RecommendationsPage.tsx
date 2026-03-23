import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProductCard } from '../components/ProductCard';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  sellerId: {
    name: string;
    email: string;
  };
  recommendationReason?: string;
}

interface SkinProfile {
  skinType: string;
  skinConcerns: string[];
  budget: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [navigate]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsAssessment) {
          navigate('/assessment');
          return;
        }
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      setRecommendations(data.recommendations);
      setSkinProfile(data.skinProfile);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  const retakeAssessment = () => {
    navigate('/assessment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={retakeAssessment}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Your Personalized Recommendations
          </h1>
          <p className="text-lg text-slate-600">
            Based on your skin assessment, we've curated the perfect products for you
          </p>
        </div>

        {/* Skin Profile Summary */}
        {skinProfile && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Your Skin Profile</h2>
              <button 
                onClick={retakeAssessment}
                className="text-primary hover:underline text-sm font-medium"
              >
                Retake Assessment
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-700 mb-1">Skin Type</h3>
                <p className="text-primary font-bold capitalize">{skinProfile.skinType}</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-700 mb-1">Main Concerns</h3>
                <p className="text-primary font-bold">
                  {skinProfile.skinConcerns.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                </p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-700 mb-1">Budget</h3>
                <p className="text-primary font-bold">
                  {skinProfile.budget === 'under-1000' && 'Under ₹1,000'}
                  {skinProfile.budget === '1000-3000' && '₹1,000 - ₹3,000'}
                  {skinProfile.budget === '3000-5000' && '₹3,000 - ₹5,000'}
                  {skinProfile.budget === 'above-5000' && 'Above ₹5,000'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Recommended Products ({recommendations.length})
              </h2>
              <Link 
                to="/products"
                className="text-primary hover:underline font-medium"
              >
                Browse All Products →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((product) => (
                <div key={product._id} className="relative">
                  <Link to={`/products/${product._id}`}>
                    <ProductCard
                      id={product._id}
                      name={product.title}
                      description={product.description}
                      price={product.price}
                      size="50ml"
                      rating={4.5}
                      reviews={0}
                      image={product.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'}
                      recommended={true}
                      newArrival={false}
                    />
                  </Link>
                  {product.recommendationReason && (
                    <div className="mt-2 p-2 bg-primary/10 rounded-lg">
                      <p className="text-xs text-primary font-medium">
                        💡 {product.recommendationReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No recommendations found</h3>
            <p className="text-slate-600 mb-6">
              We couldn't find products matching your skin profile. Try updating your assessment.
            </p>
            <button 
              onClick={retakeAssessment}
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Update Assessment
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Need Expert Advice?</h3>
          <p className="text-primary-100 mb-6">
            Consult with our dermatologists for personalized skincare guidance
          </p>
          <Link 
            to="/consult"
            className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}