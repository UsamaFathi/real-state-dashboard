import React, { useState } from 'react';
import { BookUser, Search, Plus, Phone, Mail, MapPin, Building2, ExternalLink } from 'lucide-react';

interface ContactsViewProps {
  onToast: (msg: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    {
      id: 'c-1',
      name: "James O'Connor",
      title: 'Principal Investor',
      company: 'O’Connor Family Office',
      location: 'London, UK / Dubai',
      email: 'james.oconnor@investor.co.uk',
      phone: '+971 50 192 8472',
      dealsCount: 2,
    },
    {
      id: 'c-2',
      name: 'Amira Al-Fayed',
      title: 'Managing Director',
      company: 'Al-Fayed Hospitality Holdings',
      location: 'Abu Dhabi, UAE',
      email: 'amira.alfayed@holding.ae',
      phone: '+971 55 930 1123',
      dealsCount: 1,
    },
    {
      id: 'c-3',
      name: 'Wei Chen',
      title: 'Executive VP',
      company: 'Shanghai Pacific Real Estate Fund',
      location: 'Shanghai, China',
      email: 'wei.chen@shanghai-capital.cn',
      phone: '+86 138 0013 8000',
      dealsCount: 3,
    },
    {
      id: 'c-4',
      name: 'Elena Rostova',
      title: 'Private Client',
      company: 'Monaco Capital Partners',
      location: 'Monaco / Dubai Palm',
      email: 'e.rostova@monacocap.mc',
      phone: '+971 52 481 9920',
      dealsCount: 2,
    },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Contacts & Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            HNW investors, family offices, sovereign funds, and legal representatives.
          </p>
        </div>

        <button
          onClick={() => onToast('Add contact modal opened')}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-xs hover:bg-slate-800 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-sm">
                {c.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">{c.title} • {c.company}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px] truncate">{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">{c.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className="text-slate-400 font-semibold">{c.dealsCount} Active Deals</span>
              <button
                onClick={() => onToast(`Direct call initiated to ${c.phone}`)}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Call Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
