import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { getQuizById, recordAttempt } = useQuiz();

  const quizId = params.id;
  const quiz = quizId ? getQuizById(quizId) : undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Reset if quiz changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitting(false);
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-display text-2xl font-bold text-white">Quiz Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested quiz does not exist or may have been unpublished.
        </p>
        <button
          onClick={() => navigate('/categories')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors cursor-pointer"
        >
          Explore All Quizzes
        </button>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasSelectedCurrent = selectedAnswers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && selected === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

    const attempt = await recordAttempt({
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      score,
      totalQuestions,
      percentage,
      answers: selectedAnswers,
      timeSpentSeconds: timeSpent,
    });

    navigate(`/results?attemptId=${attempt.id}`);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/categories')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Quizzes</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-1.5 bg-[#0e1628] border border-slate-800 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="tabular-nums font-mono">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-semibold px-3 py-1.5 rounded-full">
            <span className="tabular-nums">{answeredCount}</span> of <span className="tabular-nums">{totalQuestions}</span> Answered
          </div>
        </div>
      </div>

      {/* Main Quiz Box Card */}
      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-10 space-y-8">
        {/* Quiz Metadata & Title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-indigo-400">{quiz.category}</span>
            <span aria-hidden="true">·</span>
            <span>{quiz.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Question {currentIndex + 1} of {totalQuestions}</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
            {quiz.title}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span className="tabular-nums font-medium text-slate-200">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Prompt */}
        <div className="pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Question {currentIndex + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-medium text-white leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Four Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700 hover:bg-[#11182c] text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                    }`}
                  >
                    {optionLetters[idx]}
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{option}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-slate-700'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Question Navigation Palette */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">Questions:</span>
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isAnswered
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Go to Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Previous & Next/Finish */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-5 py-2.5 text-xs font-semibold rounded-full border border-slate-800 transition-colors flex items-center gap-1.5 ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-900'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className={`px-6 py-2.5 text-xs font-semibold rounded-full text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
              isLastQuestion
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            <span>{isLastQuestion ? 'Submit & View Results' : 'Next Question'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
