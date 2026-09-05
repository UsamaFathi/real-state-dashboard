import React from 'react';
import { Globe, Lock, ArrowLeft, ArrowRight, RotateCw, Copy, Check } from 'lucide-react';

interface ShadcnBrowserMockupBarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onToast?: (msg: string) => void;
}

export const ShadcnBrowserMockupBar: React.FC<ShadcnBrowserMockupBarProps> = ({
  currentPath = 'shadcnuikit.com/dashboard/real-estate',
  onToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${currentPath}`);
    setCopied(true);
    onToast?.('URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="browser-mockup-bar"
      className="w-full bg-[#f1f3f6] dark:bg-[#0c0e14] border-b border-gray-200/80 dark:border-gray-800/80 px-4 py-2 flex items-center justify-between gap-3 text-xs select-none"
    >
      {/* Mac window traffic lights */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 inline-block shadow-2xs hover:opacity-80 cursor-pointer" title="Close" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 inline-block shadow-2xs hover:opacity-80 cursor-pointer" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 inline-block shadow-2xs hover:opacity-80 cursor-pointer" title="Expand" />
      </div>

      {/* Browser Nav buttons (subtle) */}
      <div className="hidden sm:flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        <button
          className="p-1 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded transition cursor-pointer"
          title="Back"
          onClick={() => onToast?.('Navigating backward')}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded transition cursor-pointer"
          title="Forward"
          onClick={() => onToast?.('Navigating forward')}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded transition cursor-pointer"
          title="Reload"
          onClick={() => onToast?.('Refreshed live dataset')}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Omnibox / URL Pill */}
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="w-full bg-white dark:bg-[#161822] border border-gray-200 dark:border-gray-700/60 rounded-lg px-3 py-1 flex items-center justify-between text-gray-600 dark:text-gray-300 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            <span className="font-mono text-[11px] truncate tracking-tight text-gray-700 dark:text-gray-200 font-medium">
              {currentPath}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded transition cursor-pointer flex items-center gap-1 text-[10px]"
            title="Copy Link"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Right placeholder badge */}
      <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Preview
        </span>
      </div>
    </div>
  );
};
