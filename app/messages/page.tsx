'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Search,
  Send,
  CheckCheck,
  ShieldCheck,
  Video,
} from 'lucide-react';

export default function MessagesPage() {
  const { messages, sendMessage, showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeContactId, setActiveContactId] = useState('elena');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const contacts = [
    {
      id: 'elena',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Full-Stack Engineer',
      lastMessage: 'Got it! I am bundling the webhook listeners and idempotency checks into the Standard tier for you.',
      time: '10:50 AM',
      online: true,
    },
    {
      id: 'aravind',
      name: 'Aravind Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Principal Product Designer',
      lastMessage: 'Shared the Figma prototypes for review.',
      time: 'Yesterday',
      online: false,
    },
    {
      id: 'maya',
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'AI Research Engineer',
      lastMessage: 'The vector database ingestion has completed.',
      time: '2d ago',
      online: true,
    },
  ];

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Left 4 Cols: Contacts Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-3.5 border-b border-slate-200 space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#0a66c2]" />
              <span>Messaging</span>
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  activeContactId === contact.id
                    ? 'bg-white border-l-4 border-[#0a66c2] shadow-2xs'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {contact.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{contact.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{contact.role}</p>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Active Chat Feed */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{activeContact.name}</h3>
                <p className="text-[11px] text-slate-500">{activeContact.role}</p>
              </div>
            </div>

            <button
              onClick={() => showToast('Meeting link generated', 'info')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="Start call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3.5 py-2 text-xs sm:text-sm leading-relaxed ${
                    msg.isMe
                      ? 'bg-[#0a66c2] text-white shadow-2xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck className="w-3 h-3 text-[#0a66c2]" />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeContact.name}...`}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#084e96] flex items-center gap-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
