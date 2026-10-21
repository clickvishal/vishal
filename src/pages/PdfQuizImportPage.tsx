import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ExtractedQuestion,
  PdfImportMetadata,
  PdfProcessingStats,
  QuestionStatus,
} from '../types/pdfImport';
import { CategoryType, Difficulty, Question, Quiz } from '../types/quiz';
import { inspectPdfFile, processPdfInChunks } from '../services/pdfImportService';

const CATEGORIES: CategoryType[] = [
  'General Knowledge',
  'Science',
  'Technology',
  'History',
  'Geography',
  'Sports',
  'Movies',
  'Personality',
];

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const PdfQuizImportPage: React.FC = () => {
  const { navigate } = useRouter();
  const { isAdmin, user, firebaseUser, quizzes, addQuiz } = useQuiz();

  // Workflow stages: 'upload' | 'processing' | 'preview' | 'completed'
  const [stage, setStage] = useState<'upload' | 'processing' | 'preview' | 'completed'>('upload');

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metadata Form state
  const [metadata, setMetadata] = useState<PdfImportMetadata>({
    title: '',
    category: 'General Knowledge',
    description: '',
    difficulty: 'Medium',
    estimatedTime: '10 min',
    autoPublish: false,
    coverImage: '/src/assets/images/quiz_card_thinker_1790691653000.jpg',
  });

  // Processing state
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Extracted questions & preview state
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [stats, setStats] = useState<PdfProcessingStats>({
    total: 0,
    valid: 0,
    invalid: 0,
    reviewRequired: 0,
    duplicates: 0,
  });

  // Filter & pagination state
  const [activeTab, setActiveTab] = useState<'all' | 'valid' | 'review' | 'invalid' | 'duplicate'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Editing modal / inline state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ExtractedQuestion | null>(null);

  // Completed quiz state
  const [publishedQuiz, setPublishedQuiz] = useState<Quiz | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Authorization Guard
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-950/60 text-rose-400 border border-rose-800/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Access Denied · 403 Forbidden
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Administrator Access Required
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The PDF-to-Quiz automation pipeline is restricted to verified platform administrators.
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

  // 2. File Selection & Inspection
  const handleFileChange = async (selectedFile: File) => {
    setFileError(null);
    setIsInspecting(true);

    try {
      const inspectRes = await inspectPdfFile(selectedFile);
      if (!inspectRes.isValid) {
        setFileError(inspectRes.error || 'Invalid PDF file.');
        setFile(null);
        setPageCount(0);
        setIsInspecting(false);
        return;
      }

      setFile(selectedFile);
      setPageCount(inspectRes.pageCount);

      // Auto-suggest quiz title if currently blank
      if (!metadata.title) {
        const cleanName = selectedFile.name
          .replace(/\.pdf$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setMetadata((prev) => ({
          ...prev,
          title: cleanName,
          description: `Comprehensive examination quiz generated automatically from "${selectedFile.name}" (${inspectRes.pageCount} pages).`,
        }));
      }
    } catch (err: any) {
      setFileError(err.message || 'Failed to inspect PDF file.');
      setFile(null);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 3. Start Extraction
  const handleStartExtraction = async () => {
    if (!file) {
      setFileError('Please select a PDF file first.');
      return;
    }
    if (!metadata.title.trim()) {
      setFileError('Please provide a quiz title.');
      return;
    }

    setStage('processing');
    setProgress(5);
    setStatusMessage('Preparing document chunks...');
    setProcessingError(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Build list of existing question texts across all quizzes to check for cross-quiz duplicates
    const existingQuestionTexts: { quizTitle: string; questionText: string }[] = [];
    quizzes.forEach((q) => {
      q.questions.forEach((qn) => {
        existingQuestionTexts.push({
          quizTitle: q.title,
          questionText: qn.text,
        });
      });
    });

    try {
      const importJobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const result = await processPdfInChunks(
        file,
        pageCount,
        existingQuestionTexts,
        4, // 4 pages per AI chunk
        (curStage, curProgress, message) => {
          setProgress(curProgress);
          setStatusMessage(message);
        },
        abortController.signal,
        importJobId
      );

      setQuestions(result.questions);
      setStats(result.stats);

      // Auto-publish check if enabled and all questions pass validation
      if (
        metadata.autoPublish &&
        result.stats.valid === result.questions.length &&
        result.stats.invalid === 0 &&
        result.stats.reviewRequired === 0
      ) {
        await handleSaveAndPublish(result.questions, true);
      } else {
        setStage('preview');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatusMessage('Extraction cancelled.');
        setStage('upload');
      } else {
        setProcessingError(err.message || 'Failed to extract MCQs from PDF.');
      }
    }
  };

  // 4. Cancel Extraction
  const handleCancelExtraction = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStage('upload');
    setProgress(0);
    setStatusMessage('');
  };

  // 5. Bulk Actions
  const handleSelectAllValid = () => {
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        selected: q.status === 'valid',
      }))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setQuestions((prev) => prev.map((q) => ({ ...q, selected: select })));
  };

  const handleExcludeDuplicates = () => {
    setQuestions((prev) =>
      prev.map((q) => (q.status === 'duplicate' ? { ...q, selected: false } : q))
    );
  };

  // 6. Inline Question Editing
  const startEditing = (q: ExtractedQuestion) => {
    setEditingQuestionId(q.id);
    setEditForm({ ...q, options: [...q.options] as [string, string, string, string] });
  };

  const saveEditing = () => {
    if (!editForm) return;

    // Re-validate edited question
    const errors: string[] = [];
    let newStatus: QuestionStatus = 'valid';

    if (!editForm.text.trim()) {
      errors.push('Question statement cannot be empty.');
      newStatus = 'invalid';
    }

    if (editForm.options.some((o) => !o.trim())) {
      errors.push('All four options must be non-empty.');
      newStatus = 'invalid';
    }

    if (editForm.correctAnswer < 0 || editForm.correctAnswer > 3) {
      errors.push('Please select a valid correct answer (A, B, C, or D).');
      newStatus = 'invalid';
    }

    const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const updatedQuestion: ExtractedQuestion = {
      ...editForm,
      correctAnswerLabel: labels[editForm.correctAnswer] || 'A',
      status: newStatus,
      validationErrors: errors,
      selected: newStatus === 'valid' ? editForm.selected : false,
    };

    setQuestions((prev) => prev.map((q) => (q.id === editForm.id ? updatedQuestion : q)));

    // Recompute stats
    recomputeStats(questions.map((q) => (q.id === editForm.id ? updatedQuestion : q)));

    setEditingQuestionId(null);
    setEditForm(null);
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditForm(null);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    recomputeStats(updated);
  };

  const handleToggleInclude = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const recomputeStats = (list: ExtractedQuestion[]) => {
    setStats({
      total: list.length,
      valid: list.filter((q) => q.status === 'valid').length,
      invalid: list.filter((q) => q.status === 'invalid').length,
      reviewRequired: list.filter((q) => q.status === 'review_required').length,
      duplicates: list.filter((q) => q.status === 'duplicate').length,
    });
  };

  // 7. Save & Publish
  const handleSaveAndPublish = async (
    targetQuestions: ExtractedQuestion[],
    publishDirectly: boolean
  ) => {
    const includedQuestions = targetQuestions.filter((q) => q.selected);

    if (includedQuestions.length === 0) {
      alert('Please select at least one valid question to include in the quiz.');
      return;
    }

    // Check for unresolved invalid questions among included
    const invalidIncluded = includedQuestions.filter(
      (q) => q.status === 'invalid' || q.correctAnswer < 0 || q.correctAnswer > 3
    );
    if (invalidIncluded.length > 0) {
      alert(
        `Cannot publish: ${invalidIncluded.length} selected question(s) contain validation errors. Please edit or deselect them before publishing.`
      );
      return;
    }

    setIsSaving(true);

    try {
      // Map extracted questions to existing QuizNova Question schema
      const mappedQuestions: Question[] = includedQuestions.map((q, idx) => ({
        id: `q_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'Verified from examination document.',
      }));

      const newQuizData: Omit<Quiz, 'id' | 'createdAt'> = {
        title: metadata.title.trim(),
        description: metadata.description.trim() || `Quiz created from ${file?.name || 'PDF document'}.`,
        category: metadata.category,
        difficulty: metadata.difficulty,
        questionCount: mappedQuestions.length,
        estimatedTime: metadata.estimatedTime || `${Math.max(5, Math.ceil(mappedQuestions.length * 1.5))} min`,
        questions: mappedQuestions,
        published: publishDirectly,
        coverImage: metadata.coverImage,
      };

      const created = await addQuiz(newQuizData);
      setPublishedQuiz(created);
      setStage('completed');
    } catch (err: any) {
      alert(`Failed to save quiz: ${err.message || 'Database error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter questions for preview list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Tab filter
      if (activeTab === 'valid' && q.status !== 'valid') return false;
      if (activeTab === 'review' && q.status !== 'review_required') return false;
      if (activeTab === 'invalid' && q.status !== 'invalid') return false;
      if (activeTab === 'duplicate' && q.status !== 'duplicate') return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inText = q.text.toLowerCase().includes(query);
        const inOptions = q.options.some((o) => o.toLowerCase().includes(query));
        const inExp = q.explanation.toLowerCase().includes(query);
        return inText || inOptions || inExp;
      }
      return true;
    });
  }, [questions, activeTab, searchQuery]);

  // Paginated questions
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const selectedCount = questions.filter((q) => q.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated PDF-to-Quiz Extraction Engine</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PDF Quiz Import & Extraction
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Convert test papers, question banks, and textbook PDFs into interactive quizzes with full duplicate detection and MCQ validation.
          </p>
        </div>

        {stage === 'preview' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveAndPublish(questions, false)}
              disabled={isSaving || selectedCount === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#152038] border border-slate-800 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSaveAndPublish(questions, true)}
              disabled={isSaving || selectedCount === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Publish Quiz ({selectedCount} Selected)</span>
            </button>
          </div>
        )}
      </div>

      {/* STAGE 1: UPLOAD & CONFIGURATION */}
      {stage === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Drag & Drop Zone */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-12 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-200 ${
                file
                  ? 'border-indigo-500 bg-indigo-950/20'
                  : 'border-slate-800 bg-[#0e1424] hover:border-indigo-500/60 hover:bg-[#121a30]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {isInspecting ? (
                <div className="py-6 space-y-3">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs font-medium text-slate-300">
                    Inspecting PDF structure & magic bytes...
                  </p>
                </div>
              ) : file ? (
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base truncate max-w-sm mx-auto">
                      {file.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid PDF Ready for Processing</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPageCount(0);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                    >
                      Change PDF Document
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-[#141d33] text-indigo-400 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">
                      Drag & Drop your Question Paper PDF here
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Supports multi-page question papers, scanned OCR documents, and standard text PDFs up to 50MB.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer shadow-md inline-flex items-center gap-1.5"
                  >
                    <span>Browse Files</span>
                  </button>
                </div>
              )}
            </div>

            {fileError && (
              <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#0e1424] rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Chunked Pipeline</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Processes multi-page documents in safe chunks without timeouts or payload limits.
                </p>
              </div>
              <div className="p-3.5 bg-[#0e1424] rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Deduplication</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Automatically flags duplicate questions within the PDF and across existing quizzes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Quiz Metadata Settings */}
          <div className="lg:col-span-6 bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-5">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Target Quiz Configuration</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Quiz Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                  placeholder="e.g. Civil Engineering Structural Analysis Test"
                  className="w-full px-3.5 py-2.5 bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={metadata.category}
                    onChange={(e) => setMetadata({ ...metadata, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2.5 bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={metadata.difficulty}
                    onChange={(e) => setMetadata({ ...metadata, difficulty: e.target.value as Difficulty })}
                    className="w-full px-3 py-2.5 bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {DIFFICULTIES.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  rows={3}
                  placeholder="Provide context or instructions for this quiz..."
                  className="w-full px-3.5 py-2.5 bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Estimated Time</label>
                <input
                  type="text"
                  value={metadata.estimatedTime}
                  onChange={(e) => setMetadata({ ...metadata, estimatedTime: e.target.value })}
                  placeholder="e.g. 15 min"
                  className="w-full px-3.5 py-2.5 bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Auto-Publish Toggle Setting (OFF by default) */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metadata.autoPublish}
                    onChange={(e) => setMetadata({ ...metadata, autoPublish: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-[#090d1a]"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      Auto-publish when all questions pass validation
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                      OFF by default. Only auto-publishes if every question passes validation with verified answer keys and zero unresolved errors.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleStartExtraction}
                  disabled={!file || !metadata.title.trim() || isInspecting}
                  className="w-full py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start PDF Extraction & Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PROCESSING & EXTRACTION PROGRESS */}
      {stage === 'processing' && (
        <div className="max-w-xl mx-auto py-12 px-6 bg-[#0e1424] rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/80 flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-white">
              Processing PDF Document
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {statusMessage || 'Extracting questions, options, and answers...'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Extracting Pages (Chunked AI Model)</span>
              <span>{progress}%</span>
            </div>
          </div>

          {processingError ? (
            <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-semibold">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Extraction Interrupted</span>
              </div>
              <p className="text-rose-200/90">{processingError}</p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleStartExtraction}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                >
                  Retry Extraction
                </button>
                <button
                  onClick={() => setStage('upload')}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                >
                  Return to Upload
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleCancelExtraction}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Cancel Processing
            </button>
          )}
        </div>
      )}

      {/* STAGE 3: PREVIEW, BULK EDITING & VALIDATION */}
      {stage === 'preview' && (
        <div className="space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-[#0e1424] rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Extracted
              </span>
              <span className="font-display text-2xl font-bold text-white mt-1 block">
                {stats.total}
              </span>
            </div>

            <div className="p-4 bg-[#0e1424] rounded-2xl border border-emerald-900/40">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Valid</span>
              </div>
              <span className="font-display text-2xl font-bold text-emerald-400 mt-1 block">
                {stats.valid}
              </span>
            </div>

            <div className="p-4 bg-[#0e1424] rounded-2xl border border-amber-900/40">
              <div className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Review Required</span>
              </div>
              <span className="font-display text-2xl font-bold text-amber-400 mt-1 block">
                {stats.reviewRequired}
              </span>
            </div>

            <div className="p-4 bg-[#0e1424] rounded-2xl border border-rose-900/40">
              <div className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Invalid</span>
              </div>
              <span className="font-display text-2xl font-bold text-rose-400 mt-1 block">
                {stats.invalid}
              </span>
            </div>

            <div className="p-4 bg-[#0e1424] rounded-2xl border border-purple-900/40">
              <div className="flex items-center gap-1.5 text-purple-400">
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Duplicates</span>
              </div>
              <span className="font-display text-2xl font-bold text-purple-400 mt-1 block">
                {stats.duplicates}
              </span>
            </div>
          </div>

          {/* Action Toolbar & Filters */}
          <div className="bg-[#0e1424] rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#090d1a] border border-slate-800'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('valid');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'valid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#090d1a] border border-slate-800'
                  }`}
                >
                  Valid ({stats.valid})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('review');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'review'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#090d1a] border border-slate-800'
                  }`}
                >
                  Review ({stats.reviewRequired})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('invalid');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'invalid'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#090d1a] border border-slate-800'
                  }`}
                >
                  Invalid ({stats.invalid})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('duplicate');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'duplicate'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#090d1a] border border-slate-800'
                  }`}
                >
                  Duplicates ({stats.duplicates})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search extracted questions..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bulk Selection Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllValid}
                  className="px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/80 rounded-md font-medium cursor-pointer"
                >
                  Select All Valid
                </button>
                <button
                  onClick={() => handleSelectAll(true)}
                  className="px-2.5 py-1 bg-[#090d1a] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md font-medium cursor-pointer"
                >
                  Select All
                </button>
                <button
                  onClick={() => handleSelectAll(false)}
                  className="px-2.5 py-1 bg-[#090d1a] hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-md font-medium cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  onClick={handleExcludeDuplicates}
                  className="px-2.5 py-1 bg-[#090d1a] hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-md font-medium cursor-pointer"
                >
                  Exclude Duplicates
                </button>
              </div>

              <div className="text-slate-400 font-medium">
                <span className="text-indigo-400 font-bold">{selectedCount}</span> of {questions.length} questions included in quiz
              </div>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {paginatedQuestions.length === 0 ? (
              <div className="p-12 text-center bg-[#0e1424] rounded-2xl border border-slate-800 space-y-2">
                <p className="text-sm font-semibold text-slate-300">No questions found</p>
                <p className="text-xs text-slate-500">
                  Try adjusting your filter tab or search terms.
                </p>
              </div>
            ) : (
              paginatedQuestions.map((q, idx) => {
                const isEditing = editingQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all duration-150 ${
                      q.selected
                        ? 'bg-[#0e1424] border-slate-800'
                        : 'bg-[#090d1a]/80 border-slate-900 opacity-75'
                    }`}
                  >
                    {isEditing && editForm ? (
                      /* Inline Editing View */
                      <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-semibold text-indigo-400">
                            Editing Question #{q.questionNumber} (Source Page {q.sourcePage})
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveEditing}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">
                            Question Text
                          </label>
                          <textarea
                            value={editForm.text}
                            onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-400 font-semibold">
                            Options & Correct Answer (Select radio button for the correct choice)
                          </label>
                          {(['A', 'B', 'C', 'D'] as const).map((label, optIdx) => (
                            <div key={label} className="flex items-center gap-2">
                              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-300 w-8">
                                <input
                                  type="radio"
                                  name={`correct_${q.id}`}
                                  checked={editForm.correctAnswer === optIdx}
                                  onChange={() => setEditForm({ ...editForm, correctAnswer: optIdx })}
                                  className="text-indigo-600"
                                />
                                <span>{label}</span>
                              </label>
                              <input
                                type="text"
                                value={editForm.options[optIdx]}
                                onChange={(e) => {
                                  const updatedOpts = [...editForm.options] as [string, string, string, string];
                                  updatedOpts[optIdx] = e.target.value;
                                  setEditForm({ ...editForm, options: updatedOpts });
                                }}
                                className="flex-1 px-3 py-2 bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">
                            Explanation (Optional)
                          </label>
                          <input
                            type="text"
                            value={editForm.explanation}
                            onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                            className="w-full px-3 py-2 bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Normal Display View */
                      <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={q.selected}
                              onChange={() => handleToggleInclude(q.id)}
                              className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-[#090d1a] cursor-pointer"
                              title="Include in quiz"
                            />
                            <span className="font-semibold text-xs text-white">
                              Question #{q.questionNumber}
                            </span>
                            <span className="text-[11px] text-slate-500 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-full">
                              Page {q.sourcePage}
                            </span>

                            {/* Status Badge */}
                            {q.status === 'valid' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Valid</span>
                              </span>
                            )}
                            {q.status === 'review_required' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Review Required</span>
                              </span>
                            )}
                            {q.status === 'invalid' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" />
                                <span>Invalid</span>
                              </span>
                            )}
                            {q.status === 'duplicate' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded-full">
                                <Copy className="w-3 h-3" />
                                <span>Duplicate</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditing(q)}
                              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Edit Question"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Error / Warning Notice */}
                        {q.validationErrors.length > 0 && (
                          <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-1 text-[11px] text-amber-300">
                            {q.validationErrors.map((err, errIdx) => (
                              <div key={errIdx} className="flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>{err}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Question Text */}
                        <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                          {q.text}
                        </p>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctAnswer === optIdx;
                            const optionLabel = ['A', 'B', 'C', 'D'][optIdx];

                            return (
                              <div
                                key={optIdx}
                                className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                                  isCorrect
                                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200 font-semibold'
                                    : 'bg-[#090d1a] border-slate-800/80 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                      isCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {optionLabel}
                                  </span>
                                  <span className="truncate max-w-[200px] sm:max-w-xs">{opt}</span>
                                </div>
                                {isCorrect && (
                                  <span className="text-[10px] uppercase font-bold text-emerald-400 ml-2">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                            <strong className="text-slate-300">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
                <strong className="text-slate-200">{totalPages}</strong> ({filteredQuestions.length} total)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-[#0e1424] hover:bg-[#141f38] text-slate-300 disabled:opacity-50 border border-slate-800 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-[#0e1424] hover:bg-[#141f38] text-slate-300 disabled:opacity-50 border border-slate-800 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: COMPLETED / PUBLISHED SCREEN */}
      {stage === 'completed' && publishedQuiz && (
        <div className="max-w-2xl mx-auto py-12 px-8 bg-[#0e1424] rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {publishedQuiz.published ? 'Live on CivilMates' : 'Saved as Draft'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Quiz Successfully Created!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              "{publishedQuiz.title}" has been saved to the database with {publishedQuiz.questions.length} verified multiple choice questions.
            </p>
          </div>

          <div className="p-4 bg-[#090d1a] rounded-2xl border border-slate-800/80 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold text-white">{publishedQuiz.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Difficulty:</span>
              <span className="font-semibold text-white">{publishedQuiz.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Questions:</span>
              <span className="font-semibold text-white">{publishedQuiz.questionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Public Status:</span>
              <span
                className={`font-semibold ${
                  publishedQuiz.published ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {publishedQuiz.published ? 'Published & Active' : 'Unpublished Draft'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate(`/quiz/${publishedQuiz.id}`)}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span>Take This Quiz Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setStage('upload');
                setFile(null);
                setQuestions([]);
                setPublishedQuiz(null);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#141f38] border border-slate-800 rounded-full transition-colors cursor-pointer"
            >
              Import Another PDF
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1628] hover:bg-[#141f38] border border-slate-800 rounded-full transition-colors cursor-pointer"
            >
              Return to Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
