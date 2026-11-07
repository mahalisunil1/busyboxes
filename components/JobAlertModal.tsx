'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  X,
  CheckCircle2,
  MapPin,
  Briefcase,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const JobAlertModal: React.FC = () => {
  const { isJobAlertModalOpen, setIsJobAlertModalOpen, addJobAlert } = useApp();

  const [keyword, setKeyword] = useState('Senior Full-Stack Engineer');
  const [location, setLocation] = useState('Remote');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Instant'>('Daily');

  if (!isJobAlertModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    addJobAlert({
      keyword: keyword.trim(),
      location,
      experienceLevel,
      frequency,
    });
    setIsJobAlertModalOpen(false);
  };

  return (
    <div
      onClick={() => setIsJobAlertModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-[#0a66c2]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Create Job Alert</h2>
              <p className="text-xs text-slate-500">
                Get notified as soon as high-match roles are published
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsJobAlertModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title, Skill, or Keywords *
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Next.js, Lead Frontend, AI Engineer"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                >
                  <option value="Remote">Remote Only</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Anywhere">Anywhere</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              >
                <option value="Entry-Level">Entry-Level (0-2 yrs)</option>
                <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
                <option value="Lead">Lead / Staff</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alert Notification Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Daily', 'Weekly', 'Instant'] as const).map((freq) => (
                <button
                  type="button"
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    frequency === freq
                      ? 'border-[#0a66c2] bg-blue-50 text-[#0a66c2]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#0a66c2] shrink-0 mt-0.5" />
            <span>
              You will receive automated job match notifications delivered straight to your BusyBoxes notifications and registered inbox.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsJobAlertModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-lg transition-colors shadow-2xs"
            >
              Create Job Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
