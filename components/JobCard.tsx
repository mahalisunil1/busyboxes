'use client';

import React from 'react';
import { Job } from '@/types';
import { useApp } from '@/context/AppContext';
import gsap from 'gsap';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
  Building,
  Star,
  Users,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { setSelectedJob, isJobSaved, toggleSaveJob, openApplyModal } = useApp();
  const saved = isJobSaved(job.id);

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    gsap.fromTo(e.currentTarget, { scale: 0.72 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    toggleSaveJob(job.id);
  };

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000).toFixed(0)}k`;
  };

  return (
    <div
      onClick={() => setSelectedJob(job)}
      className="pro-card p-5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all space-y-3.5"
    >
      {/* Top Header: Company Logo, Title, and Bookmark */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {job.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building className="w-6 h-6 text-slate-400" />
            )}
          </div>

          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 hover:text-[#0a66c2] transition-colors leading-snug">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{job.company}</span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>4.5</span>
              </div>
              <span className="text-slate-300">•</span>
              <span>{job.applicantsCount} applicants</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className={`p-2 rounded-lg border transition-colors ${
            saved
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={saved ? 'Remove saved' : 'Save job'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info Badges (Experience, Salary, Location) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{job.experienceLevel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">
            {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} / yr
          </span>
        </div>

        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{job.location} ({job.workLocation})</span>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Tags & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0a66c2]">
            {job.type}
          </span>
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-[11px] text-slate-400">
            Posted {job.postedDate}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openApplyModal(job);
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
