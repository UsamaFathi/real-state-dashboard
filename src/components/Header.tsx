import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  PanelLeft,
  Building2,
  Calendar,
} from 'lucide-react';
import { LegalEntity } from '../types';

interface HeaderProps {
  isDark?: boolean;
  onToggleDark?: () => void;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenUnlockModal?: () => void;
  onToggleSidebar?: () => void;
  onToast?: (msg: string) => void;
  selectedCompany?: LegalEntity;
}

export const Header: React.FC<HeaderProps> = ({
  isDark = false,
  onToggleDark,
  onOpenCommandPalette,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  onOpenUnlockModal,
  onToggleSidebar,
  onToast,
  selectedCompany,
}) => {
  return (
    <header
      id="main-header"
      className="h-14 min-h-[56px] bg-white dark:bg-[#0e1017] border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none font-sans"
    >
      {/* Left: Sidebar Toggle Icon & Global Real Estate Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Global Search Input Box: "Search units, offers, leads... ⌘K" */}
        <button
          id="global-search-trigger"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#161822] hover:bg-gray-100 dark:hover:bg-[#1c202d] text-gray-400 dark:text-gray-400 text-xs border border-gray-200 dark:border-gray-700/60 transition w-full max-w-sm justify-between cursor-text text-left shadow-2xs group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
            <span className="text-gray-500 dark:text-gray-400 font-normal truncate">
              Search units, offers, leads...
            </span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#10121a] text-gray-400 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700 font-medium">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Quick Schedule + Notification Bell + Theme Switcher + User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Date / Live Status indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#141622] border border-gray-200/60 dark:border-gray-800">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Q3 Fiscal Period</span>
        </div>

        {/* Notification Bell with Indicator */}
        <button
          onClick={onOpenNotifications}
          className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition relative cursor-pointer"
          title="Notifications & Tasks"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 ring-2 ring-white dark:ring-[#0e1017]" />
          )}
        </button>

        {/* Dark/Light mode icon toggle */}
        {onToggleDark && (
          <button
            onClick={onToggleDark}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            title={`Toggle Theme (Current: ${isDark ? 'Dark' : 'Light'})`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        )}

        {/* User Profile Avatar with Role Details */}
        <div
          onClick={() => onToast?.('Toby Belhome — Real Estate Sales Manager')}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="Toby Belhome (Real Estate Sales Manager)"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
            alt="Toby Belhome"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-700 group-hover:ring-gray-400 transition"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};
