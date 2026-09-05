import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, CheckCheck, User } from 'lucide-react';

interface MessagesViewProps {
  onToast: (msg: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ onToast }) => {
  const [activeChat, setActiveChat] = useState('chat-1');
  const [replyText, setReplyText] = useState('');

  const threads = [
    {
      id: 'chat-1',
      client: 'Elena Rostova',
      deal: '#DXB-04220 • Palm Jumeirah Waterfront Villa',
      lastMessage: 'Is the private dock approved for up to 60ft yachts?',
      time: '10:42 AM',
      unread: true,
    },
    {
      id: 'chat-2',
      client: "James O'Connor",
      deal: '#DXB-04219 • 3-Bed Terrace & Garden',
      lastMessage: 'We are reviewing the Escrow deposit instructions.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 'chat-3',
      client: 'Wei Chen',
      deal: '#DXB-04208 • Marina Promenade Suite',
      lastMessage: 'Can we schedule a second inspection this Thursday at 3 PM?',
      time: 'Nov 20',
      unread: false,
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    onToast('Message sent to client.');
    setReplyText('');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Client Messaging</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Unified omnichannel chat with WhatsApp, Email & Portal SMS integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden h-[600px]">
        {/* Left: Chat List */}
        <div className="border-r border-slate-200/80 dark:border-slate-800 overflow-y-auto p-2 space-y-1">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveChat(t.id)}
              className={`p-3 rounded-xl transition cursor-pointer text-xs space-y-1 ${
                activeChat === t.id
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-900 dark:text-white">{t.client}</span>
                <span className="text-[10px] text-slate-400 font-normal">{t.time}</span>
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate">{t.deal}</div>
              <div className="text-[11px] text-slate-500 truncate font-normal">{t.lastMessage}</div>
            </div>
          ))}
        </div>

        {/* Right: Active Chat Conversation */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-50/40 dark:bg-slate-950/40">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Elena Rostova</h3>
              <p className="text-[10px] font-mono text-slate-400">#DXB-04220 • Palm Jumeirah Waterfront Villa</p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-semibold">
              WhatsApp Verified
            </span>
          </div>

          <div className="flex-1 py-4 space-y-3 overflow-y-auto text-xs">
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl max-w-md shadow-2xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                Hi Keyvan, is the private dock approved for up to 60ft yachts? Also what is the scheduled service charge per sqft?
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-slate-900 text-white dark:bg-blue-600 p-3 rounded-2xl max-w-md shadow-2xs text-left">
                Good morning Elena! Yes, Nakheel and Dubai Maritime City Authority have certified the slipway for up to 65ft crafts. Service fees are AED 18/sqft/year.
              </div>
            </div>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              placeholder="Type message or paste SPA clause..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            <button
              type="submit"
              className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
