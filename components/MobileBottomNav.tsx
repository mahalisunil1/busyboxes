'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Store,
  PlusCircle,
  MessageSquare,
  LayoutDashboard,
  Bookmark,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { openPostModal, unreadNotifsCount, savedGigIds, savedJobIds } = useApp();

  const totalSaved = savedGigIds.length + savedJobIds.length;
  const isMarketplaceActive =
    pathname === '/marketplace' || pathname === '/jobs' || pathname === '/gigs';

  const navItems = [
    {
      label: 'Marketplace',
      href: '/marketplace',
      icon: Store,
      isActive: isMarketplaceActive,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard',
    },
    {
      label: 'Post',
      action: () => openPostModal(),
      icon: PlusCircle,
      isAction: true,
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      isActive: pathname === '/messages',
      badge: unreadNotifsCount > 0,
    },
    {
      label: 'Saved',
      href: '/saved',
      icon: Bookmark,
      isActive: pathname === '/saved',
      badge: totalSaved > 0,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center text-slate-600 hover:text-[#0a66c2] transition-colors"
                title="Post an Opportunity"
              >
                <div className="p-1 rounded-full bg-[#0a66c2] text-white shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-0.5">Post</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                item.isActive ? 'text-[#0a66c2] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
