'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import gsap from 'gsap';
import {
  Search,
  Briefcase,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  Bell,
  PlusCircle,
  ShieldCheck,
  User,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Keyboard,
  Store,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    jobs,
    gigs,
    setSelectedJob,
    setSelectedGig,
    setIsPostModalOpen,
    openPostModal,
    setIsJobAlertModalOpen,
    setIsProfileDrawerOpen,
    setIsShortcutsModalOpen,
    setIsPersonaModalOpen,
    toggleRole,
    role,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input and trigger GSAP pop on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 30);

      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { scale: 0.94, opacity: 0, y: -10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
        );
      }
      return () => clearTimeout(timer);
    }
  }, [isCommandPaletteOpen]);

  // Static action items
  const staticActions = useMemo(
    () => [
      {
        id: 'nav-jobs',
        category: 'Navigation',
        title: 'Explore Jobs',
        subtitle: 'Browse 15+ verified developer, designer, and PM openings',
        icon: Briefcase,
        action: () => router.push('/jobs'),
      },
      {
        id: 'nav-gigs',
        category: 'Navigation',
        title: 'Freelance Services & Gigs',
        subtitle: 'Hire vetted developers for turnkey deliverables',
        icon: Layers,
        action: () => router.push('/gigs'),
      },
      {
        id: 'nav-dash',
        category: 'Navigation',
        title: 'My Dashboard',
        subtitle: 'Track candidate applications, ATS pipeline & earnings',
        icon: LayoutDashboard,
        action: () => router.push('/dashboard'),
      },
      {
        id: 'nav-msgs',
        category: 'Navigation',
        title: 'Messages & Inquiries',
        subtitle: 'Chat directly with recruiters and service sellers',
        icon: MessageSquare,
        action: () => router.push('/messages'),
      },
      {
        id: 'nav-saved',
        category: 'Navigation',
        title: 'Saved Bookmarks',
        subtitle: 'View saved jobs and bookmarked freelance services',
        icon: Bookmark,
        action: () => router.push('/saved'),
      },
      {
        id: 'act-post',
        category: 'Quick Actions',
        title: role === 'employer' ? 'Post a New Job Opening' : 'List a Freelance Service',
        subtitle: 'Publish in minutes to our vetted talent marketplace',
        icon: PlusCircle,
        action: () => setIsPostModalOpen(true),
      },
      {
        id: 'act-alert',
        category: 'Quick Actions',
        title: 'Create Instant Job Alert',
        subtitle: 'Receive notification digests for your matched roles',
        icon: Bell,
        action: () => setIsJobAlertModalOpen(true),
      },
      {
        id: 'act-profile',
        category: 'Quick Actions',
        title: 'Edit My Profile & Resume',
        subtitle: 'Update skills, headline, experience, and uploaded PDF',
        icon: User,
        action: () => setIsProfileDrawerOpen(true),
      },
      {
        id: 'act-switch-role',
        category: 'Quick Actions',
        title: `Switch Mode: ${role === 'freelancer' ? 'Switch to Employer / Recruiter' : 'Switch to Job Seeker'}`,
        subtitle: 'Change portal perspective and ATS tools',
        icon: ShieldCheck,
        action: () => toggleRole(),
      },
      {
        id: 'act-shortcuts',
        category: 'Quick Actions',
        title: 'Keyboard Shortcuts Cheat Sheet',
        subtitle: 'Learn fast navigation hotkeys',
        icon: Keyboard,
        action: () => setIsShortcutsModalOpen(true),
      },
    ],
    [
      role,
      router,
      setIsPostModalOpen,
      setIsJobAlertModalOpen,
      setIsProfileDrawerOpen,
      setIsShortcutsModalOpen,
      toggleRole,
    ]
  );

  // Filtered Results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return staticActions;
    }

    // Filter static
    const matchedActions = staticActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );

    // Filter jobs
    const matchedJobs = jobs
      .filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((j) => ({
        id: `job-${j.id}`,
        category: 'Job Openings',
        title: j.title,
        subtitle: `${j.company} • ${j.location} • $${(j.salaryMin / 1000).toFixed(0)}k-$${(
          j.salaryMax / 1000
        ).toFixed(0)}k`,
        icon: Briefcase,
        action: () => {
          setSelectedJob(j);
        },
      }));

    // Filter gigs
    const matchedGigs = gigs
      .filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.sellerName.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map((g) => ({
        id: `gig-${g.id}`,
        category: 'Freelance Services',
        title: g.title,
        subtitle: `By ${g.sellerName} • Starts from $${g.startingPrice} • ★ ${g.rating.toFixed(1)}`,
        icon: Layers,
        action: () => {
          setSelectedGig(g);
        },
      }));

    return [...matchedActions, ...matchedJobs, ...matchedGigs];
  }, [query, staticActions, jobs, gigs, setSelectedJob, setSelectedGig]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
          setIsCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, results, selectedIndex, setIsCommandPaletteOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, job title, company, or service..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400">
                Try searching for &quot;Next.js&quot;, &quot;Post a Job&quot;, or &quot;Dashboard&quot;.
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  data-active={isSelected ? 'true' : 'false'}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 text-slate-900 border-l-4 border-[#0a66c2]'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-blue-100 text-[#0a66c2]' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ${
                      isSelected ? 'opacity-100 text-[#0a66c2]' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold shadow-2xs">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold shadow-2xs">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold shadow-2xs">↵</kbd> to select
            </span>
          </div>
          <span>BusyBoxes Spotlight</span>
        </div>
      </div>
    </div>
  );
};
