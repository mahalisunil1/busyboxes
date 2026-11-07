'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { GigCard } from '@/components/GigCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';

function GigsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const { gigs, setIsPostModalOpen, openPostModal } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [maxDays, setMaxDays] = useState<number>(14);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filteredGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = gig.title.toLowerCase().includes(q);
          const matchesTags = gig.tags.some((t) => t.toLowerCase().includes(q));
          const matchesSeller = gig.sellerName.toLowerCase().includes(q);
          if (!matchesTitle && !matchesTags && !matchesSeller) return false;
        }

        if (selectedCategory !== 'all' && gig.category !== selectedCategory) {
          return false;
        }

        if (gig.startingPrice > maxPrice) {
          return false;
        }

        if (gig.deliveryDays > maxDays) {
          return false;
        }

        if (selectedTier !== 'all' && gig.sellerTier !== selectedTier) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [gigs, searchQuery, selectedCategory, maxPrice, maxDays, selectedTier, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(2000);
    setMaxDays(14);
    setSelectedTier('all');
    setSortBy('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0a66c2]">
              Freelance Marketplace
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {filteredGigs.length} verified services available
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Browse Fixed-Price Freelance Gigs
          </h1>
        </div>

        <button
          onClick={() => openPostModal()}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <span>+ Post an Opportunity</span>
        </button>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs by skill, framework, or specialist name..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#0a66c2]" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'recommended' | 'price-low' | 'price-high' | 'rating'
                )
              }
              className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <aside
          className={`${
            isFilterDrawerOpen ? 'block' : 'hidden'
          } md:block md:col-span-1 space-y-5 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#0a66c2]" />
              Filter Gigs
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#0a66c2] hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-[#0a66c2]"
            >
              <option value="all">All Domains</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Max Budget</span>
              <span className="text-[#0a66c2] font-bold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0a66c2] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$50</span>
              <span>$2,500+</span>
            </div>
          </div>

          {/* Delivery Days */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Delivery Time</span>
              <span className="text-[#0a66c2] font-bold">Up to {maxDays} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              value={maxDays}
              onChange={(e) => setMaxDays(Number(e.target.value))}
              className="w-full accent-[#0a66c2] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>24h</span>
              <span>14 Days</span>
            </div>
          </div>

          {/* Seller Tier */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Seller Level</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-[#0a66c2]"
            >
              <option value="all">All Seller Levels</option>
              <option value="Top Rated Plus">Top Rated Plus</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Rising Star">Rising Star</option>
            </select>
          </div>
        </aside>

        {/* Right Gigs List */}
        <main className="md:col-span-3 space-y-4">
          {filteredGigs.length === 0 ? (
            <div className="py-16 text-center rounded-xl bg-white border border-slate-200 space-y-2 p-6">
              <Layers className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No gigs matched your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting the delivery time or budget slider.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#084e96]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function GigsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading gigs marketplace...</div>}>
      <GigsContent />
    </Suspense>
  );
}
