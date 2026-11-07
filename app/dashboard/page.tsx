'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import gsap from 'gsap';
import {
  Briefcase,
  Layers,
  DollarSign,
  Clock,
  CheckCircle2,
  FileText,
  User,
  ShieldCheck,
  PlusCircle,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Search,
  Calendar,
  ArrowRight,
  Download,
  Bell,
  Trash2,
  ExternalLink,
  Video,
  Check,
  Building,
  TrendingUp,
  Award,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { JobApplication, GigOrder } from '@/types';

// GSAP-powered Counter Interpolation
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    const obj = objRef.current;
    const tween = gsap.to(obj, {
      val: value,
      duration: 0.85,
      ease: 'power3.out',
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${obj.val.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, prefix, suffix, decimals]);

  return (
    <span ref={spanRef}>
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export type DashboardMode = 'applier' | 'recruiter' | 'gigs';

export default function DashboardPage() {
  const {
    role,
    setRole,
    applications,
    updateApplicationStatus,
    orders,
    updateOrderStatus,
    gigs,
    jobs,
    openPostModal,
    openChatWith,
    showToast,
    currentUser,
    setIsProfileDrawerOpen,
    jobAlerts,
    toggleJobAlert,
    deleteJobAlert,
    setIsJobAlertModalOpen,
    exportCandidatesCSV,
    setIsPersonaModalOpen,
    activePersonaId,
  } = useApp();

  // Controlled 3-Reading Mode State: 'applier' | 'recruiter' | 'gigs'
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>(() => {
    if (activePersonaId === 'sarah-recruiter') return 'recruiter';
    if (activePersonaId === 'elena-designer') return 'gigs';
    return role === 'employer' ? 'recruiter' : 'applier';
  });

  // Sync mode when persona changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activePersonaId === 'sarah-recruiter') {
        setDashboardMode('recruiter');
      } else if (activePersonaId === 'elena-designer') {
        setDashboardMode('gigs');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activePersonaId]);

  // Applier Filter states
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Recruiter Filter states
  const [candidateFilterStage, setCandidateFilterStage] = useState<string>('all');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');

  // Interview modal simulation
  const [interviewModalCandidate, setInterviewModalCandidate] = useState<JobApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-10-30T14:00');

  // Withdraw simulation modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('850');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawOpen(false);
    showToast(`Direct deposit of $${withdrawAmount}.00 initiated to checking account •••• 8904.`, 'success');
  };

  const handleScheduleInterview = () => {
    if (interviewModalCandidate) {
      updateApplicationStatus(interviewModalCandidate.id, 'Interview Scheduled');
      setInterviewModalCandidate(null);
      showToast(`Technical interview scheduled with ${interviewModalCandidate.applicantName}!`, 'success');
    }
  };

  // Filtered applications for Applier
  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      if (appStatusFilter !== 'all' && a.status !== appStatusFilter) return false;
      if (appSearchQuery.trim()) {
        const q = appSearchQuery.toLowerCase();
        const matchesTitle = a.jobTitle.toLowerCase().includes(q);
        const matchesCompany = a.company.toLowerCase().includes(q);
        const matchesStatus = a.status.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesStatus) return false;
      }
      return true;
    });
  }, [applications, appStatusFilter, appSearchQuery]);

  // Filtered candidates for Recruiter
  const filteredCandidates = useMemo(() => {
    return applications.filter((app) => {
      if (candidateFilterStage !== 'all' && app.status !== candidateFilterStage) {
        return false;
      }
      if (candidateSearchQuery.trim()) {
        const q = candidateSearchQuery.toLowerCase();
        return (
          app.applicantName.toLowerCase().includes(q) ||
          app.jobTitle.toLowerCase().includes(q) ||
          app.applicantEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, candidateFilterStage, candidateSearchQuery]);

  // Status Stepper helper
  const getStepperStatusIndex = (status: JobApplication['status']) => {
    switch (status) {
      case 'Under Review':
        return 1;
      case 'Shortlisted':
        return 2;
      case 'Interview Scheduled':
        return 3;
      case 'Offer Extended':
        return 4;
      case 'Declined':
        return -1;
      default:
        return 0;
    }
  };

  // Scheduled interviews count
  const scheduledInterviewsCount = applications.filter(
    (a) => a.status === 'Interview Scheduled'
  ).length;

  // Shortlisted count
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted'
  ).length;

  // GSAP animation refs
  const dashboardContainerRef = useRef<HTMLDivElement>(null);
  const readingContentRef = useRef<HTMLDivElement>(null);

  // GSAP: Animate reading changes
  useEffect(() => {
    if (!readingContentRef.current) return;
    gsap.fromTo(
      readingContentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, [dashboardMode]);

  return (
    <div ref={dashboardContainerRef} className="min-h-screen bg-slate-50/50 pb-24">
      {/* ============================================================== */}
      {/* EXECUTIVE ENTERPRISE HEADER                                     */}
      {/* ============================================================== */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Identity & Workspace Strip */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'Alex Mercer'}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentUser?.name || 'Alex Mercer'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <ShieldCheck className="w-3 h-3 text-[#0a66c2]" />
                    <span>Verified Talent</span>
                  </span>
                  <button
                    onClick={() => setIsPersonaModalOpen(true)}
                    className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2.5 py-0.5 rounded-full transition-colors hidden sm:inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Switch Persona</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {currentUser?.title || 'Senior Software Engineer'} • {currentUser?.location || 'San Francisco, CA'} •{' '}
                  <span className="text-slate-700 font-semibold">{currentUser?.email}</span>
                </p>
              </div>
            </div>

            {/* Profile Completeness & Action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600">
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0a66c2] rounded-full transition-all duration-500"
                    style={{ width: `${currentUser?.profileCompleteness || 85}%` }}
                  />
                </div>
                <span className="font-bold text-slate-800">
                  {currentUser?.profileCompleteness || 85}% Profile Strength
                </span>
              </div>

              <button
                onClick={() => setIsProfileDrawerOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shadow-2xs"
              >
                Edit Resume & Bio
              </button>

              <button
                onClick={() => openPostModal()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-all shadow-2xs hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post an Opportunity</span>
              </button>
            </div>
          </div>

          {/* Controlled Segmented Switcher Strip */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs text-xs font-semibold">
              <button
                onClick={() => {
                  setDashboardMode('applier');
                  setRole('freelancer');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  dashboardMode === 'applier'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#0a66c2]" />
                <span>Candidate / Applier Hub</span>
                <span className="text-[10px] bg-blue-50 text-[#0a66c2] px-1.5 py-0.2 rounded-full font-bold">
                  {applications.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setDashboardMode('recruiter');
                  setRole('employer');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  dashboardMode === 'recruiter'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recruiter ATS Pipeline</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                  {applications.length + 32}
                </span>
              </button>

              <button
                onClick={() => setDashboardMode('gigs')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  dashboardMode === 'gigs'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Gigs & Escrow Deliverables</span>
                <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded-full font-bold">
                  {orders.length}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-center font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-Time Sync • BusyBoxes Production Workspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CONTROLLED READING CONTAINER                                   */}
      {/* ============================================================== */}
      <div ref={readingContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ============================================================== */}
        {/* READING 1: CANDIDATE / APPLIER READING                         */}
        {/* ============================================================== */}
        {dashboardMode === 'applier' && (
          <div className="space-y-8">
            {/* Actionable Next Step Callout Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                    Confirmed Interview
                  </span>
                  <span className="text-xs text-slate-300">Oct 30, 2026 • 2:00 PM EST</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Technical Architecture Round with HyperScale AI
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Host: <strong>Sarah Jenkins (VP of Engineering)</strong> • Focus: Next.js 16 App Router, micro-frontend architecture, and distributed state.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() =>
                    showToast('Opening virtual interview room simulation on Google Meet...', 'info')
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-[#0a66c2]" />
                  <span>Join Google Meet</span>
                </button>
                <button
                  onClick={() =>
                    showToast('Interview preparation guide downloaded as PDF.', 'success')
                  }
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                >
                  Prep Guide
                </button>
              </div>
            </div>

            {/* Candidate Executive KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Applications Sent
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={applications.length} />
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>1 Shortlisted</strong> • 1 in interview</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Interviews
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-600 tracking-tight">
                    <AnimatedNumber value={scheduledInterviewsCount || 1} />
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Upcoming round this week
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Profile Visibility
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-900 tracking-tight">
                    <AnimatedNumber value={48} />
                  </p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                    +18% recruiter searches
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Configured Alerts
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={jobAlerts.length} />
                  </p>
                  <button
                    onClick={() => setIsJobAlertModalOpen(true)}
                    className="text-xs text-[#0a66c2] font-bold hover:underline block mt-1"
                  >
                    + Add alert digest
                  </button>
                </div>
              </div>
            </div>

            {/* Applications Table / Cards Section */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Active Career Applications ({applications.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time status tracking, attached resume versions, and direct employer communications
                  </p>
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {[
                      { label: 'All', value: 'all' },
                      { label: 'Under Review', value: 'Under Review' },
                      { label: 'Shortlisted', value: 'Shortlisted' },
                      { label: 'Interview', value: 'Interview Scheduled' },
                    ].map((pill) => (
                      <button
                        key={pill.value}
                        onClick={() => setAppStatusFilter(pill.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          appStatusFilter === pill.value
                            ? 'bg-[#0a66c2] text-white shadow-2xs font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={appSearchQuery}
                      onChange={(e) => setAppSearchQuery(e.target.value)}
                      placeholder="Search company or role..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-500 space-y-3">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">No applications matched your filter criteria.</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs"
                  >
                    <span>Explore Open Opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => {
                    const stepIdx = getStepperStatusIndex(app.status);
                    const isExpanded = expandedAppId === app.id;

                    return (
                      <div
                        key={app.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[#0a66c2] text-sm shrink-0 shadow-2xs">
                              {app.company.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">{app.company}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] text-slate-400">Ref: #{app.id}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] text-slate-400">Applied {app.appliedDate}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                {app.jobTitle}
                              </h4>
                              <p className="text-xs text-slate-500">
                                Attached Resume: <strong className="text-slate-700">{app.resumeFileName}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-start sm:self-auto">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                app.status === 'Shortlisted'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : app.status === 'Interview Scheduled'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : app.status === 'Offer Extended'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : app.status === 'Declined'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-blue-50 text-[#0a66c2] border-blue-200'
                              }`}
                            >
                              {app.status}
                            </span>

                            <button
                              onClick={() => openChatWith(app.company, '')}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                              title="Message hiring team"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              <span>{isExpanded ? 'Hide' : 'Timeline'}</span>
                              <ChevronRight
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Timeline Stepper */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                ATS Stage Progression:
                              </span>
                              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                {[
                                  { label: 'Application Submitted', index: 0 },
                                  { label: 'Screening Review', index: 1 },
                                  { label: 'Shortlisted Pool', index: 2 },
                                  { label: 'Technical Interview', index: 3 },
                                ].map((step) => {
                                  const isCompleted = stepIdx >= step.index;
                                  const isCurrent = stepIdx === step.index;

                                  return (
                                    <div key={step.label} className="space-y-1.5">
                                      <div
                                        className={`h-2 rounded-full transition-all ${
                                          isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                                        }`}
                                      />
                                      <span
                                        className={`text-[11px] block leading-tight ${
                                          isCurrent
                                            ? 'font-bold text-slate-900'
                                            : isCompleted
                                            ? 'font-semibold text-emerald-700'
                                            : 'text-slate-400'
                                        }`}
                                      >
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {app.coverLetter && (
                              <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 italic">
                                &quot;{app.coverLetter}&quot;
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Job Alerts Management */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Active Job Alerts & Notification Digests ({jobAlerts.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automated email and notification dispatches matching your skill tags and target compensation
                  </p>
                </div>
                <button
                  onClick={() => setIsJobAlertModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Create Alert</span>
                </button>
              </div>

              {jobAlerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active alerts configured.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {jobAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {alert.keyword}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              alert.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {alert.active ? '● Active Daily Digest' : 'Paused'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {alert.location} • {alert.experienceLevel} • Frequency: <strong>{alert.frequency}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleJobAlert(alert.id)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {alert.active ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          onClick={() => deleteJobAlert(alert.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* READING 2: RECRUITER / EMPLOYER ATS READING                   */}
        {/* ============================================================== */}
        {dashboardMode === 'recruiter' && (
          <div className="space-y-8">
            {/* Recruiter Executive KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Openings
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={jobs.length} />
                  </p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                    ● Accepting applications
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total In Pipeline
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-900 tracking-tight">
                    <AnimatedNumber value={applications.length + 32} />
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    92% qualified match rate
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Interviews
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-600 tracking-tight">
                    <AnimatedNumber value={4} />
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Technical rounds this week
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Hiring Budget
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={18200} prefix="$" />
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Escrow protected funds
                  </span>
                </div>
              </div>
            </div>

            {/* Ashby / Greenhouse-Grade Candidate CRM */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-6 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Candidate Pipeline CRM ({applications.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Screen applicants, transition hiring stages, schedule interviews, and export ATS data
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportCandidatesCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0a66c2]" />
                    <span>Export ATS CSV</span>
                  </button>

                  <button
                    onClick={() => openPostModal('job')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white transition-colors shadow-2xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Post Job Opening</span>
                  </button>
                </div>
              </div>

              {/* Stage Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                  {[
                    { label: 'All Candidates', value: 'all' },
                    { label: 'Under Review', value: 'Under Review' },
                    { label: 'Shortlisted', value: 'Shortlisted' },
                    { label: 'Interview Scheduled', value: 'Interview Scheduled' },
                    { label: 'Offer Extended', value: 'Offer Extended' },
                  ].map((stage) => (
                    <button
                      key={stage.value}
                      onClick={() => setCandidateFilterStage(stage.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        candidateFilterStage === stage.value
                          ? 'bg-[#0a66c2] text-white shadow-2xs font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={candidateSearchQuery}
                    onChange={(e) => setCandidateSearchQuery(e.target.value)}
                    placeholder="Search candidate name or skill..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Candidate Pipeline Rows */}
              <div className="divide-y divide-slate-100">
                {filteredCandidates.map((app) => (
                  <div
                    key={app.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-blue-100 text-[#0a66c2] flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                        {app.applicantName.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{app.applicantName}</h4>
                          <span className="text-xs text-slate-400">({app.applicantEmail})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            96% Match
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#0a66c2]">
                          Applied For: {app.jobTitle}
                        </p>
                        <p className="text-xs text-slate-500">
                          {app.yearsExperience} yrs experience • Resume: <strong className="text-slate-700">{app.resumeFileName}</strong>
                        </p>
                        {app.coverLetter && (
                          <p className="text-xs text-slate-600 italic line-clamp-1 pt-0.5">
                            &quot;{app.coverLetter}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pipeline Quick Controls */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value as JobApplication['status'])
                        }
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 font-semibold focus:outline-none shadow-2xs"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Offer Extended">Offer Extended</option>
                        <option value="Declined">Declined</option>
                      </select>

                      <button
                        onClick={() => setInterviewModalCandidate(app)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Call</span>
                      </button>

                      <button
                        onClick={() => openChatWith(app.applicantName, '')}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Chat with candidate"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          showToast(`Downloading ${app.resumeFileName} for ${app.applicantName}...`, 'info');
                        }}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Download candidate resume (PDF)"
                      >
                        <FileText className="w-4 h-4 text-[#0a66c2]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Managed Job Requisitions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Managed Job Requisitions ({jobs.length})
                </h3>
                <Link
                  href="/jobs"
                  className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1"
                >
                  <span>View All Open Positions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.slice(0, 3).map((j) => (
                  <div key={j.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600">● Accepting Applicants</span>
                      <span className="text-slate-400 font-semibold">{j.applicantsCount} candidates</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{j.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{j.company} • {j.location}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">
                        ${(j.salaryMin/1000).toFixed(0)}k - ${(j.salaryMax/1000).toFixed(0)}k USD
                      </span>
                      <Link
                        href="/jobs"
                        className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* READING 3: GIGS & DELIVERABLES READING                        */}
        {/* ============================================================== */}
        {dashboardMode === 'gigs' && (
          <div className="space-y-8">
            {/* Gigs Executive KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Orders
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={orders.length} />
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    100% on-time milestone delivery
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Available Payout
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={3450} prefix="$" decimals={2} />
                  </p>
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="text-xs text-[#0a66c2] hover:underline font-bold block mt-1"
                  >
                    Withdraw funds →
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    In Escrow Hold
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-600 tracking-tight">
                    <AnimatedNumber value={1200} prefix="$" decimals={2} />
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Released upon client approval
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Published Gigs
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    <AnimatedNumber value={gigs.length} />
                  </p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                    ● Active in marketplace
                  </span>
                </div>
              </div>
            </div>

            {/* Active Milestone Deliverables */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Active Milestone Deliverables ({orders.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client deliverables, progress percentages, and automated escrow milestones
                  </p>
                </div>

                <button
                  onClick={() => openPostModal('gig')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ List a New Gig</span>
                </button>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#0a66c2]">#{ord.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-semibold capitalize">{ord.packageTier} Package</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-extrabold text-slate-900">${ord.price} USD</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{ord.gigTitle}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Client: <strong className="text-slate-700">{ord.sellerName}</strong> • Delivery Due: {ord.dueDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as GigOrder['status'])}
                          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 font-semibold focus:outline-none shadow-2xs"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Reviewing Delivery">Reviewing Delivery</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => openChatWith(ord.sellerName, '')}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          title="Message client"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Milestone Deliverable Progress</span>
                        <span className="font-bold text-slate-900">{ord.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${ord.progressPercentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Published Services Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Your Published Freelance Gigs
                </h3>
                <Link
                  href="/gigs"
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                >
                  <span>Browse Public Services Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gigs.slice(0, 2).map((gig) => (
                  <div key={gig.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex gap-3.5 hover:border-slate-300 transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={gig.thumbnail} alt={gig.title} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100" />
                    <div className="min-w-0 space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ● Published
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">From ${gig.startingPrice}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{gig.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>{gig.deliveryDays}d delivery</span>
                        <span>{gig.ordersInQueue || 1} in queue</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Create New Gig Action Card */}
                <div
                  onClick={() => openPostModal('gig')}
                  className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Create Another Gig</h4>
                    <p className="text-[11px] text-slate-500">Offer 3-tier packages with escrow protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Schedule Technical Interview</h3>
            <p className="text-xs text-slate-500">
              Candidate: <strong className="text-slate-800">{interviewModalCandidate.applicantName}</strong> for {interviewModalCandidate.jobTitle}.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Date & Time
              </label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInterviewModalCandidate(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-xl shadow-2xs"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleWithdraw}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xl"
          >
            <h3 className="text-base font-bold text-slate-900">Withdraw Funds</h3>
            <p className="text-xs text-slate-500">
              Direct transfer to your linked checking account (ending in 8904).
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ($ USD)
              </label>
              <input
                type="number"
                min="10"
                max="3450"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Available balance: $3,450.00
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-xl shadow-2xs"
              >
                Confirm Transfer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
