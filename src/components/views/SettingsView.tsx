import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Building,
  Shield,
  Smartphone,
  Save,
  RotateCcw,
  Check,
  Send,
  Clock,
  ShieldAlert,
  Calendar,
  MessageSquare,
  Mail,
  User,
  Plus,
  Edit3,
  XCircle,
  Eye,
  CheckCheck,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  LegalEntity,
  ReminderTask,
  ReminderTriggerSettings,
  NotificationChannel,
  ReminderCategory,
} from '../../types';
import { initialReminderTasks, defaultReminderTriggerSettings } from '../../data/rentalData';

interface SettingsViewProps {
  selectedEntity: LegalEntity;
  onNavigateTab?: (tab: any) => void;
  onToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedEntity,
  onNavigateTab,
  onToast,
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'reminders' | 'agency' | 'channels' | 'security'>('reminders');

  // Reminders Queue & Trigger State
  const [reminders, setReminders] = useState<ReminderTask[]>(initialReminderTasks);
  const [triggerSettings, setTriggerSettings] = useState<ReminderTriggerSettings>(defaultReminderTriggerSettings);
  const [reminderSubTab, setReminderSubTab] = useState<'triggers' | 'tasks'>('triggers');

  // Preview & Edit states
  const [previewTask, setPreviewTask] = useState<ReminderTask | null>(null);
  const [editingTask, setEditingTask] = useState<ReminderTask | null>(null);

  // Agency Settings Form state
  const [agencyForm, setAgencyForm] = useState({
    agencyName: 'Bronex Real Estate & SPV Asset Holdings LLC',
    reraLicense: 'RERA-ORN-18920',
    ejariAccountId: 'EJARI-DXB-99824',
    taxRegistrationNumber: selectedEntity.taxId || 'TRN-100298492000003',
    currency: 'AED (United Arab Emirates Dirham)',
    timezone: 'Asia/Dubai (GST +04:00)',
    autoEjariRegistration: true,
  });

  const pendingCount = reminders.filter((r) => r.status === 'pending').length;

