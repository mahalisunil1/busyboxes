'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Users,
  ChevronRight,
  ArrowRightLeft,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';

export const DemoGuidanceBar: React.FC = () => {
  const {
    role,
    toggleRole,
    currentUser,
    activePersonaId,
    loginAsPersona,
    setIsPersonaModalOpen,
    demoPersonas,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const activePersona = demoPersonas.find((p) => p.id === activePersonaId) || demoPersonas[0];

  return (
    <aside aria-label="Interactive Demo Guidance" className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Persona Identity & Role */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold text-[11px]">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Demo Mode Active
            </span>

            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser?.avatar || activePersona.avatar}
                alt={currentUser?.name || activePersona.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-700"
              />
              <span className="font-bold text-white">
                {currentUser?.name || activePersona.name}
              </span>
              <span className="text-slate-400 font-normal">
                ({activePersona.personaType})
              </span>
            </div>

            {!isCollapsed && (
              <span className="hidden xl:inline text-slate-400 text-[11px] border-l border-slate-700 pl-2.5">
                {role === 'freelancer'
                  ? 'Candidate view: 1-Click apply to jobs or hire specialists. Check Dashboard for status.'
                  : 'Recruiter view: Review candidate pipeline, move applicant status, or export CSV.'}
              </span>
            )}
          </div>

          {/* Right: Quick Persona Switchers & Controls */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {!isCollapsed && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
                {demoPersonas.map((persona) => {
                  const isActive = activePersonaId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => loginAsPersona(persona.id)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#0a66c2] text-white font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      {persona.name.split(' ')[0]} ({persona.role === 'employer' ? 'Recruiter' : 'Seeker'})
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsPersonaModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
            >
              <Users className="w-3 h-3 text-[#0a66c2]" />
              <span>All Personas</span>
            </button>

            <button
              type="button"
              onClick={toggleRole}
              title="Toggle current perspective"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-2xs transition-colors"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Switch to {role === 'freelancer' ? 'Employer' : 'Candidate'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand banner' : 'Collapse banner'}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

