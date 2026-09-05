import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Filter,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface TasksViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigateTab, onToast }) => {
  const [tasks, setTasks] = useState([
    {
      id: 't-1',
      title: 'Send Revised SPA Contract for Deal #DXB-04207',
      due: 'Today, 4:00 PM',
      priority: 'High',
      client: 'Vikram Malhotra',
      completed: false,
    },
    {
      id: 't-2',
      title: 'Host VIP Viewing at Palm Jumeirah Waterfront Villa',
      due: 'Tomorrow, 11:30 AM',
      priority: 'High',
      client: 'Elena Rostova',
      completed: false,
    },
    {
      id: 't-3',
      title: 'Verify Proof of Funds & AML documentation',
      due: '24 Nov 2025',
      priority: 'Medium',
      client: "James O'Connor",
      completed: true,
    },
    {
      id: 't-4',
      title: 'Follow up on 5% Developer Discount request',
      due: '26 Nov 2025',
      priority: 'Low',
      client: 'Wei Chen',
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    onToast('Task updated');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Broker Tasks & Milestones
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active action items, viewing arrangements, and document deadlines across all pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('New Task modal opened')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-xs hover:bg-slate-800 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-5 space-y-3">
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                t.completed
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 hover:border-blue-400 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <div>
                  <h3
                    className={`font-semibold text-xs text-slate-900 dark:text-white ${
                      t.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {t.due}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {t.client}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  t.priority === 'High'
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
                    : t.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {t.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
