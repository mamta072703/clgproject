import React, { useState } from 'react';
import { Sparkles, Terminal, Code, Award } from 'lucide-react';

interface AuthLayoutProps {
  onLogin: (email: string, name: string) => void;
}

export default function AuthLayout({ onLogin }: AuthLayoutProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(email, name || email.split('@')[0]);
  };

  const handleOAuthLogin = (provider: string) => {
    // Elegant simulation of Enterprise Google OAuth authentication state transitions
    const demoEmail = provider === 'google' ? 'mamtachoudhary072703@gmail.com' : 'engineer@codequest.io';
    const demoName = provider === 'google' ? 'Mamta Choudhary' : 'Quest Developer';
    onLogin(demoEmail, demoName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Dynamic ambient grid backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative z-10 transition-all duration-300">
        
        {/* CodeQuest Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl space-x-1.5 shadow-lg shadow-indigo-500/15 mb-4 group hover:scale-105 transition-transform duration-300">
            <Code className="h-6 w-6 text-indigo-100" />
            <Sparkles className="h-5 w-5 text-indigo-300 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            CodeQuest
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Personalized AI Coding Intelligence & Gamification
          </p>
        </div>

        {showForgot ? (
          <div>
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Reset Password</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter your registered email address and we will forward an enterprise reset token.
            </p>
            {forgotSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm mb-6">
                Recovery email issued! Check your sandbox Inbox.
              </div>
            ) : null}
            <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-500/20"
              >
                Send Request
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotSent(false); }}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Return to Login
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Full Name (Optional)
                </label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRegistering ? "Your Name" : "Display Name"}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-500/15"
            >
              {isRegistering ? 'Create Account' : 'Authenticate Session'}
            </button>

            {/* Simulated Google SSO Federated Access Control */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800/80"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-3 text-slate-500">Or Federated Access</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-2.5 bg-slate-950 border border-slate-800 text-slate-200 hover:bg-slate-850 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition"
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                {isRegistering ? 'Already registered? Log in' : 'New to CodeQuest? Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
