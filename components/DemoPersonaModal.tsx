'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Users,
  X,
  CheckCircle2,
  Briefcase,
  Building,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';
import { DemoPersona } from '@/types';

export const DemoPersonaModal: React.FC = () => {
  const router = useRouter();
  const {
    isPersonaModalOpen,
    setIsPersonaModalOpen,
    demoPersonas,
    activePersonaId,
    loginAsPersona,
  } = useApp();

  if (!isPersonaModalOpen) return null;

  const handleSelect = (persona: DemoPersona) => {
    loginAsPersona(persona.id);
    setIsPersonaModalOpen(false);
    router.push(persona.defaultPath);
  };

  return (
    <div
      onClick={() => setIsPersonaModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Switch Demo Account
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0a66c2] border border-blue-200">
                  4 Interactive Personas
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Instantly experience BusyBoxes from different user roles and workflows
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPersonaModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoPersonas.map((persona) => {
              const isActive = activePersonaId === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => handleSelect(persona)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-[#0a66c2] bg-blue-50/40 shadow-xs ring-2 ring-[#0a66c2]/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Avatar & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={persona.avatar}
                            alt={persona.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0a66c2] transition-colors">
                              {persona.name}
                            </h3>
                            {isActive && (
                              <CheckCircle2 className="w-4 h-4 text-[#0a66c2]" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {persona.title}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${persona.badgeColor}`}
                      >
                        {persona.personaType}
                      </span>
                    </div>

                    {/* Stats Pill */}
                    <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>{persona.statsBadge}</span>
                      <span className="text-[10px] text-slate-400">{persona.location}</span>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-1 text-xs text-slate-600">
                      {persona.demoHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a66c2]" />
                          <span className="line-clamp-1">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      Opens in {persona.defaultPath}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(persona);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#0a66c2] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-[#0a66c2] hover:text-white'
                      }`}
                    >
                      {isActive ? 'Active Persona' : 'Switch to this Role'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0a66c2]" />
            Switching personas preserves mocked pipelines, applications, and balance state.
          </span>
          <button
            type="button"
            onClick={() => {
              setIsPersonaModalOpen(false);
              router.push('/login');
            }}
            className="text-[#0a66c2] font-semibold hover:underline flex items-center gap-1"
          >
            Or visit the Login Hub <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

