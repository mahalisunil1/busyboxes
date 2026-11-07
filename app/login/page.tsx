'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  Sparkles,
  Users,
  Check,
  KeyRound,
} from 'lucide-react';
import { DemoPersona } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    loginAsPersona,
    demoPersonas,
    activePersonaId,
    role,
    setRole,
  } = useApp();

  const [authTab, setAuthTab] = useState<'demo' | 'custom'>('demo');
  const [formMode, setFormMode] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'employer'>('freelancer');

  const [email, setEmail] = useState('alex.mercer@dev.io');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Alex Mercer');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLaunchPersona = (persona: DemoPersona) => {
    loginAsPersona(persona.id);
    router.push(persona.defaultPath);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, fullName, selectedRole);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white shadow-xs font-bold text-lg group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              BusyBoxes
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Production Demo & Authentication Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Experience the dual-marketplace platform from real-world candidate, seller, recruiter, and client perspectives.
          </p>
        </div>

        {/* Top-Level Tabs: Demo Personas vs Custom Auth */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-300/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthTab('demo')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                authTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#0a66c2]" />
              <span>Instant Mockup Personas (Recommended)</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('custom')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                authTab === 'custom'
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4 text-slate-500" />
              <span>Custom Sign In / Register</span>
            </button>
          </div>
        </div>

        {/* DEMO PERSONAS VIEW */}
        {authTab === 'demo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select a pre-loaded profile to launch immediately:
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                Click any persona to load their state and dashboard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoPersonas.map((persona) => {
                const isCurrent = activePersonaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => handleLaunchPersona(persona)}
                    className={`group relative bg-white p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                      isCurrent
                        ? 'border-[#0a66c2] ring-2 ring-[#0a66c2]/20 bg-blue-50/20'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={persona.avatar}
                              alt={persona.name}
                              className="w-13 h-13 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0a66c2] transition-colors">
                                {persona.name}
                              </h3>
                              {isCurrent && (
                                <CheckCircle2 className="w-4 h-4 text-[#0a66c2]" />
                              )}
                            </div>
                            <p className="text-xs font-semibold text-slate-600 line-clamp-1">
                              {persona.title}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {persona.company} · {persona.location}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${persona.badgeColor}`}
                        >
                          {persona.personaType}
                        </span>
                      </div>

                      {/* Stats Banner */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/90 text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>{persona.statsBadge}</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {persona.role === 'employer' ? 'Recruiter Mode' : 'Candidate Mode'}
                        </span>
                      </div>

                      {/* Workflow Highlights */}
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {persona.demoHighlights.map((hl, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Launch CTA */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">
                        Route: <code className="text-slate-600">{persona.defaultPath}</code>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchPersona(persona);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-[#0a66c2] text-white shadow-xs'
                            : 'bg-slate-900 text-white hover:bg-[#0a66c2]'
                        }`}
                      >
                        <span>{isCurrent ? 'Continue as' : 'Launch Demo as'} {persona.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Context Tip */}
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-[#0a66c2] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Production-Ready Sandbox Behavior</p>
                <p className="text-blue-700 mt-0.5">
                  You can jump between personas at any time using the <strong>Demo Accounts</strong> pill in the navbar or top banner. Submitted job applications, saved bookmarks, and custom gig orders will remain synchronized across your session.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM AUTH VIEW */}
        {authTab === 'custom' && (
          <div className="max-w-md mx-auto bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFormMode('signin')}
                className={`py-2 rounded-lg transition-all ${
                  formMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setFormMode('register')}
                className={`py-2 rounded-lg transition-all ${
                  formMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Registration
              </button>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Operating Role:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRole('freelancer')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border font-medium transition-all ${
                    selectedRole === 'freelancer'
                      ? 'border-[#0a66c2] bg-blue-50/50 text-[#0a66c2] font-bold ring-1 ring-[#0a66c2]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Job Seeker / Talent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border font-medium transition-all ${
                    selectedRole === 'employer'
                      ? 'border-[#0a66c2] bg-blue-50/50 text-[#0a66c2] font-bold ring-1 ring-[#0a66c2]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Employer / Recruiter</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {formMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jordan Hayes"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0a66c2] focus:ring-[#0a66c2]"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
                  Demo password: any
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 border border-transparent rounded-xl font-bold text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] focus:outline-none transition-colors shadow-xs"
              >
                {formMode === 'signin' ? 'Sign In' : 'Complete Free Registration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
