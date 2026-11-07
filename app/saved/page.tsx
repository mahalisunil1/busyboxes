'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GigCard } from '@/components/GigCard';
import { JobCard } from '@/components/JobCard';
import { Bookmark, Layers, Briefcase } from 'lucide-react';

export default function SavedPage() {
  const { gigs, jobs, savedGigIds, savedJobIds } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'gigs'>('all');

  const savedGigs = gigs.filter((g) => savedGigIds.includes(g.id));
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  const totalSaved = savedGigs.length + savedJobs.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0a66c2]">
              Saved Collection
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{totalSaved} saved listings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Bookmarked Jobs & Services
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'all'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalSaved})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'jobs'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('gigs')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'gigs'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Services ({savedGigs.length})
          </button>
        </div>
      </div>

      {totalSaved === 0 ? (
        <div className="py-20 text-center rounded-xl bg-white border border-slate-200 space-y-3 p-6">
          <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No saved items</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any job card or gig to bookmark it for later review.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Link
              href="/jobs"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96]"
            >
              Browse Jobs
            </Link>
            <Link
              href="/gigs"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Browse Services
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === 'all' || activeTab === 'jobs') && savedJobs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0a66c2]" />
                <span>Saved Jobs ({savedJobs.length})</span>
              </h2>
              <div className="space-y-3">
                {savedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'gigs') && savedGigs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0a66c2]" />
                <span>Saved Services ({savedGigs.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedGigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
