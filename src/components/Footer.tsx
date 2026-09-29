import React from 'react';
import { useRouter, Link } from '../router/Router';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#050811] text-slate-400 border-t border-slate-800/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Quiz Nova
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Challenge your mind with thoughtfully curated trivia and knowledge quizzes across science, history, geography, technology, and more.
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              Version 1.0 · Premier Public Platform
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/quiz/brain-challenge')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Daily Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  User Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Quiz Nova
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Management
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Quiz Nova. All rights reserved. Built for knowledge seekers.</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('/terms')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('/disclaimer')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
