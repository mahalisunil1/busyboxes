'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export const ApplyModal: React.FC = () => {
  const {
    isApplyModalOpen,
    setIsApplyModalOpen,
    applyingJob,
    submitApplication,
    currentUser,
    applications,
  } = useApp();

  const isAlreadyApplied = applyingJob
    ? applications.some((a) => a.jobId === applyingJob.id)
    : false;

  const [fullName, setFullName] = useState(currentUser?.name || 'Alex Mercer');
  const [email, setEmail] = useState(currentUser?.email || 'alex.mercer@dev.io');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-8901');
  const [experience, setExperience] = useState(String(currentUser?.yearsExperience || 5));
  const [portfolio, setPortfolio] = useState(currentUser?.portfolioUrl || 'https://alexmercer.dev');
  const [coverLetter, setCoverLetter] = useState(
    'I have extensive software engineering experience in modern web stacks and would be thrilled to contribute to this role.'
  );
  const [resumeName, setResumeName] = useState(currentUser?.resumeFileName || 'Alex_Mercer_Resume_2026.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (currentUser && isApplyModalOpen) {
      const timer = setTimeout(() => {
        setFullName(currentUser.name || 'Alex Mercer');
        setEmail(currentUser.email || 'alex.mercer@dev.io');
        setPhone(currentUser.phone || '+1 (555) 234-8901');
        setExperience(String(currentUser.yearsExperience || 5));
        setPortfolio(currentUser.portfolioUrl || 'https://alexmercer.dev');
        setResumeName(currentUser.resumeFileName || 'Alex_Mercer_Resume_2026.pdf');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isApplyModalOpen]);

  if (!isApplyModalOpen || !applyingJob) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitApplication({
        jobId: applyingJob.id,
        jobTitle: applyingJob.title,
        company: applyingJob.company,
        applicantName: fullName,
        applicantEmail: email,
        applicantPhone: phone,
        resumeFileName: resumeName,
        portfolioUrl: portfolio,
        coverLetter,
        yearsExperience: Number(experience) || 3,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsApplyModalOpen(false);
      }, 1800);
    }, 900);
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  return (
    <div
      onClick={() => setIsApplyModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-xs"
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-[#0a66c2]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Easy Apply</h2>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {applyingJob.title} • {applyingJob.company}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApplyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-xs text-slate-600 max-w-sm">
                Your application has been received by <strong className="text-slate-800">{applyingJob.company}</strong>. Check your dashboard to track recruiter updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isAlreadyApplied && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    You already submitted an application for this role. Resubmitting will update your credentials and resume on file.
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portfolio / LinkedIn URL
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              {/* Resume Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resume File (PDF/DOCX) *
                </label>
                <label className="border border-dashed border-slate-300 hover:border-[#0a66c2] bg-slate-50 rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleSimulatedUpload}
                    className="hidden"
                  />
                  <div className="p-2 rounded bg-white border border-slate-200 text-[#0a66c2]">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{resumeName}</p>
                    <p className="text-[10px] text-slate-500">Attached (PDF 2.4 MB)</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Note for Recruiter
                </label>
                <textarea
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-[#0a66c2] hover:bg-[#084e96] disabled:opacity-50 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
