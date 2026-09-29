import React from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import { CATEGORIES_DATA } from '../data/quizzes';
import { QuizCard } from '../components/QuizCard';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Compass,
  Atom,
  Cpu,
  Landmark,
  Globe2,
  Trophy,
  Film,
  Calendar,
  Clock,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch }) => {
  const { navigate } = useRouter();
  const { quizzes } = useQuiz();

  const publishedQuizzes = quizzes.filter((q) => q.published);

  // Curations
  const featuredQuizzes = publishedQuizzes.filter((q) => q.featured).slice(0, 3);
  const dailyQuiz = publishedQuizzes.find((q) => q.isDaily) || publishedQuizzes[0];
  const popularQuizzes = publishedQuizzes.filter((q) => q.popular).slice(0, 3);
  const recentQuizzes = [...publishedQuizzes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Category Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'Globe2':
        return <Globe2 className="w-5 h-5 text-blue-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-rose-400" />;
      case 'Film':
        return <Film className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleStartPrimary = () => {
    if (dailyQuiz) {
      navigate(`/quiz/${dailyQuiz.id}`);
    } else if (publishedQuizzes.length > 0) {
      navigate(`/quiz/${publishedQuizzes[0].id}`);
    } else {
      navigate('/categories');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section (Exact Match to Reference Screenshot 1) */}
      <section className="relative pt-12 md:pt-20 pb-8 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Floating Kicker Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1424]/90 border border-slate-800 text-xs text-slate-300 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>The Premier Public Quiz Platform</span>
          <span className="text-indigo-400 font-bold">*</span>
        </div>

        {/* Headline: Exact match to Screenshot 1 */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-5">
          Challenge Your Mind. <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Discover Something New.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Test your knowledge with fun, engaging quizzes across multiple categories.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <button
            onClick={handleStartPrimary}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Start a Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-[#0f172a] hover:bg-[#162035] border border-slate-700/80 rounded-full transition-colors cursor-pointer"
          >
            Explore Categories
          </button>
        </div>

        {/* 4 Stats Cards Row (Exact Match to Screenshot 1) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-[#0e1424]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-center shadow-md backdrop-blur-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              10+
            </h3>
            <p className="text-xs text-slate-400 mt-1">Complete Quizzes</p>
          </div>

          <div className="bg-[#0e1424]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-center shadow-md backdrop-blur-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              100+
            </h3>
            <p className="text-xs text-slate-400 mt-1">Original Questions</p>
          </div>

          <div className="bg-[#0e1424]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-center shadow-md backdrop-blur-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              8
            </h3>
            <p className="text-xs text-slate-400 mt-1">Unique Categories</p>
          </div>

          <div className="bg-[#0e1424]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-center shadow-md backdrop-blur-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              100%
            </h3>
            <p className="text-xs text-slate-400 mt-1">Instant Explanations</p>
          </div>
        </div>
      </section>

      {/* 2. Featured Quizzes Section (Exact Match to Reference bottom) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HANDPICKED EXCELLENCE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Featured Quizzes
            </h2>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* 3. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[11px] font-semibold text-indigo-400 tracking-widest uppercase mb-1">
            EXPLORE BY DISCIPLINE
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Test your knowledge across science, history, geography, tech, and entertainment.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_DATA.map((cat) => {
            const count = publishedQuizzes.filter((q) => q.category === cat.name).length;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/categories?category=${encodeURIComponent(cat.name)}`)}
                className="group p-5 bg-[#0e1424] hover:bg-[#121a30] rounded-2xl border border-slate-800/90 hover:border-indigo-500/60 shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 tabular-nums">
                    {count} {count === 1 ? 'Quiz' : 'Quizzes'} available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Daily Quiz Section */}
      {dailyQuiz && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0e162a] via-[#101b33] to-[#0a0f1e] border border-slate-800 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Today's Daily Challenge</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  {dailyQuiz.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {dailyQuiz.description} Tackle 10 mind-bending logic and deduction questions curated for today.
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Est. {dailyQuiz.estimatedTime}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>{dailyQuiz.questionCount} Questions</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-amber-400">{dailyQuiz.difficulty} Difficulty</span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => navigate(`/quiz/${dailyQuiz.id}`)}
                    className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Play Today's Daily Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg aspect-4/3 bg-slate-900">
                  <img
                    src="/src/assets/images/quiznova_daily_challenge_1790690740631.jpg"
                    alt="Daily Quiz Award illustration"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Popular Quizzes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] font-semibold text-indigo-400 tracking-widest uppercase mb-1">
              COMMUNITY PICKS
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Popular Quizzes
            </h2>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* 6. Recently Added Quizzes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] font-semibold text-indigo-400 tracking-widest uppercase mb-1">
              FRESH QUESTIONS
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Recently Added Quizzes
            </h2>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Browse Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>
    </div>
  );
};