  const handleDispatch = (task: ReminderTask) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === task.id
          ? {
              ...r,
              status: 'sent',
              lastSentAt: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
            }
          : r
      )
    );
    onToast(`Notification dispatched to ${task.recipientName} via ${task.channels.join(', ')}`);
  };

  const handleSaveTriggers = () => {
    onToast('Notification trigger automation settings saved & synchronized with live cron service.');
  };

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    onToast('Agency preferences and Ejari credentials saved.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  System Settings & Reminders Engine
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-mono">
                  v2.4.0 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Managing entity <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedEntity.name}</span> • Configure notification triggers, rent due alerts, and channel APIs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('rental-management');
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950 dark:font-bold"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Go to Rental Management</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-amber-950/30 overflow-x-auto no-scrollbar">
          {[
            { id: 'reminders', label: 'Rental Reminders & Notification Triggers', icon: Bell, badge: `${pendingCount} Tasks` },
            { id: 'agency', label: 'Agency & Ejari Registration', icon: Building },
            { id: 'channels', label: 'Delivery Gateways (WhatsApp / SMS / SMTP)', icon: Smartphone },
            { id: 'security', label: 'Security & Audit Escalations', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSettingsTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-amber-950 dark:text-amber-200 dark:border dark:border-amber-500/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151926] hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. RENTAL REMINDERS & NOTIFICATION TRIGGERS SETTINGS */}
      {/* ========================================================================= */}
      {activeSettingsTab === 'reminders' && (
        <div className="space-y-6">
          {/* Sub Navigation: Triggers Configuration vs Pending Tasks Queue */}
          <div className="flex items-center justify-between bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setReminderSubTab('triggers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  reminderSubTab === 'triggers'
                    ? 'bg-slate-900 text-white dark:bg-amber-950 dark:text-amber-200 dark:border dark:border-amber-500/40 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Trigger Automation Rules</span>
              </button>
              <button
                onClick={() => setReminderSubTab('tasks')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  reminderSubTab === 'tasks'
                    ? 'bg-slate-900 text-white dark:bg-amber-950 dark:text-amber-200 dark:border dark:border-amber-500/40 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Tasks Queue ({pendingCount})</span>
              </button>
            </div>

            {reminderSubTab === 'triggers' ? (
              <button
                onClick={handleSaveTriggers}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Trigger Configurations</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setReminders((prev) =>
                    prev.map((r) =>
                      r.status === 'pending'
                        ? { ...r, status: 'sent', lastSentAt: 'Just now' }
                        : r
                    )
                  );
                  onToast('All pending reminder tasks dispatched!');
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch All Pending</span>
              </button>
            )}
          </div>

          {/* Trigger Rules View */}
          {reminderSubTab === 'triggers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: Upcoming Rent Due Triggers */}
              <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Upcoming Rent Due Notification Triggers
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Dispatch automatic notices prior to tenancy payment due dates.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={triggerSettings.upcomingRentEnabled}
                    onChange={(e) =>
                      setTriggerSettings({ ...triggerSettings, upcomingRentEnabled: e.target.checked })
                    }
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Trigger Days (Days Before Due Date)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { days: 7, label: '7 Days Before (T-7)' },
                        { days: 3, label: '3 Days Before (T-3)' },
                        { days: 1, label: '1 Day Before (T-1)' },
                      ].map((opt) => {
                        const active = triggerSettings.upcomingRentDaysBefore.includes(opt.days);
                        return (
                          <button
                            key={opt.days}
                            type="button"
                            onClick={() => {
                              const updated = active
                                ? triggerSettings.upcomingRentDaysBefore.filter((d) => d !== opt.days)
                                : [...triggerSettings.upcomingRentDaysBefore, opt.days];
                              setTriggerSettings({ ...triggerSettings, upcomingRentDaysBefore: updated });
                            }}
                            className={`p-2 rounded-lg border text-xs font-semibold transition cursor-pointer text-left ${
                              active
                                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-bold'
                                : 'bg-slate-50 dark:bg-[#151926] border-slate-200 dark:border-amber-950/40 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt.label}</span>
                              {active && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Notification Channels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'whatsapp' as NotificationChannel, label: 'WhatsApp API', icon: MessageSquare },
                        { id: 'email' as NotificationChannel, label: 'Email HTML', icon: Mail },
                        { id: 'sms' as NotificationChannel, label: 'UAE SMS Gateway', icon: Smartphone },
                        { id: 'portal_push' as NotificationChannel, label: 'Tenant Portal Push', icon: Bell },
                      ].map((ch) => {
                        const active = triggerSettings.upcomingRentChannels.includes(ch.id);
                        const Icon = ch.icon;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => {
                              const updated = active
                                ? triggerSettings.upcomingRentChannels.filter((c) => c !== ch.id)
                                : [...triggerSettings.upcomingRentChannels, ch.id];
                              setTriggerSettings({ ...triggerSettings, upcomingRentChannels: updated });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                              active
                                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold'
                                : 'bg-slate-50 dark:bg-[#151926] border-slate-200 dark:border-amber-950/40 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{ch.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Upcoming Rent Message Template
                    </label>
                    <textarea
                      rows={3}
                      value={triggerSettings.upcomingRentTemplate}
                      onChange={(e) =>
                        setTriggerSettings({ ...triggerSettings, upcomingRentTemplate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Late Payment & Overdue Alerts */}
              <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Late Payment & Overdue Escalation Triggers
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Automated debt recovery reminders, late fee penalties, and landlord alert dispatches.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={triggerSettings.latePaymentEnabled}
                    onChange={(e) =>
                      setTriggerSettings({ ...triggerSettings, latePaymentEnabled: e.target.checked })
                    }
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Grace Period (Days)
                      </label>
                      <select
                        value={triggerSettings.latePaymentGraceDays}
                        onChange={(e) =>
                          setTriggerSettings({
                            ...triggerSettings,
                            latePaymentGraceDays: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value={0}>0 Days (Immediate on Due Date)</option>
                        <option value={1}>1 Day Grace Period</option>
                        <option value={3}>3 Days Grace Period</option>
                        <option value={5}>5 Days Grace Period</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Late Fee Penalty (AED)
                      </label>
                      <input
                        type="number"
                        value={triggerSettings.latePaymentLateFeeAmount}
                        onChange={(e) =>
                          setTriggerSettings({
                            ...triggerSettings,
                            latePaymentLateFeeAmount: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Escalation Sequence Intervals
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { days: 1, label: 'Day +1 (1st Notice)' },
                        { days: 3, label: 'Day +3 (2nd Notice)' },
                        { days: 7, label: 'Day +7 (Late Fee)' },
                        { days: 14, label: 'Day +14 (Legal RDC)' },
                      ].map((opt) => (
                        <div
                          key={opt.days}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-200 text-xs font-bold text-center"
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Late Payment Escalation Template
                    </label>
                    <textarea
                      rows={3}
                      value={triggerSettings.latePaymentTemplate}
                      onChange={(e) =>
                        setTriggerSettings({ ...triggerSettings, latePaymentTemplate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Tasks Queue View */}
          {reminderSubTab === 'tasks' && (
            <div className="space-y-3">
              {reminders.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          task.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        • {task.recipientName} ({task.unitCode})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      "{task.templatePreview}"
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Due: {task.dueDate}</span>
                      <span>Channels: {task.channels.join(', ')}</span>
                      <span>Scheduled: {task.scheduledTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.status === 'sent' ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCheck className="w-4 h-4" /> Delivered ({task.lastSentAt})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatch(task)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Notice</span>
                      </button>
                    )}

                    <button
                      onClick={() => setPreviewTask(task)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AGENCY & EJARI REGISTRATION */}
      {/* ========================================================================= */}
      {activeSettingsTab === 'agency' && (
        <form
          onSubmit={handleSaveAgency}
          className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-6 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-100 dark:border-amber-950/30 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Agency Master Credentials & Dubai Land Department (DLD) Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official regulatory IDs used for tenancy contract generation, Ejari certificates, and tax invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Agency Name
              </label>
              <input
                type="text"
                value={agencyForm.agencyName}
                onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RERA Brokerage Registration # (ORN)
              </label>
              <input
                type="text"
                value={agencyForm.reraLicense}
                onChange={(e) => setAgencyForm({ ...agencyForm, reraLicense: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ejari DLD Gateway Account ID
              </label>
              <input
                type="text"
                value={agencyForm.ejariAccountId}
                onChange={(e) => setAgencyForm({ ...agencyForm, ejariAccountId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Federal Tax Authority TRN
              </label>
              <input
                type="text"
                value={agencyForm.taxRegistrationNumber}
                onChange={(e) => setAgencyForm({ ...agencyForm, taxRegistrationNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-amber-950/30">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Agency Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. DELIVERY CHANNELS GATEWAY */}
      {/* ========================================================================= */}
      {activeSettingsTab === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Meta WhatsApp Cloud API
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official verified business sender (+971 4 800 2766) for tenant instant dispatches.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-amber-950/30">
              Latency: 320ms • 99.98% Delivery
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                UAE Telecom SMS Gateway
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compliant Etisalat & du registered alphanumeric Sender ID "BRONEX".
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-amber-950/30">
              Credits remaining: 18,420 SMS
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SendGrid Enterprise SMTP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated HTML invoicing, lease renewal notices, and landlord disbursement logs.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-amber-950/30">
              Sender: notifications@bronex.ae
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SECURITY & AUDIT */}
      {/* ========================================================================= */}
      {activeSettingsTab === 'security' && (
        <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Role Escalation Thresholds & Automated Compliance
          </h2>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Mandatory Senior Broker Approval for Discount &gt; 5%
                </div>
                <div className="text-[11px] text-slate-500">Requires executive signature before contract publication.</div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded">
                ENFORCED
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Automated Legal Notice at 15 Days Overdue
                </div>
                <div className="text-[11px] text-slate-500">Stages pre-litigation documents for Rental Dispute Center (RDC).</div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notification Preview
              </h3>
              <button
                onClick={() => setPreviewTask(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-2">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                To: {previewTask.recipientName} ({previewTask.recipientContact})
              </div>
              <div className="p-3 bg-white dark:bg-[#10131d] rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-2xs font-sans leading-relaxed">
                {previewTask.templatePreview}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewTask(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              {previewTask.status !== 'sent' && (
                <button
                  onClick={() => {
                    handleDispatch(previewTask);
                    setPreviewTask(null);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl"
                >
                  Dispatch Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
