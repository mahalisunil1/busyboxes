'use client';

import React, { useState, useMemo, Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { Job } from '@/types';
import gsap from 'gsap';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Building,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Share2,
  LayoutGrid,
  Columns2,
  Check,
  Bell,
  ArrowLeft,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { JobType, WorkLocation, ExperienceLevel } from '@/types';

function JobsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const {
    jobs,
    setIsPostModalOpen,
    openPostModal,
    isJobSaved,
    toggleSaveJob,
    openApplyModal,
    showToast,
    applications,
    setIsJobAlertModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedExp, setSelectedExp] = useState<string>('all');
  const [minSalary, setMinSalary] = useState<number>(100000);
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Selected job for the right-hand master-detail pane
  const [activeJobId, setActiveJobId] = useState<string>('');

  // GSAP animation refs
  const jobListRef = useRef<HTMLDivElement>(null);
  const detailPaneRef = useRef<HTMLDivElement>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
      }

      // Category
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }

      // Job Type
      if (selectedType !== 'all' && job.type !== selectedType) {
        return false;
      }

      // Work Location
      if (selectedLocation !== 'all' && job.workLocation !== selectedLocation) {
        return false;
      }

      // Experience Level
      if (selectedExp !== 'all' && job.experienceLevel !== selectedExp) {
        return false;
      }

      // Salary Min
      if (job.salaryMax < minSalary) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedCategory, selectedType, selectedLocation, selectedExp, minSalary]);

  // Derive active job cleanly without synchronous effect cascading render
  const activeJob = useMemo(() => {
    if (activeJobId && filteredJobs.some((j) => j.id === activeJobId)) {
      return jobs.find((j) => j.id === activeJobId) || null;
    }
    return filteredJobs[0] || null;
  }, [jobs, activeJobId, filteredJobs]);

  const activeApplied = useMemo(() => {
    return activeJob ? applications.find((a) => a.jobId === activeJob.id) : null;
  }, [activeJob, applications]);

  // GSAP: Stagger job cards entrance on filtered results or category change
  useEffect(() => {
    if (!jobListRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.job-card-item',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }, jobListRef);
    return () => ctx.revert();
  }, [filteredJobs.length, selectedCategory, selectedType, selectedLocation, selectedExp, minSalary]);

  // GSAP: Smooth cross-fade & micro-slide on active job detail pane
  useEffect(() => {
    if (!detailPaneRef.current) return;
    gsap.fromTo(
      detailPaneRef.current,
      { opacity: 0.35, y: 8 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );
  }, [activeJobId]);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>, jobId: string) => {
    e.stopPropagation();
    gsap.fromTo(e.currentTarget, { scale: 0.72 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    toggleSaveJob(jobId);
  };

  // Keyboard navigation for jobs (j/k or alt+arrows, a to apply, s to save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTagName = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTagName === 'input' || activeTagName === 'textarea') return;

      if (e.key === 'j' || (e.key === 'ArrowDown' && e.altKey)) {
        e.preventDefault();
        const currentIndex = filteredJobs.findIndex((j) => j.id === activeJobId);
        if (currentIndex >= 0 && currentIndex < filteredJobs.length - 1) {
          setActiveJobId(filteredJobs[currentIndex + 1].id);
        }
      } else if (e.key === 'k' || (e.key === 'ArrowUp' && e.altKey)) {
        e.preventDefault();
        const currentIndex = filteredJobs.findIndex((j) => j.id === activeJobId);
        if (currentIndex > 0) {
          setActiveJobId(filteredJobs[currentIndex - 1].id);
        }
      } else if (e.key === 'a' && activeJob) {
        e.preventDefault();
        openApplyModal(activeJob);
      } else if (e.key === 's' && activeJob) {
        e.preventDefault();
        toggleSaveJob(activeJob.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredJobs, activeJobId, activeJob, openApplyModal, toggleSaveJob]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedExp('all');
    setMinSalary(100000);
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (selectedExp !== 'all' ? 1 : 0) +
    (minSalary > 100000 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000).toFixed(0)}k`;
  };

  const handleShare = (job: Job) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Link copied for ${job.title}!`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Search Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-colors focus-within:bg-white focus-within:border-[#0a66c2] focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, tech stack (e.g. Next.js, Python), or company..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isFilterDrawerOpen || activeFilterCount > 0
                  ? 'border-[#0a66c2] bg-blue-50/80 text-[#0a66c2] shadow-2xs font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Set Alert Button */}
            <button
              onClick={() => setIsJobAlertModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold transition-all shadow-2xs"
              title="Set custom job alert digest"
            >
              <Bell className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span className="hidden sm:inline">Set Alert</span>
            </button>

            {/* View Mode Toggle (Split-View vs List-View) */}
            <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
              <button
                onClick={() => setViewMode('split')}
                title="Split View"
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'split'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Split</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">List</span>
              </button>
            </div>

            <button
              onClick={() => openPostModal()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Post an Opportunity</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Quick:</span>
          <button
            onClick={() => setSelectedLocation(selectedLocation === 'Remote' ? 'all' : 'Remote')}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
              selectedLocation === 'Remote'
                ? 'bg-blue-50 border-[#0a66c2] text-[#0a66c2] font-bold shadow-2xs'
                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            ⚡ Remote Only
          </button>
          <button
            onClick={() => setSelectedType(selectedType === 'Full-Time' ? 'all' : 'Full-Time')}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
              selectedType === 'Full-Time'
                ? 'bg-blue-50 border-[#0a66c2] text-[#0a66c2] font-bold shadow-2xs'
                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            💼 Full-Time
          </button>
          <button
            onClick={() => setMinSalary(minSalary >= 160000 ? 100000 : 160000)}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
              minSalary >= 160000
                ? 'bg-blue-50 border-[#0a66c2] text-[#0a66c2] font-bold shadow-2xs'
                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            💰 $160k+ Salary
          </button>
          <button
            onClick={() => setSelectedExp(selectedExp === 'Senior' ? 'all' : 'Senior')}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
              selectedExp === 'Senior'
                ? 'bg-blue-50 border-[#0a66c2] text-[#0a66c2] font-bold shadow-2xs'
                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            🎯 Senior Level
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[#0a66c2] hover:underline font-semibold text-xs ml-auto flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Expanded Filters Panel */}
      {isFilterDrawerOpen && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-150">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Functional Domain</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#0a66c2]"
            >
              <option value="all">All Domains</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#0a66c2]"
            >
              <option value="all">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Contract">Contract</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Seniority Level</label>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#0a66c2]"
            >
              <option value="all">All Seniority</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Staff</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Min Salary</span>
              <span className="text-[#0a66c2]">${(minSalary / 1000).toFixed(0)}k/yr</span>
            </div>
            <input
              type="range"
              min="80000"
              max="240000"
              step="10000"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full accent-[#0a66c2] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredJobs.length}</strong> verified positions
        </span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Updated daily
        </span>
      </div>

      {/* MAIN VIEW: LINKEDIN STYLE SPLIT PANE */}
      {filteredJobs.length === 0 ? (
        <div className="py-20 text-center rounded-xl bg-white border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No jobs match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or clearing search terms to explore all active positions.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96]"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'split' ? (
        /* SPLIT MASTER-DETAIL LAYOUT (LinkedIn Gold Standard) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (5 Cols): Scrollable List of Jobs */}
          <div ref={jobListRef} className="lg:col-span-5 space-y-3 max-h-[820px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isSelected = activeJob?.id === job.id;
              const saved = isJobSaved(job.id);
              const applied = applications.find((a) => a.jobId === job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setActiveJobId(job.id);
                    setIsMobileDetailOpen(true);
                  }}
                  className={`job-card-item p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-50/50 border-[#0a66c2] shadow-[0_4px_16px_-4px_rgba(10,102,194,0.12)] border-l-[4px] border-l-[#0a66c2]'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200/80 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 hover:text-[#0a66c2] truncate leading-snug">
                          {job.title}
                        </h4>
                        <p className="text-xs text-slate-700 font-semibold mt-0.5">{job.company}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{job.location} ({job.workLocation})</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleHeartClick(e, job.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        saved ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={saved ? 'Remove from saved' : 'Save job'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs">
                    <span className="font-bold text-slate-900 bg-slate-100/90 px-2.5 py-0.5 rounded-md">
                      {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100/70 text-slate-600">
                      {job.type}
                    </span>
                    {applied && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Applied ({applied.status})
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px] font-medium ml-auto">
                      {job.postedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (7 Cols): Sticky Detailed Master Pane */}
          <div className="hidden lg:block lg:col-span-7 sticky top-20">
            {activeJob ? (
              <div ref={detailPaneRef} className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] p-6 space-y-6 max-h-[820px] overflow-y-auto">
                {/* Header Action Row */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <img
                      src={activeJob.companyLogo}
                      alt={activeJob.company}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200/80 shadow-2xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{activeJob.company}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-500">Verified Employer</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                        {activeJob.title}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {activeJob.location} ({activeJob.workLocation})
                        </span>
                        <span>•</span>
                        <span>{activeJob.applicantsCount} applicants</span>
                        <span>•</span>
                        <span>Posted {activeJob.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleShare(activeJob)}
                      className="p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                      title="Share job"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleHeartClick(e, activeJob.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isJobSaved(activeJob.id)
                          ? 'border-rose-200 bg-rose-50 text-rose-600'
                          : 'border-slate-200/90 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                      title="Save job"
                    >
                      <Heart className={`w-4 h-4 ${isJobSaved(activeJob.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Quick Action Button & Key Specs Summary */}
                {activeApplied ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-950">Application Active</span>
                        <p className="text-[11px] text-emerald-700">
                          Status: <strong>{activeApplied.status}</strong> • Submitted {activeApplied.appliedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => openApplyModal(activeJob)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs"
                      >
                        Update
                      </button>
                      <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        Track in Dashboard →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-3 gap-3 divide-x divide-slate-200/80 flex-1">
                      <div className="pr-2">
                        <span className="text-[11px] font-medium text-slate-500 block">Compensation</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {formatSalary(activeJob.salaryMin)} - {formatSalary(activeJob.salaryMax)}
                        </p>
                      </div>
                      <div className="px-2">
                        <span className="text-[11px] font-medium text-slate-500 block">Work Type</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{activeJob.type}</p>
                      </div>
                      <div className="pl-2">
                        <span className="text-[11px] font-medium text-slate-500 block">Seniority</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{activeJob.experienceLevel}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openApplyModal(activeJob)}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] transition-all duration-150 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <span>Easy Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Candidate Skill Match Widget (LinkedIn Style) */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0a66c2]" />
                      Skills Matching Your Profile:
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      100% Match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-blue-100 shadow-2xs flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Job Details Section */}
                <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      About the Role
                    </h3>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">{activeJob.description}</p>
                  </div>

                  {activeJob.responsibilities && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Key Responsibilities
                      </h3>
                      <ul className="space-y-2 text-slate-600">
                        {activeJob.responsibilities.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0a66c2] shrink-0 mt-2" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeJob.requirements && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Qualifications & Experience
                      </h3>
                      <ul className="space-y-2 text-slate-600">
                        {activeJob.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeJob.benefits && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {activeJob.benefits.map((b, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hiring Team Info Card */}
                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0a66c2]/10 text-[#0a66c2] flex items-center justify-center font-bold text-sm">
                      BB
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">BusyBoxes Verified Employer</span>
                      <p className="text-[11px] text-slate-500">
                        Typically reviews applications within 24-48 hours. Responsive Employer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* SINGLE LIST VIEW (Standard Cards) */
        <div ref={jobListRef} className="space-y-3.5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => {
                setActiveJobId(job.id);
                openApplyModal(job);
              }}
              className="job-card-item p-5 bg-white border border-slate-200/90 hover:border-[#0a66c2]/80 rounded-2xl cursor-pointer transition-all duration-200 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 space-y-3.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shadow-2xs shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 hover:text-[#0a66c2] transition-colors tracking-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5">{job.company}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location} ({job.workLocation})</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleHeartClick(e, job.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isJobSaved(job.id) ? 'bg-rose-50 text-rose-600 border-rose-200' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isJobSaved(job.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 bg-slate-100/90 px-2.5 py-0.5 rounded-md">
                    {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} / yr
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100/70 text-slate-600">
                    {job.type}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1">
                  <span>Quick Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MOBILE DETAIL SLIDE-OVER SHEET (Robust Mobile UX) */}
      {isMobileDetailOpen && activeJob && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 bg-white border-b border-slate-200 shadow-2xs">
            <button
              onClick={() => setIsMobileDetailOpen(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0a66c2]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all jobs</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(activeJob)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600"
                title="Share job"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSaveJob(activeJob.id)}
                className={`p-1.5 rounded-lg border ${
                  isJobSaved(activeJob.id)
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 text-slate-600'
                }`}
                title="Save job"
              >
                <Heart className={`w-4 h-4 ${isJobSaved(activeJob.id) ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setIsMobileDetailOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5 pb-24">
            <div className="flex items-start gap-3">
              <img
                src={activeJob.companyLogo}
                alt={activeJob.company}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div>
                <span className="text-xs font-semibold text-slate-600">{activeJob.company}</span>
                <h2 className="text-base font-bold text-slate-900 leading-snug">{activeJob.title}</h2>
                <p className="text-xs text-slate-500 pt-0.5">{activeJob.location} ({activeJob.workLocation})</p>
              </div>
            </div>

            {/* Compensation & Action */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-xs text-slate-500">Compensation</span>
                <p className="text-base font-bold text-slate-900">
                  {formatSalary(activeJob.salaryMin)} - {formatSalary(activeJob.salaryMax)} / yr
                </p>
              </div>
              <button
                onClick={() => {
                  setIsMobileDetailOpen(false);
                  openApplyModal(activeJob);
                }}
                className="w-full py-2.5 rounded-lg font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#084e96] shadow-xs"
              >
                Easy Apply
              </button>
            </div>

            {/* Description */}
            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">About the Role</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{activeJob.description}</p>
              </div>
              {activeJob.requirements && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Requirements</h3>
                  <ul className="space-y-1 text-slate-600">
                    {activeJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading jobs portal...</div>}>
      <JobsContent />
    </Suspense>
  );
}
