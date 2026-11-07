'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Star,
  Clock,
  RotateCcw,
  Check,
  Heart,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const GigDetailModal: React.FC = () => {
  const {
    selectedGig,
    setSelectedGig,
    isGigSaved,
    toggleSaveGig,
    openOrderModal,
    openChatWith,
  } = useApp();

  const [activeTier, setActiveTier] = useState<'starter' | 'standard' | 'premium'>('standard');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!selectedGig) return null;

  const pkg = selectedGig.packages[activeTier];
  const saved = isGigSaved(selectedGig.id);

  return (
    <div
      onClick={() => setSelectedGig(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs"
    >
      <div
        className="relative w-full max-w-4xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0a66c2] border border-blue-200">
              {selectedGig.subcategory || selectedGig.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{selectedGig.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({selectedGig.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveGig(selectedGig.id)}
              className={`p-1.5 rounded-md transition-colors ${
                saved ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:bg-slate-200'
              }`}
              title="Save gig"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedGig(null)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {selectedGig.title}
              </h1>

              {/* Seller info */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedGig.sellerAvatar}
                    alt={selectedGig.sellerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {selectedGig.sellerName}
                    </span>
                    <span className="text-[11px] text-slate-500">{selectedGig.sellerTitle}</span>
                  </div>
                </div>

                <button
                  onClick={() => openChatWith(selectedGig.sellerName, selectedGig.sellerAvatar)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </button>
              </div>

              {/* Image */}
              <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedGig.thumbnail}
                  alt={selectedGig.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">About this Service</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedGig.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedGig.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Package Box */}
            <div className="lg:col-span-5">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                {/* 3 Tabs */}
                <div className="grid grid-cols-3 rounded-lg bg-white p-1 border border-slate-200 text-xs font-semibold text-center">
                  {(['starter', 'standard', 'premium'] as const).map((tierKey) => (
                    <button
                      key={tierKey}
                      onClick={() => setActiveTier(tierKey)}
                      className={`py-1.5 rounded capitalize transition-all ${
                        activeTier === tierKey
                          ? 'bg-[#0a66c2] text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tierKey}
                    </button>
                  ))}
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{pkg.description}</p>
                  </div>
                  <span className="text-xl font-extrabold text-slate-900">${pkg.price}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {pkg.deliveryDays} Days Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    {pkg.revisions}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-600">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openOrderModal(selectedGig, activeTier)}
                  className="w-full py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-xs"
                >
                  Continue (${pkg.price})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
