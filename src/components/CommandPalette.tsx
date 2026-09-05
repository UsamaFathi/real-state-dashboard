import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  FileSignature,
  SlidersHorizontal,
  ArrowLeftRight,
  User,
  ExternalLink,
  X,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';
import { UnitItem, OfferApproval, TransactionHold, PricingRule, NavigationTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  units: UnitItem[];
  offers: OfferApproval[];
  transactions: TransactionHold[];
  pricingRules: PricingRule[];
  isDark?: boolean;
  onToggleDark?: () => void;
  onSelectUnit: (unit: UnitItem) => void;
  onSelectOffer: (offer: OfferApproval) => void;
  onSelectTransaction: (tx: TransactionHold) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  units,
  offers,
  transactions,
  pricingRules,
  isDark = false,
  onToggleDark,
  onSelectUnit,
  onSelectOffer,
  onSelectTransaction,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUnits = units.filter(
    (u) =>
      u.code.toLowerCase().includes(query.toLowerCase()) ||
      u.project.toLowerCase().includes(query.toLowerCase()) ||
      u.type.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOffers = offers.filter(
    (o) =>
      o.offerCode.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase()) ||
      o.unitCode.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (t) =>
      t.unitCode.toLowerCase().includes(query.toLowerCase()) ||
      t.clientName.toLowerCase().includes(query.toLowerCase()) ||
      t.project.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRules = pricingRules.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.scope.toLowerCase().includes(query.toLowerCase())
  );

  const isThemeQuery =
    'theme dark light mode switch'.includes(query.toLowerCase()) ||
    query.toLowerCase().includes('dark') ||
    query.toLowerCase().includes('light');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, unit code, client name, theme, or rule..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Theme Quick Command if matching or no query */}
          {(!query || isThemeQuery) && onToggleDark && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
                Preferences & Theme
              </div>
              <button
                onClick={() => {
                  onToggleDark();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left text-slate-700 dark:text-slate-200 font-medium transition group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Toggle {isDark ? 'Light Mode' : 'Dark Mode'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Currently using {isDark ? 'Dark (Night Stealth)' : 'Light'} theme
                    </div>
                  </div>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                  ⌘D
                </kbd>
              </button>
            </div>
          )}

          {/* Quick Nav Options */}
          {!query && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigateTab('rental-management');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 text-left text-amber-900 dark:text-amber-200 font-semibold transition border border-amber-500/30"
                >
                  <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <span>Rental Management (Odoo 19.0)</span>
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('deals');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-300 font-medium transition"
                >
                  <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <span>Deals Kanban Pipeline</span>
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('inventory');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-300 font-medium transition"
                >
                  <div className="w-7 h-7 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <span>Property Inventory</span>
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('pricing');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-300 font-medium transition"
                >
                  <div className="w-7 h-7 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <span>Pricing Engine & Rules</span>
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('offers');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-300 font-medium transition"
                >
                  <div className="w-7 h-7 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    4
                  </div>
                  <span>Offers & Approvals</span>
                </button>
              </div>
            </div>
          )}

          {/* Units Result Section */}
          {filteredUnits.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center justify-between">
                <span>Units & Inventory</span>
                <span className="text-[10px] text-slate-400">{filteredUnits.length} found</span>
              </div>
              <div className="space-y-1">
                {filteredUnits.slice(0, 4).map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => {
                      onSelectUnit(unit);
                      onNavigateTab('inventory');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/80 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-200 transition group border border-transparent hover:border-blue-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{unit.code}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {unit.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {unit.project} • Floor {unit.floor} • ${unit.basePrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                      View Unit <ExternalLink className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Offers Section */}
          {filteredOffers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
                Offers & Commercial Approvals
              </div>
              <div className="space-y-1">
                {filteredOffers.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => {
                      onSelectOffer(offer);
                      onNavigateTab('offers');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        <FileSignature className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{offer.offerCode}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                            ({offer.customerName})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {offer.unitTitle} • {offer.discountPercent}% Discount
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        offer.status === 'Approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Rules Section */}
          {filteredRules.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
                Pricing Rules
              </div>
              <div className="space-y-1">
                {filteredRules.map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => {
                      onNavigateTab('pricing');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-700 dark:text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{rule.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{rule.scope}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold px-1.5 py-0.5 rounded">
                      {rule.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredUnits.length === 0 &&
            filteredOffers.length === 0 &&
            filteredTransactions.length === 0 &&
            filteredRules.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">
                  No results found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try searching for unit code &lsquo;4205&rsquo;, &lsquo;theme&rsquo;, &lsquo;Apex&rsquo;, &lsquo;Horizon&rsquo;, or &lsquo;Premium&rsquo;
                </p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px]">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px]">Enter</kbd> to select
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px]">Esc</kbd> to close
            </span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">UF Real Estate OS</span>
        </div>
      </div>
    </div>
  );
};
