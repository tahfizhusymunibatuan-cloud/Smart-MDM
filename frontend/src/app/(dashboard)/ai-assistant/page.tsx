'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Lightbulb, MessageSquare } from 'lucide-react';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      text: 'Assalamu’alaikum Wr. Wb. Saya adalah Asisten AI Pembinaan Smart MDM. Saya siap membantu Pengasuh & Pengurus menganalisis pola penggunaan HP santri dan memberikan rekomendasi pembinaan yang bijak.',
      timestamp: '22.10 WIB',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'USER', text: input, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);

    const userText = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let replyText = 'Pola penggunaan HP santri hari ini terpantau cukup baik. Pengasuh disarankan tetap mengontrol saat jam tidur pukul 22.00 WIB.';
      if (userText.includes('begadang') || userText.includes('malam')) {
        replyText = 'Berdasarkan data 3 hari terakhir, santri di Kamar As-Syafi’i cenderung aktif hingga pukul 00.55 WIB membuka YouTube. Rekomendasi pembinaan: Lakukan dialog personal mengenai pentingnya waktu istirahat dan terapkan fitur Penguncian Jam Tidur otomatis.';
      } else if (userText.includes('tiktok') || userText.includes('game')) {
        replyText = 'Aplikasi TikTok dan Mobile Legends mengalami lonjakan durasi saat jam bebas siang. Disarankan membatasi durasi maksimal 60 menit per hari melalui Policy Engine.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: replyText, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center space-x-2">
            <Bot className="w-6 h-6 text-emerald-500" />
            <span>AI Asisten Pembinaan Santri</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Konsultasikan pola kebiasaan gadget santri dan dapatkan saran pembinaan berbasis AI Gemini.
          </p>
        </div>
      </div>

      {/* Recommended Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {[
          'Siapa saja santri yang sering begadang?',
          'Berapa rata-rata durasi TikTok santri?',
          'Berikan rekomendasi pembinaan Kamar As-Syafi’i',
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(q);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold border border-emerald-500/20 flex items-center space-x-1.5 transition-colors touch-target"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col h-[480px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === 'AI' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {msg.sender === 'AI' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'AI'
                    ? 'bg-accent/40 text-foreground border border-border/50'
                    : 'bg-emerald-500 text-white font-medium'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-70 mt-1 block text-right">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-border/50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis pola HP atau rekomendasi pembinaan santri..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-accent/40 border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors touch-target flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
