import React, { useState } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  Calendar,
  MessageSquare,
  Mail,
  Smartphone,
  ShieldAlert,
  User,
  Building,
  DollarSign,
  Plus,
  RefreshCw,
  Edit3,
  XCircle,
  Eye,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  CheckCheck,
  AlertCircle,
  Copy,
} from 'lucide-react';
import {
  ReminderTask,
  ReminderTriggerSettings,
  ReminderCategory,
  ReminderStatus,
  NotificationChannel,
} from '../../types/rentalTypes';

interface RentalRemindersTabProps {
  reminders: ReminderTask[];
  onUpdateReminder: (updated: ReminderTask) => void;
  onAddReminder: (newTask: ReminderTask) => void;
  onDeleteReminder: (id: string) => void;
  triggerSettings: ReminderTriggerSettings;
  onUpdateTriggerSettings: (newSettings: ReminderTriggerSettings) => void;
  onToast: (msg: string) => void;
}

export const RentalRemindersTab: React.FC<RentalRemindersTabProps> = ({
  reminders,
  onUpdateReminder,
  onAddReminder,
  onDeleteReminder,
  triggerSettings,
  onUpdateTriggerSettings,
  onToast,
}) => {
  // Active subview: 'queue' (Pending reminder tasks) or 'triggers' (Trigger automation settings)
  const [subTab, setSubTab] = useState<'queue' | 'triggers'>('queue');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'scheduled' | 'sent'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Draft / Edit modal state
  const [editingTask, setEditingTask] = useState<ReminderTask | null>(null);
  const [previewTask, setPreviewTask] = useState<ReminderTask | null>(null);

  // New manual reminder task modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    category: 'upcoming_rent' as ReminderCategory,
    recipientName: '',
    recipientContact: '',
    recipientType: 'Tenant' as 'Tenant' | 'Landlord' | 'Agent' | 'Finance',
    unitCode: 'DXB-PALM-402',
    propertyName: 'Azure Palm Penthouse Suite',
    amount: 16500,
    dueDate: '2026-09-15',
    daysDiff: -3,
    channels: ['whatsapp', 'email'] as NotificationChannel[],
    scheduledTime: 'Today, 15:00 PM',
    priority: 'high' as 'low' | 'medium' | 'high' | 'urgent',
    templatePreview: '',
  });

  // Local settings draft state
  const [localSettings, setLocalSettings] = useState<ReminderTriggerSettings>(triggerSettings);

  // Quick Stats
  const pendingCount = reminders.filter((r) => r.status === 'pending').length;
  const scheduledCount = reminders.filter((r) => r.status === 'scheduled').length;
  const sentCount = reminders.filter((r) => r.status === 'sent').length;
  const urgentCount = reminders.filter((r) => r.priority === 'urgent' && r.status !== 'sent').length;

  // Filtered Reminders
  const filteredReminders = reminders.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        task.title.toLowerCase().includes(q) ||
        task.recipientName.toLowerCase().includes(q) ||
        task.unitCode.toLowerCase().includes(q) ||
        task.propertyName.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Action: Dispatch single reminder
  const handleDispatch = (task: ReminderTask) => {
    const updated: ReminderTask = {
      ...task,
      status: 'sent',
      lastSentAt: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
    };
    onUpdateReminder(updated);
    onToast(`Dispatched reminder to ${task.recipientName} via ${task.channels.join(', ')}`);
  };

  // Action: Dispatch all pending
  const handleDispatchAllPending = () => {
    const pendingList = reminders.filter((r) => r.status === 'pending');
    if (pendingList.length === 0) {
      onToast('No pending reminders waiting for immediate dispatch.');
      return;
    }
    pendingList.forEach((task) => {
      onUpdateReminder({
        ...task,
        status: 'sent',
        lastSentAt: 'Just now',
      });
    });
    onToast(`Successfully dispatched all ${pendingList.length} pending notification tasks!`);
  };

  // Action: Snooze reminder
  const handleSnooze = (task: ReminderTask, hours: number) => {
    const updated: ReminderTask = {
      ...task,
      status: 'scheduled',
      scheduledTime: `Snoozed for ${hours}h (Rescheduled)`,
      snoozedUntil: `In ${hours} hours`,
    };
    onUpdateReminder(updated);
    onToast(`Reminder for ${task.recipientName} snoozed for ${hours} hours.`);
  };

  // Action: Save trigger settings
  const handleSaveSettings = () => {
    onUpdateTriggerSettings(localSettings);
    onToast('Notification trigger automation settings saved & synchronized with Odoo cron engine.');
  };

  // Action: Create manual task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.recipientName || !newTaskForm.title) {
      onToast('Please fill in required reminder title and recipient.');
      return;
    }

    const newTask: ReminderTask = {
      id: `rem-custom-${Date.now()}`,
      category: newTaskForm.category,
      title: newTaskForm.title,
      description: `Manual reminder task created for ${newTaskForm.recipientName}`,
      recipientName: newTaskForm.recipientName,
      recipientContact: newTaskForm.recipientContact || 'contact@client.ae',
      recipientType: newTaskForm.recipientType,
      unitCode: newTaskForm.unitCode,
      propertyName: newTaskForm.propertyName,
      amount: newTaskForm.amount,
      dueDate: newTaskForm.dueDate,
      daysDiff: newTaskForm.daysDiff,
      channels: newTaskForm.channels,
      scheduledTime: newTaskForm.scheduledTime,
      status: 'pending',
      priority: newTaskForm.priority,
      templatePreview:
        newTaskForm.templatePreview ||
        `Notice for ${newTaskForm.recipientName}: Rent installment for ${newTaskForm.unitCode} (AED ${newTaskForm.amount.toLocaleString()}) due on ${newTaskForm.dueDate}.`,
    };

    onAddReminder(newTask);
    setIsNewTaskModalOpen(false);
    onToast(`Created manual reminder task for ${newTaskForm.recipientName}`);
  };

  const getCategoryBadge = (cat: ReminderCategory) => {
    switch (cat) {
      case 'upcoming_rent':
        return {
          label: 'Upcoming Rent Due',
          bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
          icon: Clock,
        };
      case 'late_payment':
        return {
          label: 'Late Payment Overdue',
          bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
          icon: ShieldAlert,
        };
      case 'lease_renewal':
        return {
          label: 'RERA Lease Expiry',
          bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
          icon: Calendar,
        };
      case 'pdc_presentation':
        return {
          label: 'PDC Cheque Clearing',
          bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
          icon: DollarSign,
        };
      case 'landlord_statement':
        return {
          label: 'Landlord Statement',
          bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
          icon: CheckCircle2,
        };
      default:
        return {
          label: 'Reminder Task',
          bg: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: Bell,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Rental Reminders & Automated Triggers
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                    Odoo 19.0 Cron Engine Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure automated dispatch rules for rent collection, overdue penalty escalation, and manage live reminder task queues.
                </p>
              </div>
            </div>
          </div>

          {/* SubTab Toggle & Global Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 dark:bg-[#151926] p-1 rounded-xl border border-slate-200/80 dark:border-amber-950/50">
              <button
                onClick={() => setSubTab('queue')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  subTab === 'queue'
                    ? 'bg-white dark:bg-amber-950/70 text-slate-900 dark:text-amber-200 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Tasks Queue</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSubTab('triggers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  subTab === 'triggers'
                    ? 'bg-white dark:bg-amber-950/70 text-slate-900 dark:text-amber-200 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Notification Triggers Settings</span>
              </button>
            </div>

            {subTab === 'queue' && (
              <>
                <button
                  onClick={handleDispatchAllPending}
                  disabled={pendingCount === 0}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950 dark:font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch All Pending ({pendingCount})</span>
                </button>

                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-[#1a1f30] dark:hover:bg-[#232940] dark:text-amber-200 dark:border dark:border-amber-950/60 text-xs font-medium rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Reminder Task</span>
                </button>
              </>
            )}

            {subTab === 'triggers' && (
              <button
                onClick={handleSaveSettings}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Trigger Settings</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-amber-950/30">
          <div className="p-3 bg-slate-50 dark:bg-[#10131d] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Pending Action Tasks
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
              <span>{pendingCount}</span>
              {pendingCount > 0 && (
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                  Requires Review
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#10131d] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Scheduled for Auto-Dispatch
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {scheduledCount}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#10131d] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Sent & Delivered (This Month)
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span>{sentCount}</span>
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#10131d] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Urgent Escalations
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {urgentCount}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: PENDING REMINDER TASKS QUEUE */}
      {/* ========================================================================= */}
      {subTab === 'queue' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
            {/* Status pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `All Tasks (${reminders.length})` },
                { id: 'pending', label: `Pending Action (${pendingCount})` },
                { id: 'scheduled', label: `Scheduled (${scheduledCount})` },
                { id: 'sent', label: `Sent / Delivered (${sentCount})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    statusFilter === pill.id
                      ? 'bg-slate-900 text-white dark:bg-amber-950 dark:text-amber-200 dark:border dark:border-amber-500/40 shadow-xs'
                      : 'bg-slate-100 dark:bg-[#151926] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Category Dropdown & Search */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Notification Types</option>
                <option value="upcoming_rent">Upcoming Rent Due</option>
                <option value="late_payment">Late Payment Overdue</option>
                <option value="lease_renewal">RERA Lease Expiration</option>
                <option value="pdc_presentation">PDC Cheque Alert</option>
                <option value="landlord_statement">Landlord Payout</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tenant, unit or message..."
                className="px-3 py-1.5 bg-slate-100 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none w-48 sm:w-64"
              />
            </div>
          </div>

          {/* Tasks List */}
          {filteredReminders.length === 0 ? (
            <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <CheckCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No reminders match the selected criteria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                All scheduled rent notices and overdue alerts have been processed or filtered out.
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 bg-slate-100 dark:bg-[#151926] hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredReminders.map((task) => {
                const badge = getCategoryBadge(task.category);
                const CategoryIcon = badge.icon;
                const isSent = task.status === 'sent';
                const isPending = task.status === 'pending';

                return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-[#0c0e17] rounded-xl border p-4 transition-all hover:shadow-sm ${
                      task.priority === 'urgent' && !isSent
                        ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                        : isSent
                        ? 'border-slate-200/60 dark:border-amber-950/20 opacity-80'
                        : 'border-slate-200/80 dark:border-amber-950/40'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Task Identity & Category */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 ${badge.bg}`}
                          >
                            <CategoryIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              task.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                                : task.priority === 'high'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {task.priority} Priority
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              task.status === 'sent'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : task.status === 'pending'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {task.status === 'sent'
                              ? 'Delivered'
                              : task.status === 'pending'
                              ? 'Pending Manual Action'
                              : 'Auto-Scheduled'}
                          </span>

                          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                            {task.scheduledTime}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {task.title}
                          </h4>
                          {task.amount && (
                            <span className="text-xs font-bold text-slate-700 dark:text-amber-300">
                              (AED {task.amount.toLocaleString()})
                            </span>
                          )}
                        </div>

                        {/* Recipient & Property details */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{task.recipientName}</span>
                            <span className="text-[10px] text-slate-400">({task.recipientType})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-700 dark:text-amber-200/90 font-mono">
                              {task.unitCode}
                            </span>
                            <span className="text-slate-400">({task.propertyName})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Due Date: {task.dueDate}</span>
                            {task.daysDiff > 0 ? (
                              <span className="text-rose-600 dark:text-rose-400 font-bold">
                                ({task.daysDiff} days overdue)
                              </span>
                            ) : task.daysDiff === 0 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">
                                (Due Today)
                              </span>
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400">
                                (in {Math.abs(task.daysDiff)} days)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Message Preview Quote Bubble */}
                        <div className="mt-2 p-2.5 bg-slate-50 dark:bg-[#121520] rounded-lg border border-slate-200/60 dark:border-amber-950/30 text-xs text-slate-700 dark:text-slate-300 relative group font-sans">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1">
                            <span className="font-semibold uppercase tracking-wider">
                              Dispatched Message Draft
                            </span>
                            <div className="flex items-center gap-1.5">
                              {task.channels.map((ch) => (
                                <span
                                  key={ch}
                                  className="px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px] font-medium capitalize"
                                >
                                  {ch.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="line-clamp-2 text-slate-600 dark:text-slate-300">
                            "{task.templatePreview}"
                          </p>
                        </div>
                      </div>

                      {/* Right: Task Action Buttons */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-amber-950/30 pt-3 lg:pt-0 lg:pl-4 shrink-0">
                        {isSent ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Delivered ({task.lastSentAt})</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDispatch(task)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Notice Now</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setPreviewTask(task)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Preview Full Notification"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Edit Message Draft"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {!isSent && (
                            <button
                              onClick={() => handleSnooze(task, 24)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition cursor-pointer"
                              title="Snooze 24 hours"
                            >
                              Snooze 24h
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onDeleteReminder(task.id);
                              onToast('Reminder task dismissed.');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                            title="Dismiss Task"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: NOTIFICATION TRIGGER AUTOMATION SETTINGS */}
      {/* ========================================================================= */}
      {subTab === 'triggers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Upcoming Rent Due Triggers */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Upcoming Rent Due Triggers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Proactive notification rules sent prior to tenancy installment due dates.
                  </p>
                </div>
              </div>

              {/* Master toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.upcomingRentEnabled}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, upcomingRentEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div className="space-y-3 pt-2">
              {/* Trigger Days Timeline */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Notification Schedule (Days Before Due Date)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 7, label: '7 Days Before (T-7)' },
                    { days: 3, label: '3 Days Before (T-3)' },
                    { days: 1, label: '1 Day Before (T-1)' },
                  ].map((option) => {
                    const isChecked = localSettings.upcomingRentDaysBefore.includes(option.days);
                    return (
                      <button
                        key={option.days}
                        type="button"
                        onClick={() => {
                          const updated = isChecked
                            ? localSettings.upcomingRentDaysBefore.filter((d) => d !== option.days)
                            : [...localSettings.upcomingRentDaysBefore, option.days];
                          setLocalSettings({ ...localSettings, upcomingRentDaysBefore: updated });
                        }}
                        className={`p-2 rounded-lg border text-xs font-semibold transition cursor-pointer text-left ${
                          isChecked
                            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-bold'
                            : 'bg-slate-50 dark:bg-[#151926] border-slate-200 dark:border-amber-950/40 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Channels */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Active Dispatch Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'whatsapp' as NotificationChannel, label: 'WhatsApp API', icon: MessageSquare },
                    { id: 'email' as NotificationChannel, label: 'Email HTML', icon: Mail },
                    { id: 'sms' as NotificationChannel, label: 'UAE SMS Gateway', icon: Smartphone },
                    { id: 'portal_push' as NotificationChannel, label: 'Tenant Portal Push', icon: Bell },
                  ].map((ch) => {
                    const active = localSettings.upcomingRentChannels.includes(ch.id);
                    const Icon = ch.icon;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          const updated = active
                            ? localSettings.upcomingRentChannels.filter((c) => c !== ch.id)
                            : [...localSettings.upcomingRentChannels, ch.id];
                          setLocalSettings({ ...localSettings, upcomingRentChannels: updated });
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

              {/* Auto-send toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Auto-Dispatch Without Manual Confirmation
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    If disabled, upcoming notices are staged in the task queue for broker approval.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.upcomingRentAutoSend}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, upcomingRentAutoSend: e.target.checked })
                  }
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
              </div>

              {/* Message Template Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upcoming Rent Message Template
                  </label>
                  <span className="text-[10px] text-slate-400">Supports dynamic placeholders</span>
                </div>
                <textarea
                  rows={3}
                  value={localSettings.upcomingRentTemplate}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, upcomingRentTemplate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['{{tenant_name}}', '{{amount}}', '{{due_date}}', '{{unit_code}}', '{{property_name}}'].map(
                    (tag) => (
                      <span
                        key={tag}
                        onClick={() =>
                          setLocalSettings({
                            ...localSettings,
                            upcomingRentTemplate: localSettings.upcomingRentTemplate + ' ' + tag,
                          })
                        }
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-amber-300 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40"
                        title="Click to insert variable"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Late Payment & Overdue Alerts */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Late Payment & Escalation Triggers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automated debt recovery reminders, late fee additions, and landlord alert triggers.
                  </p>
                </div>
              </div>

              {/* Master toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.latePaymentEnabled}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, latePaymentEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-rose-600"></div>
              </label>
            </div>

            <div className="space-y-3 pt-2">
              {/* Grace Period & Escalation Frequency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grace Period Before First Alert
                  </label>
                  <select
                    value={localSettings.latePaymentGraceDays}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
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
                    value={localSettings.latePaymentLateFeeAmount}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        latePaymentLateFeeAmount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Escalation Sequence Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Escalation Trigger Intervals (Days Overdue)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 1, label: 'Day +1 (1st Notice)' },
                    { days: 3, label: 'Day +3 (2nd Notice)' },
                    { days: 7, label: 'Day +7 (Late Fee)' },
                    { days: 14, label: 'Day +14 (Legal RDC)' },
                  ].map((option) => {
                    const isChecked = localSettings.latePaymentFrequencyDays.includes(option.days);
                    return (
                      <button
                        key={option.days}
                        type="button"
                        onClick={() => {
                          const updated = isChecked
                            ? localSettings.latePaymentFrequencyDays.filter((d) => d !== option.days)
                            : [...localSettings.latePaymentFrequencyDays, option.days];
                          setLocalSettings({ ...localSettings, latePaymentFrequencyDays: updated });
                        }}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer text-center ${
                          isChecked
                            ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 font-bold'
                            : 'bg-slate-50 dark:bg-[#151926] border-slate-200 dark:border-amber-950/40 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Landlord Notification Trigger */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Notify Landlord When Overdue Exceeds 5 Days
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sends an automated status dispatch to property owner with collection actions taken.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.latePaymentNotifyLandlord}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      latePaymentNotifyLandlord: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
              </div>

              {/* Message Template Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overdue Urgent Notice Template
                </label>
                <textarea
                  rows={3}
                  value={localSettings.latePaymentTemplate}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, latePaymentTemplate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 font-sans"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['{{tenant_name}}', '{{amount}}', '{{days_overdue}}', '{{late_fee}}', '{{due_date}}'].map(
                    (tag) => (
                      <span
                        key={tag}
                        onClick={() =>
                          setLocalSettings({
                            ...localSettings,
                            latePaymentTemplate: localSettings.latePaymentTemplate + ' ' + tag,
                          })
                        }
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-rose-300 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: UAE RERA Lease Renewal Triggers */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    RERA Statutory Lease Expiry Notice (90-Day Law)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Compliant automated notices for tenancy contract renewal or termination.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={localSettings.leaseRenewalEnabled}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, leaseRenewalEnabled: e.target.checked })
                }
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 90, label: '90 Days (RERA Law)' },
                  { days: 60, label: '60 Days Prior' },
                  { days: 30, label: '30 Days Final Call' },
                ].map((option) => (
                  <div
                    key={option.days}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-[#151926] border border-slate-200/80 dark:border-amber-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center"
                  >
                    {option.label}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  RERA Renewal Template
                </label>
                <textarea
                  rows={2}
                  value={localSettings.leaseRenewalTemplate}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, leaseRenewalTemplate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 4: PDC Cheque Presentation & Portal Digestion */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    PDC Cheque Banking & Daily Operations Digest
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Internal notifications for physical cheque presentation and manager digests.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    PDC Banking Alert (3 Business Days Prior)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Alerts finance team to present post-dated cheques to clearing banks.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.pdcAlertEnabled}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, pdcAlertEnabled: e.target.checked })
                  }
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/60 dark:border-amber-950/30">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Daily 08:30 AM Operations Executive Digest
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Summary of all overdue leases and pending collections delivered via email.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.adminEmailDigest}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, adminEmailDigest: e.target.checked })
                  }
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW NOTIFICATION */}
      {/* ========================================================================= */}
      {previewTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Preview Notification Dispatch
                </h3>
              </div>
              <button
                onClick={() => setPreviewTask(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-[#151926] rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {previewTask.recipientName} ({previewTask.recipientContact})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Reference:</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-amber-300">
                    {previewTask.unitCode} ({previewTask.propertyName})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channels:</span>
                  <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {previewTask.channels.join(', ')}
                  </span>
                </div>
              </div>

              {/* Realistic WhatsApp / SMS Bubble Preview */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Business (Verified UAE Sender: Bronex Real Estate)</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#10131d] rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-2xs font-sans leading-relaxed">
                  {previewTask.templatePreview}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewTask(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
              {previewTask.status !== 'sent' && (
                <button
                  onClick={() => {
                    handleDispatch(previewTask);
                    setPreviewTask(null);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MESSAGE DRAFT */}
      {/* ========================================================================= */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Reminder Draft Message
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content (Will be sent to {editingTask.recipientName})
                </label>
                <textarea
                  rows={4}
                  value={editingTask.templatePreview}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, templatePreview: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, priority: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Escalation</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateReminder(editingTask);
                  setEditingTask(null);
                  onToast('Draft updated successfully.');
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NEW MANUAL REMINDER TASK */}
      {/* ========================================================================= */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-white dark:bg-[#0c0e17] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create Manual Reminder Task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g. October Rent Follow-up or Security Deposit Refund"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newTaskForm.category}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="upcoming_rent">Upcoming Rent Due</option>
                    <option value="late_payment">Late Payment Notice</option>
                    <option value="lease_renewal">Lease Renewal Notice</option>
                    <option value="pdc_presentation">PDC Cheque Alert</option>
                    <option value="landlord_statement">Landlord Payout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskForm.recipientName}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, recipientName: e.target.value })
                    }
                    placeholder="e.g. Dr. Sophie Laurent"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Contact (Phone / Email)
                  </label>
                  <input
                    type="text"
                    value={newTaskForm.recipientContact}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, recipientContact: e.target.value })
                    }
                    placeholder="+971 50 ... / email@domain.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Property Unit
                  </label>
                  <input
                    type="text"
                    value={newTaskForm.unitCode}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, unitCode: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (AED)
                  </label>
                  <input
                    type="number"
                    value={newTaskForm.amount}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, amount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Message Content
                </label>
                <textarea
                  rows={2}
                  value={newTaskForm.templatePreview}
                  onChange={(e) =>
                    setNewTaskForm({ ...newTaskForm, templatePreview: e.target.value })
                  }
                  placeholder="Leave empty to use standard automated template..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
