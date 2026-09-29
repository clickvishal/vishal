import React from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import {
  Trophy,
  Award,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
} from 'lucide-react';

interface DashboardPageProps {
  onOpenAuth: (initialTab: 'login' | 'signup') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenAuth }) => {
  const { user, firebaseUser, userProfile, attempts, authLoading } = useQuiz();
  const { navigate } = useRouter();

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading user profile...</p>
      </div>
    );
  }

  // Protect Dashboard: Require authentication
  if (!firebaseUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-900/50 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Protected Area
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white">
            User Dashboard
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Please log in or create a free account to access your personal dashboard, track quiz scores, and view performance history.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer shadow-md"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#141f38] border border-slate-800 rounded-full transition-colors cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  const completedCount = attempts.length;
  const avgScore = userProfile.averageScore;
  const totalScore = userProfile.totalScore;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Card */}
      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700 object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-2xl font-bold text-white">
                {userProfile.name}
              </h1>
              {user && (
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  Active Member
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{userProfile.email}</p>
            <p className="text-xs text-slate-500">
              Joined {userProfile.joinedDate} · Quiz Nova Explorer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/categories')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <span>Take New Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {!user && (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#12192e] hover:bg-[#18233f] border border-slate-800 rounded-full transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-900/50 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Completed Quizzes</span>
            <h3 className="text-2xl font-extrabold text-white tabular-nums mt-0.5">
              {completedCount}
            </h3>
          </div>
        </div>

        <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Accuracy</span>
            <h3 className="text-2xl font-extrabold text-white tabular-nums mt-0.5">
              {avgScore}%
            </h3>
          </div>
        </div>

        <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-900/50 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Questions Solved</span>
            <h3 className="text-2xl font-extrabold text-white tabular-nums mt-0.5">
              {totalScore} pts
            </h3>
          </div>
        </div>

        <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-900/50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Mastery Rank</span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {avgScore >= 80 ? 'Master' : avgScore >= 60 ? 'Scholar' : 'Explorer'}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Quiz Attempts List */}
      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Previous Quiz Scores & History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your completed quizzes, historical scores, and time records.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 tabular-nums">
            {attempts.length} Total Attempts
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No Quizzes Completed Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Test your knowledge with one of our featured quizzes to track your performance.
            </p>
            <button
              onClick={() => navigate('/categories')}
              className="mt-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Start Your First Quiz
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {attempts.map((att) => (
              <div
                key={att.id}
                className="p-5 sm:p-6 hover:bg-[#121c33]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-indigo-400">{att.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Completed {formatDate(att.completedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatSeconds(att.timeSpentSeconds)}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{att.quizTitle}</h4>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Score */}
                  <div className="text-right">
                    <div className="text-base font-extrabold text-white tabular-nums">
                      {att.score} / {att.totalQuestions}
                    </div>
                    <div className="text-xs font-medium text-emerald-400 tabular-nums">
                      {att.percentage}% Score
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/results?attemptId=${att.id}`)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#090e1c] hover:bg-[#131d38] border border-slate-800 rounded-full transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => navigate(`/quiz/${att.quizId}`)}
                      className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
