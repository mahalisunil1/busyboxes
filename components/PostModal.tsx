'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import {
  X,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { JobType, WorkLocation, ExperienceLevel } from '@/types';

const GIG_PRESETS = [
  {
    id: 'nextjs-saas',
    label: 'Next.js 16 SaaS',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-blue-600 to-indigo-900',
  },
  {
    id: 'ai-platform',
    label: 'AI & LLM Web App',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-purple-600 to-indigo-950',
  },
  {
    id: 'ui-design',
    label: 'Design System & UI',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-pink-600 to-rose-900',
  },
  {
    id: 'cloud-devops',
    label: 'Cloud & DevOps IaC',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-amber-600 to-orange-950',
  },
  {
    id: 'mobile-app',
    label: 'Mobile Engineering',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-600 to-teal-900',
  },
];

export const PostModal: React.FC = () => {
  const {
    isPostModalOpen,
    setIsPostModalOpen,
    postModalInitialType,
    addJob,
    addGig,
    role,
    currentUser,
  } = useApp();

  const [postType, setPostType] = useState<'job' | 'gig'>('gig');

  // Sync modal type when opened
  useEffect(() => {
    if (isPostModalOpen) {
      const timer = setTimeout(() => {
        setPostType(postModalInitialType || (role === 'employer' ? 'job' : 'gig'));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isPostModalOpen, postModalInitialType, role]);

  // Job Form States
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('HyperScale AI');
  const [category, setCategory] = useState('fullstack');
  const [jobType, setJobType] = useState<JobType>('Full-Time');
  const [workLocation, setWorkLocation] = useState<WorkLocation>('Remote');
  const [location, setLocation] = useState('Remote (Worldwide)');
  const [salaryMin, setSalaryMin] = useState(130000);
  const [salaryMax, setSalaryMax] = useState(175000);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Senior');
  const [jobTags, setJobTags] = useState('React, Next.js, TypeScript');
  const [jobDescription, setJobDescription] = useState('');

  // Gig Form States
  const [gigTitle, setGigTitle] = useState('I will build a high-performance Next.js 16 SaaS web application');
  const [gigCategory, setGigCategory] = useState('fullstack');
  const [startingPrice, setStartingPrice] = useState(250);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [selectedPreset, setSelectedPreset] = useState(GIG_PRESETS[0]);
  const [gigTags, setGigTags] = useState('Next.js 16, TypeScript, Tailwind CSS, Supabase');
  const [gigDescription, setGigDescription] = useState(
    'Production-ready web application built with modern architecture, responsive layouts, clean TypeScript code, and scalable database integration.'
  );

  if (!isPostModalOpen) return null;

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company) return;

    addJob({
      title: jobTitle,
      company,
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
      companySize: '25-50 team members',
      category,
      type: jobType,
      location,
      workLocation,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      salaryCurrency: 'USD',
      experienceLevel,
      description:
        jobDescription ||
        'We are seeking a talented specialist to collaborate directly with our team to ship reliable, high-impact features.',
      responsibilities: [
        'Lead architectural decisions and design scalable components.',
        'Collaborate cross-functionally with product and design leads.',
        'Write clean, well-tested code with continuous deployment.',
      ],
      requirements: [
        'Demonstrated expertise in scalable modern web stacks.',
        'Fluency in TypeScript and modern development best practices.',
      ],
      benefits: [
        'Competitive compensation & comprehensive health coverage',
        'Flexible working hours with fully remote culture',
      ],
      tags: jobTags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: true,
    });

    setIsPostModalOpen(false);
  };

  const handleGigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle) return;

    const basePrice = Number(startingPrice) || 250;
    const baseDays = Number(deliveryDays) || 3;

    addGig({
      title: gigTitle.startsWith('I will') ? gigTitle : `I will ${gigTitle}`,
      sellerTitle: currentUser?.title || 'Verified Senior Specialist',
      sellerTier: 'Top Rated',
      category: gigCategory,
      subcategory: 'Custom Deliverable',
      thumbnail: selectedPreset.url,
      bannerGradient: selectedPreset.gradient,
      startingPrice: basePrice,
      deliveryDays: baseDays,
      featured: true,
      ordersInQueue: 1,
      tags: gigTags.split(',').map((t) => t.trim()).filter(Boolean),
      description:
        gigDescription ||
        'Professional end-to-end deliverables tailored to your business needs with guaranteed standards and escrow protection.',
      packages: {
        starter: {
          name: 'Starter Package',
          price: basePrice,
          deliveryDays: baseDays,
          revisions: '2 Revisions',
          description: 'Essential core deliverable with setup, code files, and documentation.',
          features: ['Complete Source Files', 'Mobile Responsive', 'Essential Documentation'],
        },
        standard: {
          name: 'Standard Pro',
          price: Math.round(basePrice * 2.2),
          deliveryDays: baseDays + 2,
          revisions: 'Unlimited Revisions',
          description: 'Full production-ready delivery with testing, database schema, and integrations.',
          features: [
            'All Starter Features',
            'Advanced Architecture & Auth',
            'Database & API Setup',
            'Priority Support',
          ],
        },
        premium: {
          name: 'Enterprise VIP',
          price: Math.round(basePrice * 4.5),
          deliveryDays: baseDays + 5,
          revisions: 'Unlimited Revisions',
          description: 'Turnkey full enterprise architecture with CI/CD, payment webhooks, and 30-day support.',
          features: [
            'All Standard Features',
            'Turnkey Stripe / Payment Setup',
            'Full Test Suite & Monitoring',
            '30-Day Post-Launch Support',
          ],
        },
      },
      faqs: [
        {
          question: 'What do you need from me to get started?',
          answer: 'A brief description of your project requirements, branding assets or design wireframes, and target timeline.',
        },
      ],
    });

    setIsPostModalOpen(false);
  };

  return (
    <div
      onClick={() => setIsPostModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Clear Post an Opportunity Title and Type Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-100 bg-white gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0a66c2]" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Post an Opportunity
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {postType === 'gig'
                ? 'Offer fixed-price turnkey services with milestone escrow buyer protection.'
                : 'Publish a job opening and receive verified applicant profiles into your ATS pipeline.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Type Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPostType('gig')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  postType === 'gig'
                    ? 'bg-white text-purple-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Freelance Gig</span>
              </button>
              <button
                type="button"
                onClick={() => setPostType('job')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  postType === 'job'
                    ? 'bg-white text-[#0a66c2] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-[#0a66c2]" />
                <span>Career Job</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPostModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form Scroll Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {postType === 'gig' ? (
            /* ======================= GIG CREATION FORM ======================= */
            <form onSubmit={handleGigSubmit} className="space-y-6">
              {/* Section 1: Title & Category */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Gig Title *
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Must begin with &quot;I will...&quot;
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. I will build an enterprise Next.js 16 SaaS web application"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Service Category
                    </label>
                    <select
                      value={gigCategory}
                      onChange={(e) => setGigCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Specialist Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Next.js 16, TypeScript, Supabase, Stripe"
                      value={gigTags}
                      onChange={(e) => setGigTags(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Preset Visual Theme */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900">
                  Select Visual Showcase Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {GIG_PRESETS.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-[#0a66c2] bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-12 rounded-lg object-cover mb-1.5"
                        />
                        <span className="text-[10px] font-bold text-slate-800 line-clamp-1">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: 3-Tier Packages Matrix Preview */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Pricing & 3-Tier Package Matrix
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Buyers can compare all 3 tiers
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Starter Base Price ($ USD)
                    </label>
                    <input
                      type="number"
                      min="50"
                      step="25"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0a66c2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Starter Delivery Speed (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0a66c2]"
                    />
                  </div>
                </div>

                {/* Live 3-Tier Comparison Cards */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Starter
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      ${startingPrice}
                    </p>
                    <p className="text-[10px] text-slate-500">{deliveryDays} days · 2 Revisions</p>
                  </div>

                  <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1 ring-1 ring-blue-300">
                    <span className="text-[10px] font-bold text-[#0a66c2] uppercase tracking-wide">
                      Standard (Popular)
                    </span>
                    <p className="text-sm font-extrabold text-blue-900">
                      ${Math.round(startingPrice * 2.2)}
                    </p>
                    <p className="text-[10px] text-blue-700">{deliveryDays + 2} days · Unlimited</p>
                  </div>

                  <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                      Enterprise VIP
                    </span>
                    <p className="text-sm font-extrabold text-purple-900">
                      ${Math.round(startingPrice * 4.5)}
                    </p>
                    <p className="text-[10px] text-purple-700">{deliveryDays + 5} days · 30d Support</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Detailed Scope */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900">
                  Deliverables & Scope Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  placeholder="Detail your architecture, deliverables, code quality guarantees, and client collaboration workflow..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow buyer protection guaranteed</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#084e96] transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Publish Gig to Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ======================= CAREER JOB FORM ======================= */
            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HyperScale AI"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-[#0a66c2]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as JobType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-[#0a66c2]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Work Location
                  </label>
                  <select
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value as WorkLocation)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-[#0a66c2]"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Location Display
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-[#0a66c2]"
                  >
                    <option value="Entry-Level">Junior (0-2 Yrs)</option>
                    <option value="Mid-Level">Mid-Level (3-5 Yrs)</option>
                    <option value="Senior">Senior (5+ Yrs)</option>
                    <option value="Lead">Lead / Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Min Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    min="60000"
                    step="5000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Max Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    min="80000"
                    step="5000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Required Skills & Tags
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, TypeScript, PostgreSQL"
                  value={jobTags}
                  onChange={(e) => setJobTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe key responsibilities, team mission, and impact..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#084e96] shadow-xs flex items-center gap-1.5"
                >
                  <span>Publish Job Opening</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
