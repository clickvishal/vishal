import React from 'react';
import { Shield, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from '../router/Router';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Transparency</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Effective Date: September 2026</p>
      </div>

      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            Quiz Nova is designed with privacy-first principles. We collect minimal information required to deliver high-quality quiz experiences:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li><strong>Local Quiz State:</strong> Your selected answers and quiz completion tallies are stored locally in your browser storage.</li>
            <li><strong>Voluntary Account Details:</strong> If you choose to sign up with a demo account, your display name and email address are stored strictly for profile presentation.</li>
            <li><strong>Technical Diagnostics:</strong> Standard non-identifying telemetry (such as browser version) to ensure page responsiveness across mobile and desktop devices.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">2. How Information is Used</h2>
          <p>
            We use your quiz data solely to compute your score percentages, track your historical achievements, and provide educational answer reviews. We do not sell, rent, or trade your personal information to third parties or data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">3. Cookies and Local Storage</h2>
          <p>
            Quiz Nova uses standard browser LocalStorage to remember your active quiz settings and score history without invasive tracking cookies. You may clear your LocalStorage at any time through your browser preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">4. Contacting Us</h2>
          <p>
            For any privacy inquiries or data removal requests, please reach out to our privacy coordinator at <strong>privacy@quiznova.app</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-3 py-1 rounded-full">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400">Effective Date: September 2026</p>
      </div>

      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or playing quizzes on Quiz Nova, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please discontinue using the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">2. Intellectual Property</h2>
          <p>
            All original quiz questions, explanations, branding, artwork, and website interfaces are the intellectual property of Quiz Nova. Users are granted a personal, non-commercial, revocable license to access the platform for educational and entertainment purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">3. Fair Play and Platform Integrity</h2>
          <p>
            Users agree not to disrupt the platform through automated scraping, denial of service attacks, or reverse engineering of the quiz question database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">4. Modifications to Service</h2>
          <p>
            Quiz Nova reserves the right to modify or discontinue quizzes, categories, or features at any time to improve educational quality and user experience.
          </p>
        </section>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-3 py-1 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Important Notice</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-400">Effective Date: September 2026</p>
      </div>

      <div className="bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">1. Educational & Entertainment Purposes</h2>
          <p>
            Quiz Nova is strictly intended for personal educational, trivia, and entertainment purposes. While our editorial team strives for meticulous factual accuracy in every question and explanation, information is provided on an "as-is" basis without warranties of completeness or definitive professional advice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">2. Personality & Thinking Style Assessments</h2>
          <p>
            Assessments categorized under "Personality" or "Brain Challenge" are conceptual reflections meant for personal curiosity and self-discovery. They are not psychological, medical, or clinical diagnostic evaluations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">3. Policy & Compliance Statement</h2>
          <p>
            Quiz Nova makes no guarantees of income, website traffic, financial outcomes, or third-party approvals. Quiz Nova does not engage in artificial engagement tactics, click encouragement, or deceptive claims. All platform content is designed to be transparent, honest, and helpful.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-white">4. External References</h2>
          <p>
            Historical citations and scientific references are cited for educational attribution. Mentions of films, historical figures, or athletic records do not constitute an endorsement by or affiliation with original copyright holders.
          </p>
        </section>
      </div>
    </div>
  );
};
