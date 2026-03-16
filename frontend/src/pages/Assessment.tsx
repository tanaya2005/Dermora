import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from '../components/Logo';
const skinTypes = [
  { id: 'dry', label: 'Dry', desc: 'Feels tight, flaky, or rough after washing.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg7sloQB3xl16SUJisAt68jfcj2RbC7weL1I_41DxhPRIwbgdF2YqVAR-xwBqMgSsGJzokCHS4543Ma2fQvGI3b_6lWsDHKmkeOM5b0WVrM1gxxMRGvItn7RN2GUwqDwDKn2vQQC_e7sWaF6iesbcbg3eKsLoFrxvf3YnH8bOSGo02OARc45MUa2FRP-ckwiCC_bDsnQY_yH84W3bG6n58pvi-d6uxQuyc-Y4NHnxIkzBoimep0tus2tTxhKIWFRRVWYPjvyRJclI' },
  { id: 'oily', label: 'Oily', desc: 'Shiny appearance, visible pores, acne-prone.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKMho2M16hwFkT5oGafuEFwNyn4irOHjrZbW7FumblCqrDWexdwbg4zVdH4HOuUHGT4ia0rygHuU-2GOMtJFIlCFP_vbHeZmk40iipIn6JxACBVPUKsYhBxLAfpoin4pEau3Ekzo9CmFAPzBK2fuX0J3eTSb-JjHXjiB_qGf6pSNOh00l-Ixt88JBV2DdztNPYGNmVlNekGkfsGEuu7a1DOzZVsKLDRSnpogvf8boRfRDM54uT29a-ReIXU3qau_sYyaQMKMkoxSQ' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone (nose/forehead), dry cheeks.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG0By3J8hOIGOeaxaksPSSPnL3o59SvspU6gTT4xIAAfAm8EcdM7GoM6VVuhtd7h0EPEEV0j7GdpZSuddSPcX-qHCRgh8zslqtnjjMMhXTmnoPUoMyH3dlu3D7fm1XtTcLCl1BagZRCOKWyCgpxNxHmjSASm_6wVKbuZdcrh0ifdPi_ys-6b6OngjZUiASotU-0fluHYaGjRLjEeoyZf1CXPLtxM_l8ofM1cBQu8Z-D9X2KsZpvusiaiaNSlkFmiCd7yH_DtJt8z8' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts easily to products, prone to redness.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBOdrVvADxRifg3sriw83XGjd4lYDWAwJQxD05TS3eaOSlO7rLGYNFz5q3s0Awu3BXD_rozMm9cADb2_nzTbNedNbG6lcEzF6HBq6vsniCu1uaP6-LBxkeamPIJu4Q0eyBsMN9hH3Eimkq0z3sDSm8q4T_6wC4nVj9oUYvXtDvp-jrreFJnj6KsAhC9nfrnYFuqlHeue_Eb0Ixu7S9kb1WK6A6VjRjfvnffFvAcA6OeyV_y0x9YRk4lnX7y0SqceXpQ3hmh5m3bqg' },
];

const concerns = ['Acne', 'Aging', 'Pigmentation', 'Texture', 'Redness'];

