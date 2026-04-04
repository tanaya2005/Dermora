import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import AdManager from '../components/AdManager';
import SkinQuizPopup from '../components/SkinQuizPopup';
import { useSkinQuizPopup } from '../hooks/useSkinQuizPopup';

export default function Home() {
  const { isPopupOpen, closePopup } = useSkinQuizPopup();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {/* Skin Quiz Popup */}
      <SkinQuizPopup isOpen={isPopupOpen} onClose={closePopup} />
      
      {/* Advertisement Manager */}
      <AdManager />
      
      {/* Hero Section */}
      
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background-light to-accent-pink/5 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 px-6 py-20 md:py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight dark:text-white transition-colors duration-300">
              Science-Backed <span className="text-primary">Skincare</span> for Everyone
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">
              Discover personalized routines powered by AI and dermatologist expertise. 
              Clean ingredients, clinical results, delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/assessment" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Start Skin Assessment
              </Link>
              <Link to="/products" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-all">
                Shop Products
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6pGceN0yMzgWmfxQkM1u9WHu0rOCUQAN5XFCQADbc0fbmFec43Wg7ws2yAyaRLJ7aheDFsTydSvXZ1D90bIp11xvT2z7WT4I1fBKond_DH_MujiMX3M5tyd7WRvZq5CHNiCaOrQT0yh6E6wyMmrm6aLJJbFxuEX7Dd3kGYgNuxt5BZjtAKZNZ1ACYSDrzLsTnncuFiHlkt4Z9Eqi5dzYCnfg_4bjVA7ygQLxCknvXrEG-MQbT0QMK0J9tEDX8hO9bGOOa3MDAaWM"
                alt="Dermora skincare products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white transition-colors duration-300">Why Choose Dermora?</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors duration-300">
              We combine cutting-edge AI technology with dermatologist expertise to create personalized skincare that actually works.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'auto_awesome', title: 'AI-Powered Analysis', desc: 'Get personalized product recommendations based on your unique skin profile.' },
              { icon: 'verified', title: 'Derm-Approved', desc: 'Every product is formulated and tested by board-certified dermatologists.' },
              { icon: 'eco', title: 'Clean Ingredients', desc: 'Vegan, cruelty-free formulas with clinically-proven active ingredients.' }
            ].map(feature => (
              <div key={feature.title} className="text-center p-8 rounded-2xl bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 dark:bg-primary/30 text-primary mb-4">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black">Ready to Transform Your Skin?</h2>
          <p className="text-xl text-white/90">
            Take our 2-minute assessment and get your personalized routine today.
          </p>
          <Link to="/assessment" className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Get Started Free
          </Link>
        </div>
      </section>

    </div>
  );
}
