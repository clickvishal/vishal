import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Quiz,
  QuizAttempt,
  UserProfile,
  CategoryType,
  Question,
} from '../types/quiz';
import { INITIAL_QUIZZES } from '../data/quizzes';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase/config';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
} from 'firebase/firestore';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
}

interface QuizContextType {
  quizzes: Quiz[];
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  isAdmin: boolean;
  attempts: QuizAttempt[];
  userProfile: UserProfile;
  activeAttempt: QuizAttempt | null;
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  // Quiz Actions
  recordAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => Promise<QuizAttempt>;
  getQuizById: (id: string) => Quiz | undefined;
  // Admin methods
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Promise<Quiz>;
  updateQuiz: (id: string, updates: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  togglePublish: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  addQuestion: (quizId: string, question: Omit<Question, 'id'>) => Promise<void>;
  updateQuestion: (quizId: string, questionId: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (quizId: string, questionId: string) => Promise<void>;
  seedInitialQuizzes: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      setFirebaseUser(current);
      if (current) {
        const email = current.email || '';
        const name =
          current.displayName ||
          email.split('@')[0].replace(/[._]/g, ' ') ||
          'Quiz Explorer';

        // Check if admin
        let userIsAdmin = false;
        try {
          const adminDocRef = doc(db, 'admins', current.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists()) {
            userIsAdmin = true;
          } else if (email === 'clickbanknewbing@gmail.com') {
            // Bootstrap initial root admin account
            await setDoc(doc(db, 'admins', current.uid), {
              email,
              role: 'admin',
              createdAt: new Date().toISOString(),
            });
            userIsAdmin = true;
          }
        } catch (e) {
          if (email === 'clickbanknewbing@gmail.com') userIsAdmin = true;
        }

        setIsAdmin(userIsAdmin);

        setUser({
          id: current.uid,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            current.uid
          )}&backgroundColor=b6e3f4`,
          role: userIsAdmin ? 'admin' : 'user',
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Quizzes from Firestore (with published filter for users, full access for admins)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupQuizListener = async () => {
      try {
        const quizzesCol = collection(db, 'quizzes');

        // Normal users only query published quizzes, admins see all
        const quizQuery = isAdmin
          ? quizzesCol
          : query(quizzesCol, where('published', '==', true));

        // Setup real-time listener
        unsubscribe = onSnapshot(
          quizQuery,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedQuizzes: Quiz[] = [];
              snapshot.forEach((d) => {
                const data = d.data() as Quiz;
                loadedQuizzes.push({
                  ...data,
                  id: d.id,
                  questionCount: data.questions?.length || 0,
                });
              });
              setQuizzes(loadedQuizzes);
            } else {
              // Empty database fallback to 10 initial quizzes
              setQuizzes(INITIAL_QUIZZES);
              // If admin is logged in and database is empty, seed automatically
              if (isAdmin) {
                seedInitialQuizzes();
              }
            }
          },
          (error) => {
            console.warn('Firestore quiz listener notice:', error.message);
            setQuizzes(INITIAL_QUIZZES);
          }
        );
      } catch (err) {
        console.warn('Using local quiz cache while syncing Firestore:', err);
        setQuizzes(INITIAL_QUIZZES);
      }
    };

    setupQuizListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAdmin]);

  // 3. Fetch User Results from Firestore
  useEffect(() => {
    if (!firebaseUser) {
      setAttempts([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    try {
      const resultsCol = collection(db, 'results');
      const q = query(
        resultsCol,
        where('userId', '==', firebaseUser.uid)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const userAttempts: QuizAttempt[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            userAttempts.push({
              id: docSnap.id,
              quizId: data.quizId,
              quizTitle: data.quizTitle,
              category: data.category || 'General Knowledge',
              score: data.score,
              totalQuestions: data.totalQuestions,
              percentage: data.percentage,
              answers: data.answers || {},
              completedAt: data.completedAt || new Date().toISOString(),
              timeSpentSeconds: data.timeSpentSeconds || 0,
            });
          });

          // Sort by completion date descending
          userAttempts.sort(
            (a, b) =>
              new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );

          setAttempts(userAttempts);
        },
        (error) => {
          console.warn('Results snapshot notice:', error.message);
        }
      );
    } catch (e) {
      console.warn('Could not attach results listener:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [firebaseUser]);

  // Auth Operations
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      // Create users/{uid} document
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          name,
          email,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // If root admin doesn't exist yet in Auth, bootstrap account creation
      if (
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') &&
        email.toLowerCase().trim() === 'clickbanknewbing@gmail.com'
      ) {
        try {
          cred = await createUserWithEmailAndPassword(auth, email, pass);
        } catch (createErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    const uid = cred.user.uid;

    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        setIsAdmin(true);
        return true;
      }
      if (email.toLowerCase().trim() === 'clickbanknewbing@gmail.com') {
        await setDoc(doc(db, 'admins', uid), {
          email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
        setIsAdmin(true);
        return true;
      }
    } catch (e) {
      if (email.toLowerCase().trim() === 'clickbanknewbing@gmail.com') {
        setIsAdmin(true);
        return true;
      }
    }

    // Not an admin: sign out and deny access
    await signOut(auth);
    throw new Error('Unauthorized: This account does not possess administrator privileges.');
  };

  // Seed Initial 10 Quizzes into Firestore
  const seedInitialQuizzes = async () => {
    for (const quiz of INITIAL_QUIZZES) {
      try {
        const quizDocRef = doc(db, 'quizzes', quiz.id);
        await setDoc(quizDocRef, {
          ...quiz,
          published: true,
          questionCount: quiz.questions.length,
          createdAt: quiz.createdAt || new Date().toISOString().split('T')[0],
        });
      } catch (err) {
        console.warn(`Could not seed quiz ${quiz.id}:`, err);
      }
    }
  };

  // Record an attempt
  const recordAttempt = async (
    attemptData: Omit<QuizAttempt, 'id' | 'completedAt'>
  ): Promise<QuizAttempt> => {
    const completedAt = new Date().toISOString();
    const tempId = `attempt_${Date.now()}`;

    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: tempId,
      completedAt,
    };

    setActiveAttempt(newAttempt);

    // Save to Firestore if user is authenticated
    if (firebaseUser) {
      try {
        const docRef = await addDoc(collection(db, 'results'), {
          userId: firebaseUser.uid,
          quizId: attemptData.quizId,
          quizTitle: attemptData.quizTitle,
          category: attemptData.category,
          score: attemptData.score,
          totalQuestions: attemptData.totalQuestions,
          percentage: attemptData.percentage,
          answers: attemptData.answers,
          timeSpentSeconds: attemptData.timeSpentSeconds,
          completedAt,
        });
        newAttempt.id = docRef.id;
      } catch (err) {
        console.warn('Error saving attempt to Firestore:', err);
      }
    } else {
      // Local fallback for guest
      setAttempts((prev) => [newAttempt, ...prev]);
    }

    return newAttempt;
  };

  const getQuizById = (id: string): Quiz | undefined => {
    return quizzes.find((q) => q.id === id);
  };

  // User Profile stats calculation
  const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossibleQuestions = attempts.reduce(
    (acc, curr) => acc + curr.totalQuestions,
    0
  );
  const averageScore =
    totalPossibleQuestions > 0
      ? Math.round((totalScore / totalPossibleQuestions) * 100)
      : 0;

  const userProfile: UserProfile = {
    id: user?.id || 'guest',
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@quiznova.app',
    avatar:
      user?.avatar ||
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest&backgroundColor=e2e8f0',
    joinedDate: 'September 2026',
    completedQuizzesCount: attempts.length,
    totalScore,
    averageScore,
    recentAttempts: attempts.slice(0, 10),
  };

  // Admin Methods (Synced to Firestore)
  const addQuiz = async (
    newQuizData: Omit<Quiz, 'id' | 'createdAt'>
  ): Promise<Quiz> => {
    const slug = newQuizData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const quizId = `${slug}-${Date.now().toString(36)}`;
    const createdAt = new Date().toISOString().split('T')[0];

    const newQuiz: Quiz = {
      ...newQuizData,
      id: quizId,
      createdAt,
      questionCount: newQuizData.questions.length,
    };

    try {
      await setDoc(doc(db, 'quizzes', quizId), newQuiz);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `quizzes/${quizId}`);
    }

    setQuizzes((prev) => [newQuiz, ...prev]);
    return newQuiz;
  };

  const updateQuiz = async (id: string, updates: Partial<Quiz>) => {
    try {
      const docRef = doc(db, 'quizzes', id);
      await updateDoc(docRef, updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quizzes/${id}`);
    }

    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = { ...q, ...updates };
          if (updates.questions) {
            updated.questionCount = updates.questions.length;
          }
          return updated;
        }
        return q;
      })
    );
  };

  const deleteQuiz = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'quizzes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `quizzes/${id}`);
    }

    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const togglePublish = async (id: string) => {
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) return;
    const newStatus = !quiz.published;

    try {
      await updateDoc(doc(db, 'quizzes', id), { published: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quizzes/${id}`);
    }

    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, published: newStatus } : q))
    );
  };

  const toggleFeatured = async (id: string) => {
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) return;
    const newStatus = !quiz.featured;

    try {
      await updateDoc(doc(db, 'quizzes', id), { featured: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quizzes/${id}`);
    }

    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, featured: newStatus } : q))
    );
  };

  const addQuestion = async (quizId: string, question: Omit<Question, 'id'>) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const newQ: Question = {
      ...question,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updatedQuestions = [...quiz.questions, newQ];

    try {
      await updateDoc(doc(db, 'quizzes', quizId), {
        questions: updatedQuestions,
        questionCount: updatedQuestions.length,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quizzes/${quizId}`);
    }

    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? { ...q, questions: updatedQuestions, questionCount: updatedQuestions.length }
          : q
      )
    );
  };

  const updateQuestion = async (
    quizId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const updatedQuestions = quiz.questions.map((qn) =>
      qn.id === questionId ? { ...qn, ...updates } : qn
    );

    try {
      await updateDoc(doc(db, 'quizzes', quizId), {
        questions: updatedQuestions,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quizzes/${quizId}`);
    }

    setQuizzes((prev) =>
      prev.map((q) => (q.id === quizId ? { ...q, questions: updatedQuestions } : q))
    );
  };

  const deleteQuestion = async (quizId: string, questionId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const updatedQuestions = quiz.questions.filter((qn) => qn.id !== questionId);

    try {
      await updateDoc(doc(db, 'quizzes', quizId), {
        questions: updatedQuestions,
        questionCount: updatedQuestions.length,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quizzes/${quizId}`);
    }

    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? { ...q, questions: updatedQuestions, questionCount: updatedQuestions.length }
          : q
      )
    );
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        user,
        firebaseUser,
        authLoading,
        isAdmin,
        attempts,
        userProfile,
        activeAttempt,
        login,
        signup,
        logout,
        resetPassword,
        adminLogin,
        recordAttempt,
        getQuizById,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        togglePublish,
        toggleFeatured,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        seedInitialQuizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
