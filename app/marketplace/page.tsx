'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { JobCard } from '@/components/JobCard';
import { GigCard } from '@/components/GigCard';
import {
  Briefcase,
  Sparkles,
  Search,
  ArrowRight,
  PlusCircle,
  Filter,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Layers,
  Building,
} from 'lucide-react';

function MarketplaceContent() {
  const { jobs, gigs, openPostModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'jobs' | 'gigs'>('all');

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
      }
      return true;
    });
  }, [jobs, selectedCategory, searchQuery]);

  // Filter gigs
  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      if (selectedCategory !== 'all' && gig.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = gig.title.toLowerCase().includes(q);
        const matchesSeller = gig.sellerName?.toLowerCase().includes(q) || false;
        const matchesTags = gig.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSeller && !matchesTags) return false;
      }
      return true;
    });
  }, [gigs, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header & Breathable Hero Banner */}
      <div className="bg-white border-b border-slate-200/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0a66c2] text-xs font-bold tracking-wide">
                <Layers className="w-3.5 h-3.5" />
                <span>Unified Marketplace Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Career Jobs & Freelance Services
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect with leading tech companies hiring full-time or hire verified specialists
                for turnkey fixed-price deliverables with milestone escrow protection.
              </p>
            </div>

            {/* Action CTA: Post an Opportunity */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => openPostModal()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] shadow-2xs transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post an Opportunity</span>
              </button>
            </div>
          </div>

          {/* Unified Search & Category Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across career roles, skills, or freelance deliverables..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Controlled Segmented Toggle: All, Jobs, Gigs */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold shrink-0">
              <button
                onClick={() => setViewFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  viewFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Opportunities ({jobs.length + gigs.length})
              </button>
              <button
                onClick={() => setViewFilter('jobs')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewFilter === 'jobs'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Career Jobs ({filteredJobs.length})</span>
              </button>
              <button
                onClick={() => setViewFilter('gigs')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewFilter === 'gigs'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Freelance Gigs ({filteredGigs.length})</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#0a66c2] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* SECTION 1: CAREER JOBS */}
        {(viewFilter === 'all' || viewFilter === 'jobs') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Career Opportunities & Full-Time Openings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {filteredJobs.length} verified listings with transparent salary bands
                  </p>
                </div>
              </div>

              <Link
                href="/jobs"
                className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1 group"
              >
                <span>View Full Job Board</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No career openings matched your current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(viewFilter === 'all' ? filteredJobs.slice(0, 6) : filteredJobs).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: FREELANCE SERVICES & GIGS */}
        {(viewFilter === 'all' || viewFilter === 'gigs') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Freelance Services & Turnkey Deliverables
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {filteredGigs.length} fixed-price packages with verified escrow protection
                  </p>
                </div>
              </div>

              <Link
                href="/gigs"
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 group"
              >
                <span>Browse Full Services Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {filteredGigs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No freelance gigs matched your current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(viewFilter === 'all' ? filteredGigs.slice(0, 8) : filteredGigs).map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Breathable Bottom Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Are You Hiring or Offering Services?
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Post an Opportunity in Under 60 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Publish a job opening with automated applicant pipeline tracking, or list a freelance gig
              with custom 3-tier packages and escrow protection.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openPostModal()}
              className="px-5 py-3 rounded-xl text-xs font-bold bg-[#0a66c2] text-white hover:bg-[#084e96] transition-all shadow-md hover:scale-105 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post an Opportunity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}

