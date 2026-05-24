import React, { useState, useEffect } from 'react';
import type { Message } from '../types';
import { saveMessages, loadMessages } from '../lib/indexedDB';
import ChatPanel from './ChatPanel';
import { Cpu, RotateCcw } from 'lucide-react';

export default function RateMyPC() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [cpu, setCpu] = useState('');
  const [vga, setVga] = useState('');
  const [ram, setRam] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    loadMessages('chat_messages_pc').then(saved => {
      if (saved && saved.length > 0) {
        setMessages(saved);
        // Try to parse specs from the first user message if possible
        const firstUserMsg = saved.find(m => m.role === 'user');
        if (firstUserMsg) {
          const cpuMatch = firstUserMsg.text.match(/CPU:\s*([^\n]+)/i);
          const vgaMatch = firstUserMsg.text.match(/GPU:\s*([^\n]+)/i);
          const ramMatch = firstUserMsg.text.match(/RAM:\s*([^\n]+)/i);
          if (cpuMatch) setCpu(cpuMatch[1]);
          if (vgaMatch) setVga(vgaMatch[1]);
          if (ramMatch) setRam(ramMatch[1]);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  // Save to DB on change
  useEffect(() => {
    if (isLoaded) {
      saveMessages(messages, 'chat_messages_pc');
    }
  }, [messages, isLoaded]);

  const handleSend = async () => {
    if (loading) return;

    // Check if this is the first message (meaning specs need to be provided)
    const isFirstMsg = messages.length === 0;

    if (isFirstMsg) {
      if (!cpu.trim() || !vga.trim() || !ram.trim()) {
        alert("Wajib isi CPU, VGA/GPU, dan RAM dulu ya ngab!");
        return;
      }
    }

    let userText = '';
    if (isFirstMsg) {
      userText = `CPU: ${cpu.trim()}\nGPU: ${vga.trim()}\nRAM: ${ram.trim()}`;
      if (input.trim()) {
        userText += `\n\nCatatan Tambahan: ${input.trim()}`;
      }
    } else {
      if (!input.trim()) return;
      userText = input.trim();
    }

    const newMessage: Message = {
      role: 'user',
      text: userText
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const contents = updatedMessages.map(msg => {
        return {
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        };
      });

      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, mode: 'rate-pc' }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessages(prev => [...prev, { role: 'model', text: `**SYSTEM ERROR:** ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: `**NETWORK ERROR:** ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCpu('');
    setVga('');
    setRam('');
    setInput('');
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-8 min-h-[80vh] relative">
      {messages.length === 0 ? (
        <div className="max-w-[600px] mx-auto w-full border border-taupe bg-white p-6 md:p-[32px] shadow-[0px_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-deep-black" />
            <h2 className="font-mono text-[12.6px] font-bold text-deep-black uppercase tracking-wider">Rate Oh My PC </h2>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="font-mono text-[10.8px] font-bold uppercase text-charcoal mb-2">CPU (Processor)</label>
              <input 
                type="text" 
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                placeholder="e.g. Intel Core i5-12400F / AMD Ryzen 5 5600X"
                className="bg-beige border border-taupe p-3 font-sans text-[16px] text-deep-black focus:outline-none focus:border-deep-black transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10.8px] font-bold uppercase text-charcoal mb-2">VGA / GPU (Graphics Card)</label>
              <input 
                type="text" 
                value={vga}
                onChange={(e) => setVga(e.target.value)}
                placeholder="e.g. NVIDIA RTX 3060 / AMD RX 6600 XT"
                className="bg-beige border border-taupe p-3 font-sans text-[16px] text-deep-black focus:outline-none focus:border-deep-black transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10.8px] font-bold uppercase text-charcoal mb-2">RAM (Memory)</label>
              <input 
                type="text" 
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="e.g. 16GB DDR4 / 32GB DDR5"
                className="bg-beige border border-taupe p-3 font-sans text-[16px] text-deep-black focus:outline-none focus:border-deep-black transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10.8px] font-bold uppercase text-charcoal mb-2">Catatan Tambahan (Optional)</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ada game spesifik yang mau ditanyain ngab?"
                className="bg-beige border border-taupe p-3 font-sans text-[16px] text-deep-black focus:outline-none focus:border-deep-black transition-all resize-none min-h-[80px]"
              />
            </div>

            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-deep-black text-white py-3.5 font-mono text-[10.8px] font-bold uppercase hover:bg-charcoal transition-all disabled:opacity-50 tracking-wider"
            >
              {loading ? 'ANALYZING SPECS...' : 'RATE MY SPEC'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-taupe bg-white p-4 md:p-[32px] flex flex-col lg:flex-row gap-[32px] min-h-[70vh] shadow-[0px_4px_24px_rgba(0,0,0,0.04)]">
          {/* Spec details left side */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h3 className="font-mono text-[12.6px] font-semibold text-deep-black uppercase tracking-wider">Current PC Spec</h3>
            
            <div className="bg-beige border border-taupe p-6 flex flex-col gap-4">
              <div>
                <span className="font-mono text-[10px] text-taupe uppercase block">CPU</span>
                <span className="font-sans text-[16px] font-bold text-deep-black">{cpu || '-'}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-taupe uppercase block">GPU / VGA</span>
                <span className="font-sans text-[16px] font-bold text-deep-black">{vga || '-'}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-taupe uppercase block">RAM</span>
                <span className="font-sans text-[16px] font-bold text-deep-black">{ram || '-'}</span>
              </div>
            </div>

            <button 
              onClick={handleReset}
              disabled={loading}
              className="mt-auto flex items-center justify-center gap-2 w-full bg-transparent text-charcoal font-mono text-[10.8px] font-medium leading-[9px] py-[13.5px] border border-transparent hover:border-taupe hover:bg-beige transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3 h-3" /> RESET SPEC & CHAT
            </button>
          </div>

          <ChatPanel 
             messages={messages} 
             pendingImagesCount={0} 
             input={input} 
             setInput={setInput} 
             onSend={handleSend} 
             loading={loading}
             mode="rate-pc"
          />
        </div>
      )}
    </div>
  );
}
