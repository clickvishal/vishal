import React from 'react';
import { Quiz } from '../types/quiz';
import { useRouter } from '../router/Router';
import { ArrowRight, Clock, HelpCircle } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  compact?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, compact = false }) => {
  const { navigate } = useRouter();

  const handleStart = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400';
      case 'Hard':
        return 'text-rose-400';
      default:
        return 'text-amber-400';
    }
  };

  // Fallback image if coverImage is not set
  const fallbackImage = '/src/assets/images/quiznova_hero_illustration_1790690726231.jpg';
  const imageSrc = quiz.coverImage || fallbackImage;

  return (
    <div
      onClick={handleStart}
      className="group relative flex flex-col justify-between bg-[#0d1322] border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Top Image Banner with Category Badge Overlay */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
          <img
            src={imageSrc}
            alt={quiz.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322]/80 via-transparent to-black/20" />

          {/* Floating Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-200 shadow-sm">
              {quiz.category}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 pb-3">
          <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
            {quiz.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {quiz.description}
          </p>
        </div>
      </div>

      {/* Card Footer matching reference Image 2 */}
      <div className="px-5 pb-5 pt-2 flex items-end justify-between border-t border-slate-800/60 mt-auto">
        {/* Left Side: Time and Difficulty */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">{quiz.estimatedTime}</span>
          </div>
          <div className={`text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </div>
        </div>

        {/* Right Side: Questions Count and Start Quiz Link */}
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">{quiz.questionCount} Questions</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
            <span>Start Quiz</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
