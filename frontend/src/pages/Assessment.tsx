import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const skinTypes = [
  { id: 'dry', label: 'Dry', desc: 'Feels tight, flaky, or rough after washing.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg7sloQB3xl16SUJisAt68jfcj2RbC7weL1I_41DxhPRIwbgdF2YqVAR-xwBqMgSsGJzokCHS4543Ma2fQvGI3b_6lWsDHKmkeOM5b0WVrM1gxxMRGvItn7RN2GUwqDwDKn2vQQC_e7sWaF6iesbcbg3eKsLoFrxvf3YnH8bOSGo02OARc45MUa2FRP-ckwiCC_bDsnQY_yH84W3bG6n58pvi-d6uxQuyc-Y4NHnxIkzBoimep0tus2tTxhKIWFRRVWYPjvyRJclI' },
  { id: 'oily', label: 'Oily', desc: 'Shiny appearance, visible pores, acne-prone.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKMho2M16hwFkT5oGafuEFwNyn4irOHjrZbW7FumblCqrDWexdwbg4zVdH4HOuUHGT4ia0rygHuU-2GOMtJFIlCFP_vbHeZmk40iipIn6JxACBVPUKsYhBxLAfpoin4pEau3Ekzo9CmFAPzBK2fuX0J3eTSb-JjHXjiB_qGf6pSNOh00l-Ixt88JBV2DdztNPYGNmVlNekGkfsGEuu7a1DOzZVsKLDRSnpogvf8boRfRDM54uT29a-ReIXU3qau_sYyaQMKMkoxSQ' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone (nose/forehead), dry cheeks.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG0By3J8hOIGOeaxaksPSSPnL3o59SvspU6gTT4xIAAfAm8EcdM7GoM6VVuhtd7h0EPEEV0j7GdpZSuddSPcX-qHCRgh8zslqtnjjMMhXTmnoPUoMyH3dlu3D7fm1XtTcLCl1BagZRCOKWyCgpxNxHmjSASm_6wVKbuZdcrh0ifdPi_ys-6b6OngjZUiASotU-0fluHYaGjRLjEeoyZf1CXPLtxM_l8ofM1cBQu8Z-D9X2KsZpvusiaiaNSlkFmiCd7yH_DtJt8z8' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts easily to products, prone to redness.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBOdrVvADxRifg3sriw83XGjd4lYDWAwJQxD05TS3eaOSlO7rLGYNFz5q3s0Awu3BXD_rozMm9cADb2_nzTbNedNbG6lcEzF6HBq6vsniCu1uaP6-LBxkeamPIJu4Q0eyBsMN9hH3Eimkq0z3sDSm8q4T_6wC4nVj9oUYvXtDvp-jrreFJnj6KsAhC9nfrnYFuqlHeue_Eb0Ixu7S9kb1WK6A6VjRjfvnffFvAcA6OeyV_y0x9YRk4lnX7y0SqceXpQ3hmh5m3bqg' },
];

const concerns = ['Acne', 'Aging', 'Pigmentation', 'Texture', 'Redness'];

const budgetRanges = [
  { id: 'under-1000', label: 'Under ₹1,000', desc: 'Budget-friendly essentials' },
  { id: '1000-3000', label: '₹1,000 – ₹3,000', desc: 'Quality mid-range products' },
  { id: '3000-5000', label: '₹3,000 – ₹5,000', desc: 'Premium skincare' },
  { id: 'above-5000', label: 'Above ₹5,000', desc: 'Luxury treatments' },
];

const productCategories = [
  { id: 'cleanser', label: 'Cleanser', desc: 'Daily face wash' },
  { id: 'moisturizer', label: 'Moisturizer', desc: 'Hydration & barrier repair' },
  { id: 'serum', label: 'Serum', desc: 'Targeted treatments' },
  { id: 'sunscreen', label: 'Sunscreen', desc: 'UV protection' },
  { id: 'treatment', label: 'Treatment', desc: 'Specialized products' },
  { id: 'mask', label: 'Mask', desc: 'Weekly treatments' },
];

const STEPS = [
  { label: 'Skin Type' },
  { label: 'Concerns' },
  { label: 'Budget' },
  { label: 'Products' },
];

