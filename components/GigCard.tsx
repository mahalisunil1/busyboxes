'use client';

import React from 'react';
import { Gig } from '@/types';
import { useApp } from '@/context/AppContext';
import gsap from 'gsap';
import { Star, Clock, Heart, ShieldCheck } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
}

export const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const { setSelectedGig, isGigSaved, toggleSaveGig } = useApp();
  const saved = isGigSaved(gig.id);

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    gsap.fromTo(e.currentTarget, { scale: 0.72 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    toggleSaveGig(gig.id);
  };

  return (
    <div
      onClick={() => setSelectedGig(gig)}
      className="pro-card bg-white border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gig.thumbnail}
            alt={gig.title}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleSaveClick}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full shadow-xs transition-colors ${
              saved
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          {/* Seller */}
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gig.sellerAvatar}
              alt={gig.sellerName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 block truncate leading-tight">
                {gig.sellerName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                {gig.sellerTier}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0a66c2] line-clamp-2 leading-snug">
            {gig.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {gig.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info: Rating & Price */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>{gig.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({gig.reviewsCount})</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            {gig.deliveryDays}d
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block leading-tight">From</span>
          <span className="text-sm font-extrabold text-slate-900 leading-tight">
            ${gig.startingPrice}
          </span>
        </div>
      </div>
    </div>
  );
};
