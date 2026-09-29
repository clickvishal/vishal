import React from 'react';
import { useRouter } from '../router/Router';
import { Sparkles, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-900/50 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-indigo-400 tracking-wider">
          ERROR 404
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          The page or quiz you are looking for might have moved, or the URL address was typed incorrectly.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer flex items-center gap-2 shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <button
          onClick={() => navigate('/categories')}
          className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#141f38] border border-slate-800 rounded-full transition-colors cursor-pointer flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Browse All Categories</span>
        </button>
      </div>
    </div>
  );
};
