'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Briefcase, Shield, Award, Zap, Globe, MessageSquare, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsShortcutsModalOpen, setIsCommandPaletteOpen } = useApp();
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0a66c2] flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">BusyBoxes</span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Professional career portal connecting verified candidates and specialists with top technology companies and enterprise teams.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-400">
              <span className="text-xs text-slate-500">Connect:</span>
              <a href="#" className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore Careers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs?category=fullstack" className="hover:text-[#0a66c2] transition-colors">
                  Engineering & Full-Stack
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=ai-dev" className="hover:text-[#0a66c2] transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=ui-ux" className="hover:text-[#0a66c2] transition-colors">
                  Product & Design
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=cloud-devops" className="hover:text-[#0a66c2] transition-colors">
                  DevOps & Cloud
                </Link>
              </li>
            </ul>
          </div>

          {/* Freelance Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Freelance Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/gigs" className="hover:text-[#0a66c2] transition-colors">
                  Browse Freelance Gigs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#0a66c2] transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#0a66c2] transition-colors">
                  Recruiter Pipeline
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#0a66c2] transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Security & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Employers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Escrow Payment Vault</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0a66c2]" />
                <span>Instant Candidate Alerts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BusyBoxes Technologies, Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hover:text-[#0a66c2] hover:underline flex items-center gap-1 font-medium"
            >
              Spotlight (Ctrl+K)
            </button>
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hover:text-[#0a66c2] hover:underline flex items-center gap-1 font-medium"
            >
              Shortcuts (?)
            </button>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