const recommendations = [
  { category: 'Cleanser', categoryColor: 'text-accent-purple', name: 'pH Balancing Gel', desc: 'Removes excess oil without stripping moisture.', price: '$28.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBFQNCroViQx9wyOrLZAWn3JAT7aAW93du2PobwpUaPDPbfXGhfxNpPQsxNlA2C6lLIKQvEYGXGB7X3C2UOcn6iRMFHWDqPWmp_jRc0tU_TuUBYgMYRlA3ElkgMqCQAOk34wuIzfw1OMbK7cRS2aShMUq4-QgUDduPimgq2HaSDdW-lV-yo4GsQNn2-weNsKexrck19YsuAIm9ODL1N3pyeTXo5mp4GBg8iVAsJ6e16-UvPEGti-EhzPwiqR5Xus-hMr0SdAiq-yA' },
  { category: 'Treatment', categoryColor: 'text-accent-pink', name: 'Clinical Retinoid 1%', desc: 'Targets fine lines and skin cell turnover.', price: '$42.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRY6qhpjecXvRglsyY2VD5AqzgT-RS1eUfIoZWKXVUOk4DlMaxJo3kNZUEFikIs8zino5e9lb6j8jLkSA4S4RWr7dPsRim0e9JaE2glET7utWNgeUwVx5zwRADy4r62kFrV6e4248PXQLRr9piJMd6OtL0G9F5d8tERmiOTAR_cSaUrLxFY-5pEB3tQzmIc-oU5pVTdcMVva3BTR_QwRWITAQJg7WUsf3NJ-g4nU1mw7L9ZbIbUXT5lMMxblEI68q57l0-e23AeF8' },
  { category: 'Hydration', categoryColor: 'text-primary', name: 'Ceramide Cloud Cream', desc: 'Deeply repairs the skin barrier overnight.', price: '$34.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnRucv9jSDSWMndq2e07ahzBnNBwvn-QbvS9swjkDgQePtWLCJlBy7-toeofB2THmjJa8-yfTBjT8uHPy-nQqQn8TwQKiuAucyFk4un_jlXC4pZcA0rBqB1cQplACHnI37YN-kjRGcPgZoAWyf1jQAhIRPcQhBqgwNKHKBmJqAZ0UUKMeT0Twseg10FBTMZuDbTbirM42q8vOCzTorRd9SOGfSnGC1qwxlejMvEAUT8yPmwjoAKOCyFFyIhtF4uWKbs_GoLr9Llt8' },
];

export default function Assessment() {
  const [selectedSkin, setSelectedSkin] = useState('oily');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['Aging']);

  const toggleConcern = (c: string) => {
    setSelectedConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  return (
    <div className="bg-transparent w-full">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Skin Analysis</h1>
          <p className="text-slate-500">Our clinical AI will tailor a routine specifically for your skin's unique needs.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/10 -translate-y-1/2 z-0" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs font-medium">Type</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="size-8 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs font-medium">Concerns</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="size-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs font-medium">Photo</span>
          </div>
        </div>

        <section className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-12 transition-colors duration-300">
          {/* Skin Type */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-1 dark:text-white transition-colors duration-300">Step 1: Select your skin type</h2>
            <p className="text-sm transition-colors duration-300">Choose the description that best fits how your skin feels daily.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {skinTypes.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedSkin(st.id)}
                className={`group flex flex-col gap-4 p-4 rounded-xl border-2 text-left outline-none transition-all bg-white dark:bg-slate-700 ${selectedSkin === st.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-600 hover:border-primary/40 hover:shadow-md'}`}
              >
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-600 rounded-lg overflow-hidden transition-colors duration-300">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={st.img} alt={st.label} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-white transition-colors duration-300">{st.label}</h3>
                    {selectedSkin === st.id && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">{st.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Concerns */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-1 dark:text-white transition-colors duration-300">Step 2: Skin Concerns</h2>
            <div className="flex flex-wrap gap-3 mt-4">
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
          </div>

          {/* Photo Upload */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 dark:text-white transition-colors duration-300">Step 3: Clinical Photo (Optional)</h2>
            <div className="w-full border-2 border-dashed border-primary/30 dark:border-primary/50 rounded-xl p-10 flex flex-col items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer group">
              <div className="size-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-white transition-colors duration-300">Drag &amp; drop or click to upload</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-300">Our AI analyzes texture, tone, and congestion. Private &amp; Secure.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="w-full md:w-auto px-12 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
              Generate My Routine
              <span className="material-symbols-outlined">magic_button</span>
            </button>
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white transition-colors duration-300">Personalized Recommendations</h2>
            <Link className="text-primary text-sm font-bold flex items-center gap-1" to="/products">
              View Full Routine <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(r => (
              <div key={r.name} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="aspect-square bg-slate-50 dark:bg-slate-700 rounded-lg mb-4 overflow-hidden transition-colors duration-300">
                  <img className="w-full h-full object-cover" src={r.img} alt={r.name} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${r.categoryColor}`}>{r.category}</span>
                  <h4 className="font-bold text-slate-800 dark:text-white transition-colors duration-300">{r.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">{r.desc}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-primary">{r.price}</span>
                    <button className="size-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md">
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
