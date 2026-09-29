import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdmin } = useQuiz();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already authenticated admin, redirect to /admin
  if (isAdmin) {
    navigate('/admin');
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(
        err.message || 'Authentication failed or account does not possess administrator privileges.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0e1628] rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400" />

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Site</span>
          </button>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Restricted Access
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">
            Admin Portal Login
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with authorized administrator credentials to manage platform quizzes.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Admin Email Address
              </label>
              <button
                type="button"
                onClick={() => setEmail('clickbanknewbing@gmail.com')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer"
              >
                Use Root Admin Email
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quiznova.app"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying Authorization...</span>
              </>
            ) : (
              <span>Authenticate as Admin</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Authorization is strictly validated against the Firestore <code className="text-slate-400">admins/&#123;uid&#125;</code> collection.
          </p>
        </div>
      </div>
    </div>
  );
};
