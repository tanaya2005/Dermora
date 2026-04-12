import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { skinQuizQuestions, skinAnalysisResults } from '../data/skinAnalysisData';
import { showToast } from '../lib/toast';

const SkinAnalysisPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < skinQuizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Start analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 3000);
    }
  };

  const handleSaveReport = () => {
    showToast.success('Skin report saved to your profile ✓');
  };

  const handleAddToCart = (productName: string) => {
    showToast.success(`${productName} added to cart ✓`);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setIsAnalyzing(false);
  };

  const progress = ((currentQuestion + 1) / skinQuizQuestions.length) * 100;

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            className="w-24 h-24 border-4 border-accent border-t-transparent rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-primary dark:text-secondary mb-4">
            Analyzing Your Skin Profile
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Our AI is processing your responses to create a personalized skincare routine...
          </p>
          <div className="space-y-2 text-sm text-slate-500">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ✓ Analyzing skin type and concerns
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              ✓ Matching with suitable products
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              ✓ Creating personalized routine
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-4">
              Your Personalized Skin Report
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Based on your responses, here's your customized skincare plan
            </p>
          </motion.div>

          {/* Skin Profile Card */}
          <motion.div 
            className="glass-card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
              Your Skin Profile
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-accent">Skin Type</h3>
                <p className="text-2xl font-bold text-primary dark:text-secondary mb-2">
                  {skinAnalysisResults.skinProfile.type}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {skinAnalysisResults.skinProfile.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-accent">Main Concerns</h3>
                <div className="flex flex-wrap gap-2">
                  {skinAnalysisResults.skinProfile.concerns.map((concern, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-3">
                  Sensitivity Level: <span className="font-semibold">{skinAnalysisResults.skinProfile.sensitivity}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recommended Routine */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Morning Routine */}
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">🌅</div>
                <h3 className="text-xl font-semibold text-primary dark:text-secondary">
                  Morning Routine
                </h3>
              </div>
              
              <ol className="space-y-3">
                {skinAnalysisResults.recommendedRoutine.morning.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Evening Routine */}
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">🌙</div>
                <h3 className="text-xl font-semibold text-primary dark:text-secondary">
                  Evening Routine
                </h3>
              </div>
              
              <ol className="space-y-3">
                {skinAnalysisResults.recommendedRoutine.evening.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary dark:bg-secondary text-white dark:text-primary rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* Recommended Products */}
          <motion.div 
            className="glass-card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
              Recommended Products for You
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skinAnalysisResults.recommendedProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-primary dark:text-secondary mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-accent font-bold text-xl">₹{product.price}</div>
                      <div className="flex items-center space-x-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Match Score</span>
                      <span className="text-sm font-semibold text-success">{product.match}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${product.match}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product.name)}
                    className="w-full btn-primary text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Expert Tips */}
          <motion.div 
            className="glass-card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
              Expert Tips for Your Skin Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skinAnalysisResults.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-success/20 text-success rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">💡</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button 
              onClick={handleSaveReport}
              className="btn-primary"
            >
              Save Report to Profile
            </button>
            <button 
              onClick={resetQuiz}
              className="btn-secondary"
            >
              Retake Quiz
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-4">
            AI Skin Analysis
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Get personalized skincare recommendations in just 2 minutes
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
            <motion.div 
              className="bg-accent h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Question {currentQuestion + 1} of {skinQuizQuestions.length}
          </p>
        </motion.div>

        {/* Question Card */}
        <motion.div 
          className="glass-card p-8"
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-8">
            {skinQuizQuestions[currentQuestion].question}
          </h2>
          
          <div className="space-y-4">
            {skinQuizQuestions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="w-full p-4 text-left bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-accent hover:bg-accent/5 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        {currentQuestion > 0 && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button 
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="btn-secondary"
            >
              Previous Question
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalysisPage;