import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Calendar,
  Building,
  DollarSign,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface CRMLeadsViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const CRMLeadsView: React.FC<CRMLeadsViewProps> = ({ onNavigateTab, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    {
      id: 'lead-1',
      name: "James O'Connor",
      email: 'james.o@investor.co.uk',
      phone: '+971 50 192 8472',
      budget: '2.5M - 3.5M AED',
      preference: '3-Bed Downtown with Terrace',
      status: 'Active Viewing',
      agent: 'Keyvan Akath',
      created: '2 days ago',
    },
    {
      id: 'lead-2',
      name: 'Amira Al-Fayed',
      email: 'amira.f@holding.ae',
      phone: '+971 55 930 1123',
      budget: '2.0M - 3.0M AED',
      preference: '1-Bed Branded Hotel Suite',
      status: 'Viewing Scheduled',
      agent: 'Jamal Al-Hassan',
      created: '4 days ago',
    },
    {
      id: 'lead-3',
      name: 'Wei Chen',
      email: 'wei.chen@shanghai-cap.cn',
      phone: '+86 138 0013 8000',
      budget: '3.0M - 4.5M AED',
      preference: 'Waterfront 3-Bed Marina',
      status: 'Under Negotiation',
      agent: 'Rami Mansoor',
      created: '1 week ago',
    },
    {
      id: 'lead-4',
      name: 'Elena Rostova',
      email: 'e.rostova@monacocap.mc',
      phone: '+971 52 481 9920',
      budget: '6.0M - 8.0M AED',
      preference: 'Palm Jumeirah Signature Villa',
      status: 'Contract Drafting',
      agent: 'Keyvan Akath',
      created: 'Just now',
    },
  ];

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.preference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Leads & Inquiries</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Capture high-net-worth real estate buyers, portal web leads, and private investor mandates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Lead capture form opened')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-xs hover:bg-slate-800 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, budget, criteria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-mono">{filtered.length} Leads Active</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
              <th className="p-3.5">Lead Name</th>
              <th className="p-3.5">Contact Details</th>
              <th className="p-3.5">Property Preference</th>
              <th className="p-3.5">Target Budget</th>
              <th className="p-3.5">Pipeline Status</th>
              <th className="p-3.5">Assigned Agent</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                    {l.name[0]}
                  </div>
                  <span>{l.name}</span>
                </td>
                <td className="p-3.5 text-slate-600 dark:text-slate-300">
                  <div>{l.email}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{l.phone}</div>
                </td>
                <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">{l.preference}</td>
                <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{l.budget}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    {l.status}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600 dark:text-slate-300">{l.agent}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => {
                      onNavigateTab('deals');
                      onToast(`Opened deal pipeline for ${l.name}`);
                    }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    View Deals →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
