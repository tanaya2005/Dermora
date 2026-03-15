import React from "react";
import { Link } from "react-router-dom";

export const RegistrationPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[100vh] flex flex-col justify-center items-center font-display text-slate-900 dark:text-black p-4 lg:p-12 relative overflow-hidden">
      {/* Background decorative elements matching login page */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[1000px] bg-white dark:bg-[#15100e] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-primary/10 relative z-10 mx-auto">
        {/* Left side: Image/Branding */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-between bg-zinc-100 dark:bg-zinc-900 relative">
          <img
            alt="Background image of skincare products"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwU7WJ_xR3wJ2A1_uYZz42h4o2G8sX0x8B7L7B2Z1z3Z4aM_yO1x_x3X_3aZ3Y_3_7y1R7K1_2aX3X7aZ4aX_R_O2B2B4aO3R3a_7A3Z7M2b7z7Z7_aB4z3a2M2b7B_y3x_R_O_A_K_wA_O"
          />

          <div className="relative z-10 flex items-center gap-2 text-primary">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">spa</span>
              <span className="font-bold text-xl tracking-tight">Dermora</span>
            </Link>
          </div>

          <div className="relative z-10 mt-20">
            <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
              Join the Dermora
              <br />
              Community
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Create an account to start your personalized skincare journey,
              earn rewards, and secure seamless checkout.
            </p>
          </div>
        </div>

        {/* Right side: Registration Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                className="text-primary hover:underline font-bold"
                to="/login"
              >
                Sign In
              </Link>
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-1.5">
              <label
                className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background-light dark:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                id="name"
                placeholder="Enter your full name"
                required
                type="text"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background-light dark:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                id="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background-light dark:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 pr-12"
                  id="password"
                  placeholder="Create a password"
                  required
                  type="password"
                />
                <button
                  className="absolute right-4 text-slate-400 hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">
                    visibility_off
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-background-light dark:bg-background-dark/50"
                id="terms"
                required
                type="checkbox"
              />
              <label
                className="text-sm font-medium text-slate-600 dark:text-slate-400"
                htmlFor="terms"
              >
                I agree to the{" "}
                <Link to="#" className="text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-[0_8px_30px_rgb(201,125,94,0.3)] hover:shadow-[0_8px_30px_rgb(201,125,94,0.5)] active:scale-[0.98] transition-all"
              type="submit"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              Or Register With
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-bold text-sm">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-bold text-sm">
              <svg
                className="w-5 h-5 dark:fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.84-.2 3.19.46 4.02 1.66-3.32 1.83-2.67 5.75.52 6.94-1.29 2.14-2.51 3.73-3.2 4.37zm-1.84-18.13c-1.14-.07-2.48.51-3.3 1.34-1 .87-1.44 2.17-1.22 3.32 1.25.13 2.51-.55 3.3-1.41.97-1.06 1.4-2.3 1.22-3.25z"></path>
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
