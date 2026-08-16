import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

const OddsPleaseArrow = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M6 18L18 6M18 6H9M18 6V15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('admin@oddsplease.com');
  const [password, setPassword] = useState('oodsplease123');
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      if (cleanEmail === 'admin@oddsplease.com' && password === 'oodsplease123') {
        setIsLoading(false);
        onSuccessLogin();
        onClose();
      } else {
        setIsLoading(false);
        setError('Invalid email or password.');
      }
    }, 350);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage('Password reset link sent to admin@oddsplease.com');
    setTimeout(() => setResetMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-zinc-950 border border-[#FF8C00]/30 rounded-3xl shadow-[0_0_50px_rgba(255,140,0,0.12)] p-8 md:p-10 relative text-white overflow-hidden">

        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-7 right-7 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-zinc-800/80 pb-4">
          <button
            onClick={() => { setMode('login'); setError(null); setResetMessage(null); }}
            className={`text-lg font-bold pb-1.5 transition-colors relative cursor-pointer ${
              mode === 'login' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
            {mode === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8C00] rounded-full" />
            )}
          </button>

          <span className="text-zinc-800 text-lg">|</span>

          <button
            onClick={() => { setMode('signup'); setError(null); setResetMessage(null); }}
            className={`text-lg font-bold pb-1.5 transition-colors relative cursor-pointer ${
              mode === 'signup' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Join Odds Club
            {mode === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8C00] rounded-full" />
            )}
          </button>
        </div>

        {/* SIGN IN FORM */}
        {mode === 'login' ? (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                Welcome Back
              </h2>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#FF8C00]/10 border border-[#FF8C00]/30 text-[#FF8C00] text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@oddsplease.com"
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-base text-white font-medium focus:outline-none focus:border-[#FF8C00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-[#FF8C00] hover:text-[#e07b00] hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-base text-white font-medium focus:outline-none focus:border-[#FF8C00] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full mt-2 py-4 rounded-2xl bg-[#FF8C00] text-black font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#e07b00] disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_25px_rgba(255,140,0,0.25)]"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Odds Club</span>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                      <OddsPleaseArrow className="w-4 h-4 text-black" />
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                Join Odds Club
              </h2>
            </div>

            <button
              onClick={() => {
                setEmail('admin@oddsplease.com');
                setPassword('oodsplease123');
                setMode('login');
              }}
              className="group w-full py-4 rounded-2xl bg-[#FF8C00] text-black font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#e07b00] transition-all cursor-pointer shadow-[0_0_25px_rgba(255,140,0,0.25)]"
            >
              <span>Instant Access</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                <OddsPleaseArrow className="w-4 h-4 text-black" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
