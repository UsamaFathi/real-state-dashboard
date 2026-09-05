import React from 'react';
import { Link2, Check, ExternalLink, Zap } from 'lucide-react';

interface IntegrationsViewProps {
  onToast: (msg: string) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ onToast }) => {
  const integrations = [
    { name: 'Zapier Automation', desc: 'Sync new web inquiries directly to DXB deal pipelines.', status: 'Connected', icon: '⚡' },
    { name: 'Slack Notifications', desc: 'Real-time alert on offers, escrow deposits & viewing requests.', status: 'Connected', icon: '💬' },
    { name: 'HubSpot Real Estate CRM', desc: 'Two-way sync of high-net-worth investor contact records.', status: 'Connected', icon: '🟠' },
    { name: 'WhatsApp Business API', desc: 'Direct message VIP clients with brochure floorplans.', status: 'Connected', icon: '🟢' },
    { name: 'DocuSign / UAE PASS e-Signature', desc: 'Sign real estate SPAs and agency agreements digitally.', status: 'Active', icon: '✍️' },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Integrations</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Connect your CRM pipeline with property portals, automated webhooks & signature services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>

            <button
              onClick={() => onToast(`${item.name} settings updated`)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 transition cursor-pointer shrink-0"
            >
              Configured
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
