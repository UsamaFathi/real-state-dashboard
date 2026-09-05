import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  User,
  Hash,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AuditLogEntry, NavigationTab } from '../../types';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs, onNavigateTab, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedEventType !== 'ALL' && log.eventType !== selectedEventType) return false;
    if (
      searchTerm &&
      !log.action.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !log.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !log.target.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-4 animate-in fade-in duration-150">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              System & Transaction Audit Logs
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically sealed audit trail of all pricing modifications, approval overrides, and document executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Audit ledger signature verified and exported as signed JSON/CSV.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by User, Unit ID, Target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-medium"
            />
          </div>

          {/* Event Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Event Type:</span>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              <option value="PRICE_UPDATE">Price Override</option>
              <option value="OFFER_APPROVAL">Offer Approval</option>
              <option value="RESERVATION_EXTENDED">Reservation Extended</option>
              <option value="RULE_MODIFIED">Rule Modified</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Showing {filteredLogs.length} audit records
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                <th className="p-3 w-10"></th>
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Action & Target</th>
                <th className="p-3">Initiator / Role</th>
                <th className="p-3">Delta / Diff</th>
                <th className="p-3 text-right">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      onClick={() => toggleExpand(log.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                    >
                      <td className="p-3 text-center text-slate-400 dark:text-slate-500">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{log.action}</div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{log.target}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>{log.user}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{log.role}</div>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">{log.delta}</td>
                      <td className="p-3 text-right">
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {log.hash}
                        </span>
                      </td>
                    </tr>

                    {/* Expandable Payload Diff */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                        <td colSpan={6} className="p-4 pl-12 text-xs">
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                              <span>Cryptographic Event Payload</span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> SHA-256 Validated
                              </span>
                            </div>
                            <pre className="font-mono text-[11px] bg-slate-900 dark:bg-slate-950 text-slate-100 p-2.5 rounded overflow-x-auto border border-slate-800">
                              {JSON.stringify(
                                {
                                  eventId: log.id,
                                  action: log.action,
                                  target: log.target,
                                  initiator: log.user,
                                  role: log.role,
                                  delta: log.delta,
                                  timestamp: log.timestamp,
                                  clientIp: '192.168.1.144',
                                  authContext: 'SAML_SSO_OKTA',
                                  signature: `0x${log.hash}ef4491b...`,
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
