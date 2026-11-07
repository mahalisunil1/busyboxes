'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  Paperclip,
  CheckCheck,
} from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const { isChatOpen, setIsChatOpen, messages, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    'Can we schedule a 15-min call?',
    'What is your expected turnaround?',
    'Can you provide a custom offer?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Elena"
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Elena Rostova</h4>
            <p className="text-[11px] text-emerald-600 font-medium">Online • Verified Specialist</p>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2 text-xs sm:text-sm leading-relaxed ${
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

      {/* Quick Replies */}
      <div className="px-3 py-2 border-t border-slate-200 bg-white overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(qr)}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 whitespace-nowrap"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-[#0a66c2] hover:bg-[#084e96] text-white"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
