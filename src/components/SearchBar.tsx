import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const { quizzes } = useQuiz();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredQuizzes = quizzes
    .filter((q) => q.published)
    .filter((q) => {
      if (!trimmed) return false;
      const titleMatch = q.title.toLowerCase().includes(trimmed);
      const categoryMatch = q.category.toLowerCase().includes(trimmed);
      const descMatch = q.description.toLowerCase().includes(trimmed);
      const questionMatch = q.questions.some((qn) =>
        qn.text.toLowerCase().includes(trimmed)
      );
      return titleMatch || categoryMatch || descMatch || questionMatch;
    });

  const handleSelectQuiz = (quizId: string) => {
    onClose();
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0e1628] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quizzes by title, category, or keywords..."
            className="w-full text-base text-white placeholder:text-slate-500 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 bg-slate-800/80 rounded-md cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-800/60">
          {!trimmed && (
            <div className="py-8 text-center">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium text-slate-200">Search 100+ original quiz questions</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching "science", "geography", "history", "algorithm", or "movies"
              </p>
            </div>
          )}

          {trimmed && filteredQuizzes.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-slate-200">No quizzes found matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Check your spelling or explore the categories page directly.
              </p>
            </div>
          )}

          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => handleSelectQuiz(quiz.id)}
              className="py-3 px-3 -mx-1 hover:bg-[#121c33] rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-indigo-400">{quiz.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{quiz.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{quiz.questionCount} Questions</span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {quiz.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">{quiz.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
