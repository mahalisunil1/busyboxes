'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Building,
  Users,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const JobDetailModal: React.FC = () => {
  const {
    selectedJob,
    setSelectedJob,
    isJobSaved,
    toggleSaveJob,
    openApplyModal,
    showToast,
  } = useApp();

  if (!selectedJob) return null;

  const saved = isJobSaved(selectedJob.id);

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000).toFixed(0)}k`;
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Job listing link copied!', 'info');
    }
  };

  return (
    <div
      onClick={() => setSelectedJob(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs"
    >
      <div
        className="relative w-full max-w-3xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-[#0a66c2] border border-blue-200">
              {selectedJob.workLocation}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {selectedJob.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveJob(selectedJob.id)}
              className={`p-1.5 rounded-md transition-colors ${
                saved ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:bg-slate-200'
              }`}
              title="Save job"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedJob(null)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Company & Role Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                {selectedJob.companyLogo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedJob.companyLogo}
                    alt={selectedJob.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-600">{selectedJob.company}</span>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedJob.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Posted {selectedJob.postedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-lg font-bold text-slate-900">
                {formatSalary(selectedJob.salaryMin)} - {formatSalary(selectedJob.salaryMax)}
              </div>
              <span className="text-xs text-slate-500">USD per annum</span>
              <div className="pt-2">
                <button
                  onClick={() => openApplyModal(selectedJob)}
                  className="px-5 py-2 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Job Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedJob.description}
            </p>
          </div>

          {/* Responsibilities */}
          {selectedJob.responsibilities && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Key Responsibilities</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {selectedJob.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#0a66c2] font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {selectedJob.requirements && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Requirements & Qualifications</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {selectedJob.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {selectedJob.benefits && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Compensation & Perks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {selectedJob.benefits.map((b, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {selectedJob.applicantsCount} professionals applied
            </span>
            <button
              onClick={() => openApplyModal(selectedJob)}
              className="px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors"
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
