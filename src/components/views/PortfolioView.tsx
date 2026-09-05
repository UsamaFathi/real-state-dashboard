import React, { useState } from 'react';
import {
  Building2,
  FolderTree,
  Plus,
  ChevronRight,
  ChevronDown,
  Layers,
  MapPin,
  DollarSign,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab, UnitItem } from '../../types';

interface PortfolioViewProps {
  units: UnitItem[];
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ units, onNavigateTab, onToast }) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['gh-1', 'acme-1', 'marina-1']);

  const toggleNode = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter((id) => id !== nodeId));
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
    }
  };

  const projects = [
    {
      id: 'proj-1',
      name: 'The Azure Tower A',
      location: 'Downtown Harbor District',
      unitsTotal: 242,
      available: 34,
      totalValue: '$340,000,000',
      occupancy: '94.2%',
      imageUrl:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'proj-2',
      name: 'Azure Heights Block 1',
      location: 'Uptown Financial Center',
      unitsTotal: 180,
      available: 18,
      totalValue: '$210,000,000',
      occupancy: '90.0%',
      imageUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'proj-3',
      name: 'The Zenith Commercial',
      location: 'King Fahd Business Bay',
      unitsTotal: 520,
      available: 82,
      totalValue: '$580,000,000',
      occupancy: '96.2%',
      imageUrl:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'proj-4',
      name: 'Marina Bays Waterfront',
      location: 'West Pier Marina Promenade',
      unitsTotal: 310,
      available: 45,
      totalValue: '$410,000,000',
      occupancy: '89.4%',
      imageUrl:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Portfolio & Entity Structure
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage legal holding hierarchies, multi-tier SPVs, and regional project allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('New Legal SPV Entity wizard launched')}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs shadow-2xs transition cursor-pointer"
          >
            + Add Holding Company
          </button>
          <button
            onClick={() => onToast('New Development Project wizard launched')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Entity Tree & Right Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Entity Hierarchy Tree */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Holding & SPV Hierarchy</h2>
          </div>

          <div className="space-y-2 text-xs">
            {/* Root: Global Holdings LLC */}
            <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-lg">
              <div
                onClick={() => toggleNode('gh-1')}
                className="flex items-center justify-between cursor-pointer font-bold text-blue-900 dark:text-blue-200"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Global Holdings LLC (Parent)</span>
                </div>
                {expandedNodes.includes('gh-1') ? (
                  <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              {expandedNodes.includes('gh-1') && (
                <div className="pl-4 mt-2 space-y-2 border-l border-blue-200 dark:border-blue-800">
                  {/* Subsidiary 1 */}
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    <div
                      onClick={() => toggleNode('acme-1')}
                      className="flex items-center justify-between cursor-pointer font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>Acme Properties Ltd. (SPV 1)</span>
                      {expandedNodes.includes('acme-1') ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                    {expandedNodes.includes('acme-1') && (
                      <div className="pl-3 mt-1.5 space-y-1 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700">
                        <div
                          onClick={() => onNavigateTab('inventory')}
                          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer flex items-center gap-1"
                        >
                          <span>• The Zenith Commercial</span>
                        </div>
                        <div
                          onClick={() => onNavigateTab('inventory')}
                          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer flex items-center gap-1"
                        >
                          <span>• Horizon Tower</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subsidiary 2 */}
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    <div
                      onClick={() => toggleNode('marina-1')}
                      className="flex items-center justify-between cursor-pointer font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>Marina Bays Capital (SPV 2)</span>
                      {expandedNodes.includes('marina-1') ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                    {expandedNodes.includes('marina-1') && (
                      <div className="pl-3 mt-1.5 space-y-1 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700">
                        <div
                          onClick={() => onNavigateTab('inventory')}
                          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer flex items-center gap-1"
                        >
                          <span>• The Azure Tower A</span>
                        </div>
                        <div
                          onClick={() => onNavigateTab('inventory')}
                          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer flex items-center gap-1"
                        >
                          <span>• Marina Bays Waterfront</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Projects Portfolio Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigateTab('inventory')}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {p.occupancy} Occupancy
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {p.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block">
                        Total Units
                      </span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{p.unitsTotal} Units</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block">
                        Available
                      </span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {p.available} Ready
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block">
                        Asset Valuation
                      </span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                        {p.totalValue}
                      </span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                      <span>View Units</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
