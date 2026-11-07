'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { JobCard } from '@/components/JobCard';
import { GigCard } from '@/components/GigCard';
import {
  Search,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const POPULAR_TAGS = [
  'Remote Full-Stack',
  'Next.js 16 & AI',
  'Product Design',
  'Cloud & DevOps',
  'AI Engineering',
];

export default function Home() {
  const router = useRouter();
  const { jobs, gigs, openPostModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'gigs'>('jobs');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (activeTab === 'jobs') {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/gigs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-24">
      {/* BREATHABLE HERO SECTION */}
      <section className="bg-white border-b border-slate-200/70 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0a66c2] border border-blue-100 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0a66c2]" />
            <span>Over 2,400+ Verified Positions & Turnkey Gigs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Where modern tech talent finds careers and turnkey freelance gigs.
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Browse verified full-time engineering and design roles with transparent compensation, or hire specialists with escrow milestone protection.
          </p>

          {/* Unified, Spacious Search Dock */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-2xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] flex items-center gap-2 transition-all focus-within:border-[#0a66c2] focus-within:ring-3 focus-within:ring-blue-100"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, frameworks, or freelance services (e.g. Next.js, AI)..."
                  className="w-full pl-10 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-3">
              <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                Trending:
              </span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/jobs?q=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TWO AIRY, DISTINCT PATHWAYS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Career Openings */}
          <Link
            href="/jobs"
            className="group p-8 bg-white rounded-3xl border border-slate-200/90 hover:border-[#0a66c2] shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold shadow-2xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0a66c2] transition-colors">
                  Career Job Board
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Browse verified full-time, contract, and remote openings from high-growth companies. Filter by transparent salary bands and apply with 1-click Quick Apply.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#0a66c2]">
              <span>Explore {jobs.length}+ Career Roles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Freelance Gigs */}
          <Link
            href="/gigs"
            className="group p-8 bg-white rounded-3xl border border-slate-200/90 hover:border-purple-600 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-2xs">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Freelance Services & Gigs
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Order turnkey deliverables with verified 3-tier packages (Starter, Standard, Premium), clear delivery speeds, and full escrow milestone buyer protection.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-purple-600">
              <span>Browse {gigs.length}+ Freelance Gigs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED FEED WITH BREATHABLE TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`pb-2.5 text-sm sm:text-base font-bold transition-all border-b-2 -mb-2.5 ${
                activeTab === 'jobs'
                  ? 'border-[#0a66c2] text-[#0a66c2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Featured Career Opportunities ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gigs')}
              className={`pb-2.5 text-sm sm:text-base font-bold transition-all border-b-2 -mb-2.5 ${
                activeTab === 'gigs'
                  ? 'border-[#0a66c2] text-[#0a66c2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Top Freelance Deliverables ({gigs.length})
            </button>
          </div>

          <Link
            href={activeTab === 'jobs' ? '/jobs' : '/gigs'}
            className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all {activeTab === 'jobs' ? 'openings' : 'services'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeTab === 'jobs' ? (
          <div className="space-y-3.5">
            {jobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.slice(0, 3).map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </section>

      {/* BREATHABLE BOTTOM ACTION CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xs">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#0a66c2] uppercase tracking-wider">
              For Employers & Hiring Teams
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Hire vetted engineers & designers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Publish job openings, review candidate resumes in your ATS dashboard, schedule interviews, and export pipeline CSVs in one click.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => openPostModal('job')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs"
              >
                + Post a Job Opening
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Access Pipeline
              </Link>
            </div>
          </div>

          <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              For Freelancers & Agencies
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Sell your services with escrow protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create your 3-tier freelance gig packages with guaranteed milestone payouts. Connect with funded clients without bidding wars.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => openPostModal('gig')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-2xs"
              >
                + List a Freelance Gig
              </button>
              <Link
                href="/gigs"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
