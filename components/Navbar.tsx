'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  Layers,
  Bookmark,
  Bell,
  MessageSquare,
  PlusCircle,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Building,
  Search,
  Keyboard,
  Sparkles,
  Store,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    role,
    toggleRole,
    savedGigIds,
    savedJobIds,
    unreadNotifsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsPostModalOpen,
    openPostModal,
    setIsChatOpen,
    setIsCommandPaletteOpen,
    setIsProfileDrawerOpen,
    setIsJobAlertModalOpen,
    setIsShortcutsModalOpen,
    setIsPersonaModalOpen,
    isAuthenticated,
    currentUser,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMarketplaceDropdownOpen, setIsMarketplaceDropdownOpen] = useState(false);

  const totalSaved = savedGigIds.length + savedJobIds.length;

  const isMarketplaceActive =
    pathname === '/marketplace' || pathname === '/jobs' || pathname === '/gigs';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#0a66c2] flex items-center justify-center text-white shadow-2xs font-bold text-sm transition-transform group-hover:scale-105">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                BusyBoxes
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400">
                Jobs & Talent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Strictly Marketplace (Jobs + Gigs), Dashboard, Messages */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Marketplace Dropdown (Seamlessly houses both Jobs and Gigs) */}
            <div
              className="relative"
              onMouseEnter={() => setIsMarketplaceDropdownOpen(true)}
              onMouseLeave={() => setIsMarketplaceDropdownOpen(false)}
            >
              <Link
                href="/marketplace"
                onClick={() => setIsMarketplaceDropdownOpen(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  isMarketplaceActive
                    ? 'text-[#0a66c2] bg-blue-50/90 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Store className="w-4 h-4 text-[#0a66c2]" />
                <span>Marketplace</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMarketplaceDropdownOpen ? 'rotate-180 text-[#0a66c2]' : 'text-slate-400'
                  }`}
                />
              </Link>

              {/* Seamless Hover / Click Dropdown */}
              {isMarketplaceDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/marketplace"
                    onClick={() => setIsMarketplaceDropdownOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                      pathname === '/marketplace'
                        ? 'bg-blue-50 text-[#0a66c2]'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-blue-100/80 text-[#0a66c2] shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">Marketplace Hub</span>
                        <span className="text-[10px] bg-blue-100 text-[#0a66c2] px-1.5 py-0.2 rounded font-bold">
                          All-in-one
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Explore both career opportunities & freelance services
                      </p>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <Link
                    href="/jobs"
                    onClick={() => setIsMarketplaceDropdownOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                      pathname === '/jobs'
                        ? 'bg-blue-50 text-[#0a66c2]'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-700 shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Careers & Jobs</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Full-time, contract, and remote positions with transparent pay
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/gigs"
                    onClick={() => setIsMarketplaceDropdownOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                      pathname === '/gigs'
                        ? 'bg-purple-50 text-purple-700'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-purple-100/80 text-purple-700 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Freelance Gigs</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Turnkey micro-deliverables & packages with escrow protection
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                pathname === '/dashboard'
                  ? 'text-[#0a66c2] bg-blue-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Dashboard
            </Link>

            {/* Messages */}
            <Link
              href="/messages"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                pathname === '/messages'
                  ? 'text-[#0a66c2] bg-blue-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Messages
            </Link>
          </nav>

          {/* Quick Search Spotlight Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs"
            title="Press Ctrl+K or / to search"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Search jobs, gigs...</span>
            <kbd className="text-[10px] bg-white border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 font-bold shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Search Icon for tablet/mobile */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Post Opportunity CTA */}
            <button
              onClick={() => openPostModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Post an Opportunity</span>
            </button>

            {/* Saved Bookmarks */}
            <Link
              href="/saved"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="Saved Items"
            >
              <Bookmark className="w-5 h-5" />
              {totalSaved > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-[#0a66c2] text-white flex items-center justify-center">
                  {totalSaved}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-rose-600 text-white flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0a66c2] font-semibold">
                          {unreadNotifsCount} unread
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-[#0a66c2] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No notifications yet</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`py-3 px-2 flex items-start gap-3 rounded-lg cursor-pointer transition-colors ${
                            notif.read ? 'opacity-70 hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                          }`}
                        >
                          <div className="p-1.5 rounded-md bg-blue-100 text-[#0a66c2] shrink-0 mt-0.5">
                            {notif.type === 'order' ? (
                              <Layers className="w-3.5 h-3.5" />
                            ) : notif.type === 'application' ? (
                              <Briefcase className="w-3.5 h-3.5" />
                            ) : (
                              <Bell className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-[#0a66c2] shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authentication / Profile Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                  <span className="hidden xl:inline text-xs font-semibold text-slate-800">
                    {currentUser?.name || 'Alex Mercer'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {currentUser?.profileCompleteness || 85}% Profile
                        </span>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfileDrawerOpen(true);
                          }}
                          className="text-[11px] text-[#0a66c2] font-bold hover:underline"
                        >
                          Edit →
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsPersonaModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Switch Demo Account</span>
                      </div>
                      <span className="text-[10px] bg-indigo-200/80 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                        4 Roles
                      </span>
                    </button>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{role === 'employer' ? 'Recruiter Dashboard' : 'My Candidate Hub'}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsProfileDrawerOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Profile & Resume</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsJobAlertModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <Bell className="w-3.5 h-3.5 text-slate-500" />
                      <span>Job Alerts</span>
                    </button>

                    <Link
                      href="/saved"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                      <span>Saved Jobs & Gigs</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsShortcutsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                        <span>Shortcuts</span>
                      </div>
                      <kbd className="text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-bold text-slate-500">
                        ?
                      </kbd>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0a66c2] hover:bg-blue-50 border border-transparent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-600">Active Mode:</span>
            <button
              onClick={toggleRole}
              className="px-3 py-1 rounded text-xs font-bold bg-[#0a66c2] text-white"
            >
              {role === 'freelancer' ? 'Job Seeker' : 'Employer'}
            </button>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsPersonaModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Switch Demo Account (4 Personas)</span>
          </button>

          <div className="space-y-2 pt-1">
            {/* Marketplace Section */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                Marketplace (Jobs & Gigs)
              </span>
              <Link
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  pathname === '/marketplace'
                    ? 'text-[#0a66c2] bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#0a66c2]" />
                <span>Marketplace Overview</span>
              </Link>
              <Link
                href="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  pathname === '/jobs'
                    ? 'text-[#0a66c2] bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Careers & Job Board</span>
              </Link>
              <Link
                href="/gigs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  pathname === '/gigs'
                    ? 'text-purple-700 bg-purple-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Freelance Gigs & Services</span>
              </Link>
            </div>

            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                pathname === '/dashboard'
                  ? 'text-[#0a66c2] bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/messages"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                pathname === '/messages'
                  ? 'text-[#0a66c2] bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Messages
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openPostModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] transition-colors shadow-2xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post an Opportunity</span>
            </button>

            <Link
              href="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Saved Items ({totalSaved})
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-bold text-[#0a66c2] bg-blue-50"
              >
                Sign In / Register
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
