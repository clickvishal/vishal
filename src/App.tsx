/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizProvider } from './context/QuizContext';
import { RouterProvider, useRouter } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SearchBar } from './components/SearchBar';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import {
  PrivacyPolicyPage,
  TermsPage,
  DisclaimerPage,
} from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleOpenAuth = (tab: 'login' | 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleOpenSearch = () => {
    setSearchModalOpen(true);
  };

  // Route selector
  const renderCurrentPage = () => {
    if (currentPath === '/') {
      return <HomePage onOpenSearch={handleOpenSearch} />;
    }
    if (currentPath === '/categories') {
      return <CategoriesPage />;
    }
    if (currentPath.startsWith('/quiz/')) {
      return <QuizPage />;
    }
    if (currentPath === '/results') {
      return <ResultsPage />;
    }
    if (currentPath === '/dashboard') {
      return <DashboardPage onOpenAuth={handleOpenAuth} />;
    }
    if (currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminDashboard />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage />;
    }
    if (currentPath === '/terms') {
      return <TermsPage />;
    }
    if (currentPath === '/disclaimer') {
      return <DisclaimerPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070b15] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenAuth={handleOpenAuth}
        onOpenSearch={handleOpenSearch}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        onClose={() => setAuthModalOpen(false)}
      />

      <SearchBar
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </QuizProvider>
  );
}
