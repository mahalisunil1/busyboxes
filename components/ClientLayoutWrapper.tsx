'use client';

import React, { useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { GigDetailModal } from '@/components/GigDetailModal';
import { JobDetailModal } from '@/components/JobDetailModal';
import { ApplyModal } from '@/components/ApplyModal';
import { OrderGigModal } from '@/components/OrderGigModal';
import { PostModal } from '@/components/PostModal';
import { ChatDrawer } from '@/components/ChatDrawer';
import { CommandPalette } from '@/components/CommandPalette';
import { JobAlertModal } from '@/components/JobAlertModal';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { DemoPersonaModal } from '@/components/DemoPersonaModal';
import { Toast } from '@/components/Toast';

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setSelectedGig,
    setSelectedJob,
    setIsApplyModalOpen,
    setIsOrderModalOpen,
    setIsPostModalOpen,
    setIsChatOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsJobAlertModalOpen,
    setIsProfileDrawerOpen,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    isPersonaModalOpen,
    setIsPersonaModalOpen,
  } = useApp();

  // Global keyboard shortcuts (Ctrl+K, /, ?, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTagName = (document.activeElement?.tagName || '').toLowerCase();
      const isInputActive =
        activeTagName === 'input' ||
        activeTagName === 'textarea' ||
        activeTagName === 'select';

      // Ctrl + K or Cmd + K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      // "/" -> Command Palette (when not in input)
      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // "?" -> Keyboard Shortcuts Cheat Sheet (when not in input)
      if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        setIsShortcutsModalOpen(!isShortcutsModalOpen);
        return;
      }

      // Global ESC key listener to dismiss any open modal/drawer
      if (e.key === 'Escape') {
        setSelectedGig(null);
        setSelectedJob(null);
        setIsApplyModalOpen(false);
        setIsOrderModalOpen(false);
        setIsPostModalOpen(false);
        setIsChatOpen(false);
        setIsCommandPaletteOpen(false);
        setIsJobAlertModalOpen(false);
        setIsProfileDrawerOpen(false);
        setIsShortcutsModalOpen(false);
        setIsPersonaModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isShortcutsModalOpen,
    isPersonaModalOpen,
    setSelectedGig,
    setSelectedJob,
    setIsApplyModalOpen,
    setIsOrderModalOpen,
    setIsPostModalOpen,
    setIsChatOpen,
    setIsCommandPaletteOpen,
    setIsJobAlertModalOpen,
    setIsProfileDrawerOpen,
    setIsShortcutsModalOpen,
    setIsPersonaModalOpen,
  ]);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f4f6f8] text-slate-800 pb-16 md:pb-0">
      {/* Skip to Main Content link for Screen Readers / Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-[#0a66c2] text-white font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 w-full focus:outline-none">
        {children}
      </main>

      <Footer />

      {/* Mobile App Navigation */}
      <MobileBottomNav />

      {/* Global Modals, Drawers & Overlays */}
      <GigDetailModal />
      <JobDetailModal />
      <ApplyModal />
      <OrderGigModal />
      <PostModal />
      <ChatDrawer />
      <CommandPalette />
      <JobAlertModal />
      <ProfileDrawer />
      <KeyboardShortcutsModal />
      <DemoPersonaModal />
      <Toast />
    </div>
  );
};

export const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppProvider>
      <LayoutContent>{children}</LayoutContent>
    </AppProvider>
  );
};
