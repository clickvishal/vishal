import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback & Questions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-3 py-1 rounded-full">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact Quiz Nova
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Have a question about a quiz question, a suggestion for new categories, or feedback? We’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-[#0e1424] rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-display text-xl font-bold text-white">Message Received!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out to the Quiz Nova team. We value your feedback and will respond to your inquiry shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#090d1a] border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="Feedback & Questions">Feedback & General Questions</option>
                  <option value="Question Correction">Report a Question Factual Issue</option>
                  <option value="Feature Request">New Feature or Category Suggestion</option>
                  <option value="Partnership">Educational Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you today?"
                  rows={4}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#090d1a] border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQ Side Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#0e1424] rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-200">Are all quizzes free to take?</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Yes, every quiz and explanation on Quiz Nova is 100% free and open to everyone.
                </p>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <h4 className="font-semibold text-slate-200">How often are new quizzes added?</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  We add new quizzes weekly and rotate our special daily challenge every morning.
                </p>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <h4 className="font-semibold text-slate-200">Do I need an account to play?</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  No, guest mode is fully supported. Creating an account lets you preserve scores across sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#0e1424] rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-900/50 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-medium">Direct Inquiries</span>
              <a
                href="mailto:contact@quiznova.app"
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                contact@quiznova.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
