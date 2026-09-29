import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import { Quiz, Question, CategoryType, Difficulty } from '../types/quiz';
import {
  ShieldAlert,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Star,
  CheckCircle,
  EyeOff,
  HelpCircle,
  RotateCcw,
  X,
  Search,
  Users,
  Activity,
  ArrowLeft,
  Save,
  Check,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentPath, params, navigate } = useRouter();
  const {
    quizzes,
    isAdmin,
    firebaseUser,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublish,
    toggleFeatured,
    seedInitialQuizzes,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // 1. Guard check: Only authorized admins
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-900/50 text-rose-400 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Access Denied · 403 Forbidden
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Unauthorized Access
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            You do not have administrative permissions to view or manage the Quiz Nova administrative dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer shadow-md"
          >
            Admin Sign In
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#141f38] border border-slate-800 rounded-full transition-colors cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // 2. Metrics calculation
  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter((q) => q.published).length;
  const draftQuizzes = quizzes.filter((q) => !q.published).length;
  const featuredQuizzes = quizzes.filter((q) => q.featured).length;
  const totalQuestions = quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);

  // Determine subroute
  const isNewQuizRoute = currentPath === '/admin/quizzes/new';
  const isEditQuizRoute = currentPath.startsWith('/admin/quizzes/edit/');
  const editingQuizId = isEditQuizRoute ? currentPath.replace('/admin/quizzes/edit/', '') : null;
  const targetEditingQuiz = editingQuizId ? quizzes.find((q) => q.id === editingQuizId) : null;

  // Filter list
  const filteredList = quizzes.filter((q) => {
    if (activeTab === 'published' && !q.published) return false;
    if (activeTab === 'drafts' && q.published) return false;
    if (activeTab === 'featured' && !q.featured) return false;
    if (searchQuery.trim()) {
      const matchTitle = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = q.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTitle || matchCat;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-3 py-1 rounded-full mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Admin Management Console · Firebase Connected</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quiz Nova Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-slate-200">{firebaseUser?.email}</strong> (Verified Administrator)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isNewQuizRoute && (
            <button
              onClick={() => navigate('/admin/quizzes/new')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Quiz</span>
            </button>
          )}

          <button
            onClick={async () => {
              if (confirm('Reseed the 10 original quizzes to Firestore?')) {
                await seedInitialQuizzes();
                alert('Seeding complete!');
              }
            }}
            className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#141f38] border border-slate-800 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reseed 10 complete quizzes into Firestore"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reseed Quizzes</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 rounded-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Subroute: Add New Quiz Form */}
      {isNewQuizRoute && (
        <QuizForm
          mode="create"
          onCancel={() => navigate('/admin')}
          onSaved={(newQ) => {
            setSaveSuccessMsg(`Quiz "${newQ.title}" created successfully in Firestore!`);
            navigate('/admin');
            setTimeout(() => setSaveSuccessMsg(null), 3000);
          }}
        />
      )}

      {/* Subroute: Edit Quiz Form */}
      {isEditQuizRoute && targetEditingQuiz && (
        <QuizForm
          mode="edit"
          initialQuiz={targetEditingQuiz}
          onCancel={() => navigate('/admin')}
          onSaved={() => {
            setSaveSuccessMsg(`Quiz "${targetEditingQuiz.title}" updated in Firestore!`);
            navigate('/admin');
            setTimeout(() => setSaveSuccessMsg(null), 3000);
          }}
        />
      )}

      {/* Main Admin Overview & Quizzes Table (When not on new/edit subroutes) */}
      {!isNewQuizRoute && !isEditQuizRoute && (
        <>
          {/* 6 Key Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
            <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-medium">Total Quizzes</span>
              <h3 className="text-2xl font-bold text-white mt-1 tabular-nums">{totalQuizzes}</h3>
            </div>
            <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs text-emerald-400 font-medium">Published</span>
              <h3 className="text-2xl font-bold text-emerald-300 mt-1 tabular-nums">{publishedQuizzes}</h3>
            </div>
            <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs text-amber-400 font-medium">Drafts</span>
              <h3 className="text-2xl font-bold text-amber-300 mt-1 tabular-nums">{draftQuizzes}</h3>
            </div>
            <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs text-purple-400 font-medium">Featured</span>
              <h3 className="text-2xl font-bold text-purple-300 mt-1 tabular-nums">{featuredQuizzes}</h3>
            </div>
            <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs text-indigo-400 font-medium">Total Questions</span>
              <h3 className="text-2xl font-bold text-indigo-300 mt-1 tabular-nums">{totalQuestions}</h3>
            </div>
            <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs text-cyan-400 font-medium">Total Users</span>
              <h3 className="text-2xl font-bold text-cyan-300 mt-1 tabular-nums">Active</h3>
            </div>
          </div>

          {/* Quizzes Table Card */}
          <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            {/* Table Filter Controls */}
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Segmented Filter Pills */}
              <div className="flex items-center p-1 bg-[#090d1a] border border-slate-800 rounded-full w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({quizzes.length})
                </button>
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'published'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Published ({publishedQuizzes})
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'drafts'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Drafts ({draftQuizzes})
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'featured'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Featured ({featuredQuizzes})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title or category..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#090d1a] border border-slate-800 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090d1a]/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-5">Quiz Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredList.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-[#121c33]/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-white line-clamp-1">{quiz.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{quiz.id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">{quiz.category}</td>
                      <td className="py-3.5 px-4 tabular-nums font-medium text-slate-300">
                        {quiz.questions?.length || 0} Questions
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-300">{quiz.difficulty}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => togglePublish(quiz.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] transition-colors cursor-pointer ${
                            quiz.published
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/60'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {quiz.published ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleFeatured(quiz.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            quiz.featured
                              ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40 hover:bg-amber-900/40'
                              : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/60'
                          }`}
                          title={quiz.featured ? 'Remove Featured' : 'Mark as Featured'}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/quizzes/edit/${quiz.id}`)}
                            className="px-3 py-1 text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 hover:bg-indigo-900/80 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit & Questions</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${quiz.title}" from Firestore?`)) {
                                deleteQuiz(quiz.id);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Reusable Add & Edit Quiz Form with Dynamic Question Builder
interface QuizFormProps {
  mode: 'create' | 'edit';
  initialQuiz?: Quiz;
  onCancel: () => void;
  onSaved: (quiz: Quiz) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ mode, initialQuiz, onCancel, onSaved }) => {
  const { addQuiz, updateQuiz } = useQuiz();

  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [category, setCategory] = useState<CategoryType>(initialQuiz?.category || 'General Knowledge');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialQuiz?.difficulty || 'Medium');
  const [estimatedTime, setEstimatedTime] = useState(initialQuiz?.estimatedTime || '5 min');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialQuiz?.coverImage || '');
  const [published, setPublished] = useState<boolean>(initialQuiz ? initialQuiz.published : true);
  const [featured, setFeatured] = useState<boolean>(initialQuiz?.featured || false);

  // Dynamic Question Builder List
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (initialQuiz && initialQuiz.questions?.length > 0) {
      return [...initialQuiz.questions];
    }
    return [
      {
        id: `q_${Date.now()}_1`,
        text: 'What is the speed of light in vacuum?',
        options: ['150,000 km/s', '200,000 km/s', '300,000 km/s', '450,000 km/s'],
        correctAnswer: 2,
        explanation: 'The speed of light in vacuum is approximately 300,000 km/s (299,792 km/s).',
      },
    ];
  });

  const [isSaving, setIsSaving] = useState(false);

  // Add empty question
  const handleAddQuestionSlot = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options] as [string, string, string, string];
    newOptions[optIndex] = text;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a quiz title.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question #${i + 1} text is empty.`);
        return;
      }
      for (let o = 0; o < 4; o++) {
        if (!q.options[o]?.trim()) {
          alert(`Option ${['A', 'B', 'C', 'D'][o]} of Question #${i + 1} is empty.`);
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      if (mode === 'create') {
        const created = await addQuiz({
          title,
          description,
          category,
          difficulty,
          questionCount: questions.length,
          estimatedTime: estimatedTime || '5 min',
          coverImage: thumbnailUrl || undefined,
          published,
          featured,
          questions,
        });
        onSaved(created);
      } else if (initialQuiz) {
        await updateQuiz(initialQuiz.id, {
          title,
          description,
          category,
          difficulty,
          questionCount: questions.length,
          estimatedTime,
          coverImage: thumbnailUrl || undefined,
          published,
          featured,
          questions,
        });
        onSaved({
          ...initialQuiz,
          title,
          description,
          category,
          difficulty,
          questionCount: questions.length,
          estimatedTime,
          coverImage: thumbnailUrl || undefined,
          published,
          featured,
          questions,
        });
      }
    } catch (err) {
      console.error('Error saving quiz:', err);
      alert('Failed to save quiz to Firestore. Please check permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white bg-[#090d1a] border border-slate-800 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {mode === 'create' ? 'Create New Quiz' : `Edit Quiz: ${initialQuiz?.title}`}
            </h2>
            <p className="text-xs text-slate-400">Configure quiz parameters and questions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 rounded-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-md flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving to Firestore...' : 'Save Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Quiz Top Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Modern Physics Challenge"
            className="w-full px-3.5 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail / Cover Image URL</label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://... or /src/assets/images/..."
            className="w-full px-3.5 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Overview of this quiz..."
            className="w-full px-3.5 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full px-3.5 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none"
          >
            <option value="General Knowledge">General Knowledge</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Sports">Sports</option>
            <option value="Movies">Movies</option>
            <option value="Personality">Personality</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3.5 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Time</label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g. 5 min"
              className="w-full px-3.5 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded bg-[#090d1a] border-slate-800"
            />
            <span>Published (Visible to public)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded bg-[#090d1a] border-slate-800"
            />
            <span>Featured on Homepage</span>
          </label>
        </div>
      </div>

      {/* Dynamic Question Builder Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Questions Builder ({questions.length})
            </h3>
            <p className="text-xs text-slate-400">Add, reorder, or edit questions with 4 options and verified answers</p>
          </div>
          <button
            type="button"
            onClick={handleAddQuestionSlot}
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 hover:bg-indigo-900 rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="bg-[#090e1c] rounded-2xl border border-slate-800 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">
                  Question #{qIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="p-1 text-rose-400 hover:text-rose-300 rounded-md hover:bg-rose-950/40"
                  title="Remove Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Question Prompt Text
                </label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                  placeholder="Enter the question..."
                  className="w-full px-3 py-2 text-xs bg-[#0e1628] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">
                  4 Options (Select radio for correct answer)
                </label>
                {([0, 1, 2, 3] as const).map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correctRadio_${q.id}`}
                      checked={q.correctAnswer === optIdx}
                      onChange={() => handleQuestionChange(qIdx, 'correctAnswer', optIdx)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-400 w-4">
                      {['A', 'B', 'C', 'D'][optIdx]}
                    </span>
                    <input
                      type="text"
                      value={q.options[optIdx] || ''}
                      onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                      placeholder={`Option ${['A', 'B', 'C', 'D'][optIdx]}`}
                      className="w-full px-3 py-1.5 text-xs bg-[#0e1628] border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Explanation & Context
                </label>
                <textarea
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                  rows={2}
                  placeholder="Explain why this answer is correct..."
                  className="w-full px-3 py-1.5 text-xs bg-[#0e1628] border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
