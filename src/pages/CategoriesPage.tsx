import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import { CATEGORIES_DATA } from '../data/quizzes';
import { QuizCard } from '../components/QuizCard';
import { CategoryType, Difficulty } from '../types/quiz';
import { Search, X, Sparkles, Filter } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { searchParams, navigate } = useRouter();
  const { quizzes } = useQuiz();

  const initialCat = (searchParams.get('category') as CategoryType) || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const publishedQuizzes = quizzes.filter((q) => q.published);

  // Filter quizzes based on category, difficulty, and search keyword
  const filteredQuizzes = publishedQuizzes.filter((quiz) => {
    const matchesCategory =
      selectedCategory === 'All' || quiz.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || quiz.difficulty === selectedDifficulty;
    const matchesSearch =
      !searchTerm.trim() ||
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchTerm('');
    navigate('/categories');
  };

  const allCategories = ['All', ...CATEGORIES_DATA.map((c) => c.name)];
  const difficulties: ('All' | Difficulty)[] = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Filter Controls Row (Exact Match to Reference Screenshot 2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Left: Filter input by title or keyword */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title or keyword..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#0e1424] border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:bg-[#121a30] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Difficulty Segmented Control (Exact Match to Screenshot 2) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Difficulty:</span>
          </div>
          <div className="flex items-center bg-[#0d1424] border border-slate-800 rounded-full p-1">
            {difficulties.map((diff) => {
              const isActive = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count =
            cat === 'All'
              ? publishedQuizzes.length
              : publishedQuizzes.filter((q) => q.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#0e1424] text-slate-400 hover:text-white hover:bg-[#121a30] border border-slate-800'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Showing Quizzes Header (Exact Match to Reference Screenshot 2) */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">
          Showing <span className="text-white font-bold tabular-nums">{filteredQuizzes.length}</span> quizzes
        </span>
        {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchTerm) && (
          <button
            onClick={clearFilters}
            className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* 3-Column Quizzes Grid (Exact Match to Screenshot 2) */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-[#0e1424] rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="font-display text-lg font-bold text-white">No quizzes matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or difficulty filter to discover more quizzes.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};
