import React from 'react';
import { useRouter } from '../router/Router';
import { Sparkles, Brain, Award, Users, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          About Quiz Nova
        </h1>
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Quiz Nova was built to cultivate curiosity, celebrate factual knowledge, and make lifelong learning an engaging, daily intellectual habit.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-10 space-y-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
          The Purpose Behind Quiz Nova
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          In an era flooded with brief soundbites and passive content consumption, true knowledge requires active recall. Quiz Nova provides an intuitive, high-quality quiz platform where people of all ages can test their intellect across core human disciplines—from the frontiers of modern science and astrophysics to world history, literature, geography, and computational logic.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Every single quiz question on Quiz Nova is crafted with four verified options, factual accuracy, and a comprehensive explanation to ensure that every question solved is an opportunity to learn something new.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#0e1424] rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-900/50 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white">Original Curations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Carefully drafted questions that evaluate genuine conceptual understanding, not just trivia fragments.
          </p>
        </div>

        <div className="p-6 bg-[#0e1424] rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white">Fact-Checked Depth</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every answer is corroborated against scientific standards, primary sources, and verified encyclopedias.
          </p>
        </div>

        <div className="p-6 bg-[#0e1424] rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-900/50 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white">Contextual Learning</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gain immediate context with thorough explanations right after finishing every quiz attempt.
          </p>
        </div>
      </div>

      {/* Quality Pledge & CTA */}
      <div className="bg-gradient-to-r from-indigo-950 via-[#121c38] to-purple-950 rounded-3xl border border-slate-800 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display text-xl font-bold">Ready to test your knowledge?</h3>
          <p className="text-xs text-slate-300 max-w-md">
            Jump into our featured quizzes or test yourself with today's daily logic challenge.
          </p>
        </div>
        <button
          onClick={() => navigate('/categories')}
          className="px-6 py-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-md"
        >
          <span>Explore Quizzes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
