import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import {
  Trophy,
  Share2,
  RotateCcw,
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { searchParams, navigate } = useRouter();
  const { attempts, activeAttempt, getQuizById } = useQuiz();
  const [copiedToast, setCopiedToast] = useState(false);

  const attemptId = searchParams.get('attemptId');
  const attempt =
    (attemptId ? attempts.find((a) => a.id === attemptId) : null) ||
    activeAttempt ||
    attempts[0];

  const quiz = attempt ? getQuizById(attempt.quizId) : undefined;

  if (!attempt || !quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Trophy className="w-12 h-12 text-indigo-400 mx-auto" />
        <h2 className="font-display text-2xl font-bold text-white">No Quiz Results Found</h2>
        <p className="text-sm text-slate-400">
          Take a quiz first to view your score breakdown and insights.
        </p>
        <button
          onClick={() => navigate('/categories')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors cursor-pointer"
        >
          Explore Quizzes
        </button>
      </div>
    );
  }

  const { score, totalQuestions, percentage, answers, timeSpentSeconds } = attempt;
  const incorrectCount = totalQuestions - score;

  const getPerformanceMessage = (pct: number) => {
    if (quiz.isPersonality) {
      return {
        title: 'Cognitive Profile Generated!',
        message: 'Your responses reveal a sharp balance between systematic analysis and visionary curiosity.',
        badge: 'High Cognitive Depth',
      };
    }
    if (pct === 100) {
      return {
        title: 'Outstanding! Flawless Score',
        message: 'You demonstrated comprehensive mastery across every single question.',
        badge: 'Mastery Level',
      };
    }
    if (pct >= 80) {
      return {
        title: 'Great Job! High Intellect',
        message: 'You have a commanding grasp of this subject with excellent analytical recall.',
        badge: 'Advanced Knowledge',
      };
    }
    if (pct >= 50) {
      return {
        title: 'Solid Effort! Good Foundation',
        message: 'You got more than half right. Review the explanations below to seal the gaps.',
        badge: 'Intermediate Scholar',
      };
    }
    return {
      title: 'Keep Exploring & Learning',
      message: 'Every great mind started with curiosity. Dive through the answers below to learn new facts.',
      badge: 'Knowledge Seeker',
    };
  };

  const performance = getPerformanceMessage(percentage);

  const handleShare = async () => {
    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on the "${quiz.title}" on QuizNova! Can you beat my score?`;
    const shareUrl = window.location.origin + `/quiz/${quiz.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My QuizNova Score: ${quiz.title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch (err) {
        console.error('Clipboard copy error:', err);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner Card */}
      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-10 relative overflow-hidden">
        {/* Accent top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{performance.badge}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {performance.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              {performance.message}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span>{quiz.title}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time: {formatTime(timeSpentSeconds)}</span>
              </span>
            </div>
          </div>

          {/* Big Score Ring / Box */}
          <div className="shrink-0 flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-gradient-to-br from-[#121b33] to-[#0a0f1d] border border-indigo-500/30 p-4 text-center shadow-lg">
            <span className="font-display text-4xl font-extrabold text-indigo-400 tabular-nums">
              {percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1 tabular-nums">
              {score} / {totalQuestions} Correct
            </span>
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-center">
          <div className="p-3 bg-[#090d1a] border border-slate-800 rounded-xl">
            <span className="block text-xs text-slate-400">Total Score</span>
            <strong className="text-lg font-bold text-white tabular-nums">{score} pts</strong>
          </div>
          <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 rounded-xl">
            <span className="block text-xs text-emerald-400">Correct Answers</span>
            <strong className="text-lg font-bold tabular-nums">{score}</strong>
          </div>
          <div className="p-3 bg-rose-950/30 border border-rose-900/40 text-rose-300 rounded-xl">
            <span className="block text-xs text-rose-400">Incorrect Answers</span>
            <strong className="text-lg font-bold tabular-nums">{incorrectCount}</strong>
          </div>
          <div className="p-3 bg-[#090d1a] border border-slate-800 rounded-xl">
            <span className="block text-xs text-slate-400">Total Questions</span>
            <strong className="text-lg font-bold text-white tabular-nums">{totalQuestions}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={() => navigate('/categories')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#12192e] hover:bg-[#18233f] border border-slate-800 rounded-full transition-colors cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore More Quizzes</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0b0f1d] border border-slate-800 hover:border-slate-700 rounded-full transition-colors cursor-pointer flex items-center gap-2"
          >
            {copiedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Result</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Question-by-Question Review with Explanations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Review Questions & Explanations
          </h2>
          <span className="text-xs text-slate-400 tabular-nums">
            {totalQuestions} questions reviewed
          </span>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, idx) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="bg-[#0e1424] rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400">
                      Question {idx + 1}
                    </span>
                    <h3 className="text-base font-semibold text-white leading-snug">
                      {q.text}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* 4 Options breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userChoice === optIdx;
                    const isCorrectAnswer = q.correctAnswer === optIdx;

                    let optionStyle = 'border-slate-800 bg-[#090d1a] text-slate-300';
                    if (isCorrectAnswer) {
                      optionStyle = 'border-emerald-800 bg-emerald-950/40 text-emerald-200 font-medium';
                    } else if (isUserChoice && !isCorrect) {
                      optionStyle = 'border-rose-800 bg-rose-950/40 text-rose-200 font-medium';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-400">
                            {['A', 'B', 'C', 'D'][optIdx]}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        <div className="text-[11px] shrink-0 font-medium">
                          {isCorrectAnswer && <span className="text-emerald-400 font-semibold">Correct Answer</span>}
                          {isUserChoice && !isCorrectAnswer && (
                            <span className="text-rose-400 font-semibold">Your Pick</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rich Educational Explanation */}
                <div className="p-3.5 bg-[#090e1c] border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Explanation & Context</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