export default function Assessment() {
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [selectedSkin, setSelectedSkin] = useState('oily');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['Aging']);
  const [selectedBudget, setSelectedBudget] = useState('1000-3000');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['cleanser', 'moisturizer']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleConcern = (c: string) => {
    setSelectedConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const toggleCategory = (c: string) => {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const canGoNext = () => {
    if (currentStep === 0) return !!selectedSkin;
    if (currentStep === 1) return selectedConcerns.length > 0;
    if (currentStep === 2) return !!selectedBudget;
    if (currentStep === 3) return selectedCategories.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          skinType: selectedSkin,
          skinConcerns: selectedConcerns.map(c => c.toLowerCase()),
          budget: selectedBudget,
          preferredCategories: selectedCategories
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save assessment');
      }

      navigate('/recommendations');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent w-full">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Skin Analysis</h1>
          <p className="text-slate-500">Our clinical AI will tailor a routine specifically for your skin's unique needs.</p>
        </div>

        {/* === Progress Steps === */}
        <div className="flex items-center justify-between mb-10 max-w-lg mx-auto relative">
          {/* connecting line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-primary/10 z-0" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : isActive
                      ? 'bg-primary text-white ring-4 ring-primary/20 shadow-lg shadow-primary/30'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted
                    ? <span className="material-symbols-outlined text-sm">check</span>
                    : i + 1}
                </div>
                <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* === Step Content Card === */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-6 transition-colors duration-300 min-h-[340px]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* STEP 1 — Skin Type */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-1 dark:text-white">Step 1: Select your skin type</h2>
              <p className="text-sm text-slate-500 mb-6">Choose the description that best fits how your skin feels daily.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {skinTypes.map(st => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedSkin(st.id)}
                    className={`group flex flex-col gap-4 p-4 rounded-xl border-2 text-left outline-none transition-all bg-white dark:bg-slate-700 ${selectedSkin === st.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-600 hover:border-primary/40 hover:shadow-md'}`}
                  >
                    <div className="w-full aspect-square bg-slate-100 dark:bg-slate-600 rounded-lg overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={st.img} alt={st.label} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white">{st.label}</h3>
                        {selectedSkin === st.id && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{st.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Concerns */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-1 dark:text-white">Step 2: Skin Concerns</h2>
              <p className="text-sm text-slate-500 mb-6">Select all that apply. You can choose multiple.</p>
              <div className="flex flex-wrap gap-3">
                {concerns.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleConcern(c)}
                    className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${selectedConcerns.includes(c) ? 'border-2 border-primary bg-primary text-white font-bold shadow-md' : 'border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/40'}`}
                  >
                    {c}
                    {selectedConcerns.includes(c) && <span className="material-symbols-outlined text-xs">close</span>}
                  </button>
                ))}
              </div>
              {selectedConcerns.length === 0 && (
                <p className="text-sm text-amber-500 mt-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Please select at least one concern to continue.
                </p>
              )}
            </div>
          )}

          {/* STEP 3 — Budget */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-1 dark:text-white">Step 3: Budget Range</h2>
              <p className="text-sm text-slate-500 mb-6">What's your monthly skincare budget?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {budgetRanges.map(budget => (
                  <button
                    key={budget.id}
                    onClick={() => setSelectedBudget(budget.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedBudget === budget.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-primary/40'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 dark:text-white">{budget.label}</h3>
                      {selectedBudget === budget.id && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{budget.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Products */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-1 dark:text-white">Step 4: Preferred Products</h2>
              <p className="text-sm text-slate-500 mb-6">Which product types are you most interested in?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {productCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${selectedCategories.includes(category.id) ? 'border-primary bg-primary text-white shadow-md' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/40'}`}
                  >
                    <h4 className="font-medium text-sm">{category.label}</h4>
                    <p className="text-xs opacity-75 mt-1">{category.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* === Navigation Buttons === */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>

          <div className="text-xs text-slate-400 font-medium">
            Step {currentStep + 1} of {STEPS.length}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Next
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !canGoNext()}
              className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  Generate My Routine
                  <span className="material-symbols-outlined">magic_button</span>
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
