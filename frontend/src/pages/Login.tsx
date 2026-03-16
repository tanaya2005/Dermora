import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-display overflow-x-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
        
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-20 text-white">
          <h1 className="font-serif text-6xl mb-4 italic">Dermora</h1>
          <p className="text-xl max-w-md font-light leading-relaxed">
            "The science of soft skin starts with the purity of nature."
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-24">
        <div className="w-full max-w-md rounded-xl shadow-2xl shadow-primary/10 p-8 lg:p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="lg:hidden font-serif text-3xl text-primary mb-6">Dermora</div>
            <div className="flex w-full border-b border-primary/10 mb-8">
              <button className="flex-1 pb-4 text-sm font-bold border-b-2 border-primary text-primary">Login</button>
              <Link to="/register" className="flex-1 pb-4 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-primary transition-colors text-center">Register</Link>
            </div>
            <h2 className="text-2xl font-serif text-slate-900 text-center mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-500 text-center">Enter your credentials to access your skincare ritual.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">Email Address</label>
              <input
                className="w-full h-12 bg-background-light border-none rounded-lg px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="hello@example.com"
                type="email"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot?</a>
              </div>
              <div className="relative group">
                <input
                  className="w-full h-12 bg-background-light border-none rounded-lg px-4 pr-12 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4">
              Sign In
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center h-12 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Google</span>
            </button>
            <button className="flex items-center justify-center h-12 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.671-1.48 3.671-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.039 2.48-4.5 2.597-4.571-1.428-2.09-3.649-2.325-4.402-2.364-1.585-.13-3.416 1.065-3.896 1.065zM15.5 1c-1.013.078-2.234.701-2.961 1.558-.65.766-1.221 1.883-1.026 3.013 1.13.091 2.285-.559 2.986-1.39.675-.792 1.208-1.922 1-3.181z" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Apple</span>
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By continuing, you agree to Dermora's{' '}
              <a className="text-primary hover:underline" href="#">Terms of Service</a> and{' '}
              <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
