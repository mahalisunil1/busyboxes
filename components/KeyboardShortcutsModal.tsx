'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Keyboard, X } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useApp();

  if (!isShortcutsModalOpen) return null;

  const shortcutGroups = [
    {
      group: 'Navigation & Search',
      items: [
        { keys: ['Ctrl', 'K'], desc: 'Open Command Palette & Global Search' },
        { keys: ['/'], desc: 'Quick jump to Search bar' },
        { keys: ['?'], desc: 'Open this Keyboard Shortcuts cheat sheet' },
        { keys: ['Esc'], desc: 'Close open dialogs, drawers, and overlays' },
      ],
    },
    {
      group: 'Jobs & Gigs Navigation',
      items: [
        { keys: ['↑', '↓'], desc: 'Select previous / next job in list' },
        { keys: ['↵ Enter'], desc: 'Confirm selection or view details' },
        { keys: ['P'], desc: 'Post a new job or list a freelance gig' },
        { keys: ['M'], desc: 'Open direct messages & chat' },
      ],
    },
    {
      group: 'Workflow Actions',
      items: [
        { keys: ['A'], desc: 'Easy Apply to active job opening' },
        { keys: ['S'], desc: 'Save or unsave active item to bookmarks' },
        { keys: ['R'], desc: 'Switch role view (Job Seeker ↔ Recruiter ATS)' },
      ],
    },
  ];

  return (
    <div
      onClick={() => setIsShortcutsModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-[#0a66c2]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-500">Power user shortcuts for rapid navigation</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group) => (
            <div key={group.group} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white text-xs"
                  >
                    <span className="text-slate-700 font-medium">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kidx) => (
                        <kbd
                          key={kidx}
                          className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
