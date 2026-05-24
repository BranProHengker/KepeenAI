import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Message } from '../types';
import { saveMessages, loadMessages } from '../lib/indexedDB';
import ImagePanel from './ImagePanel';
import ChatPanel from './ChatPanel';
import DeskPlanner from './DeskPlanner';

export default function CompareMode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const allImagesRef = useRef<string[]>([]);
  const pendingImagesRef = useRef<string[]>([]);
  const activeSlotRef = useRef<number | null>(null);

  // Load from DB on mount
  useEffect(() => {
    loadMessages('chat_messages_compare').then(saved => {
      if (saved && saved.length > 0) {
        setMessages(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  // Save to DB on change
  useEffect(() => {
    if (isLoaded) {
      saveMessages(messages, 'chat_messages_compare');
    }
  }, [messages, isLoaded]);

  const allImages = messages.flatMap(m => m.images || []).concat(pendingImages);
  
  // Keep refs in sync
  allImagesRef.current = allImages;
  pendingImagesRef.current = pendingImages;

  const processFiles = useCallback((files: File[], event?: any) => {
    let targetSlot = activeSlotRef.current;
    if (event && event.type === 'drop') {
      const target = event.target as HTMLElement;
      const slotElement = target.closest('[data-slot]');
      if (slotElement) {
        targetSlot = parseInt(slotElement.getAttribute('data-slot') || '-1', 10);
      }
    }
    activeSlotRef.current = null;
    
    const imageFiles = files.filter(f => {
      const isImageMime = f.type.startsWith('image/');
      const isImageExt = /\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(f.name);
      return isImageMime || isImageExt;
    });
    
    if (imageFiles.length === 0) return;

    const currentTotal = allImagesRef.current.filter(img => img !== "").length;
    if (currentTotal + imageFiles.length > 2) {
      alert("Maksimal total 2 foto aja ngab!");
      return;
    }

    const maxToAdd = 2 - currentTotal;
    const filesToProcess = imageFiles.slice(0, maxToAdd);

    Promise.all(filesToProcess.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result as string);
      });
    })).then(results => {
       setPendingImages(prev => {
         if (results.length === 1 && targetSlot !== null && targetSlot >= 0 && targetSlot <= 1) {
            const newArr = [...prev];
            if (newArr.length === 0) {
               if (targetSlot === 0) return [results[0]];
               else return ["", results[0]];
            } else if (newArr.length === 1) {
               if (targetSlot === 0) { newArr[0] = results[0]; return newArr; }
               else { newArr.push(results[0]); return newArr; }
            } else if (newArr.length === 2) {
               newArr[targetSlot] = results[0];
               return newArr;
            }
         }
         const newArr = [...prev];
         results.forEach(res => {
            if (newArr.length === 0) newArr.push(res);
            else if (newArr.length === 1) {
               if (newArr[0] === "") newArr[0] = res;
               else newArr.push(res);
            } else if (newArr.length === 2) {
               if (newArr[0] === "") newArr[0] = res;
               else if (newArr[1] === "") newArr[1] = res;
            }
         });
         if (newArr.length === 2 && newArr[1] === "") newArr.pop();
         if (newArr.length === 1 && newArr[0] === "") newArr.pop();
         return newArr;
       });
    });
  }, []);

  const handleDeleteImage = (imgToRemove: string) => {
    setPendingImages(prev => prev.filter(img => img !== imgToRemove));
    setMessages(prev => prev.map(msg => ({
      ...msg,
      images: msg.images?.filter(img => img !== imgToRemove)
    })));
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) imageFiles.push(blob);
        }
      }
      if (imageFiles.length > 0) {
        processFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles, rejections, event) => processFiles(acceptedFiles, event),
    noClick: true,
    noKeyboard: true,
  });

  const handleSend = async () => {
    if ((!input.trim() && pendingImages.length === 0) || loading) return;

    if (messages.length === 0 || pendingImages.length > 0) {
      if (pendingImages.length !== 2 || pendingImages.includes("")) {
        alert("Mode Compare wajib upload 2 foto (Before dan After) ya ngab!");
        return;
      }
    }

    const newMessage: Message = {
      role: 'user',
      text: input.trim(),
      images: pendingImages.length > 0 ? pendingImages.filter(img => img !== "") : undefined
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setPendingImages([]);
    setLoading(true);

    try {
      const contents = updatedMessages.map(msg => {
        const parts: any[] = [];
        if (msg.images) {
          msg.images.forEach(img => {
            const base64Data = img.split(',')[1];
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            });
          });
        }
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        return {
          role: msg.role === 'model' ? 'model' : 'user',
          parts
        };
      });

      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, mode: 'compare' }),
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

  const handleDeskPlannerSubmit = async (deskSize: string, items: string, theme: string) => {
    if (loading) return;

    const userText = `[DESK PLANNER AI]\nDesk Size: ${deskSize.trim()}\nItems: ${items.trim()}\nTheme: ${theme.trim()}`;
    const newMessage: Message = {
      role: 'user',
      text: userText,
      images: allImages.length > 0 ? [allImages[allImages.length - 1]] : undefined
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const contents = updatedMessages.map(msg => {
        const parts: any[] = [];
        if (msg.images) {
          msg.images.forEach(img => {
            const base64Data = img.split(',')[1];
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            });
          });
        }
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        return {
          role: msg.role === 'model' ? 'model' : 'user',
          parts
        };
      });

      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, mode: 'compare' }),
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
    setPendingImages([]);
    setInput('');
  };

  return (
    <div {...getRootProps()} className="flex flex-col space-y-4 md:space-y-8 min-h-[80vh] relative">
      <input {...getInputProps()} />

      <div 
        className={`fixed inset-0 z-[999] bg-beige/95 border-8 border-dashed border-deep-black m-4 md:m-8 flex flex-col items-center justify-center transition-opacity duration-200 pointer-events-none
          ${isDragActive ? 'opacity-100' : 'opacity-0'}
        `}
      >
         <UploadCloud className="w-24 h-24 text-deep-black mb-6 animate-bounce pointer-events-none" />
         <h2 className="font-mono text-[32px] md:text-[48px] font-bold text-deep-black uppercase tracking-wider text-center pointer-events-none">
           Drop Before & After
         </h2>
         <p className="font-sans text-[18px] text-charcoal mt-2 pointer-events-none">Maksimal 2 foto ya ngab!</p>
      </div>

      {messages.length === 0 && pendingImages.length === 0 ? (
        <div className="flex flex-col md:flex-row gap-4 min-h-[400px]">
           <div 
             onClick={(e) => { e.stopPropagation(); activeSlotRef.current = 0; open(); }}
             data-slot="0"
             className="flex-1 border-2 border-dashed border-taupe bg-beige p-8 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center shadow-sm hover:bg-white group relative"
           >
              <div className="bg-deep-black text-white px-3 py-1 font-mono text-[12px] uppercase mb-4 shadow-sm group-hover:-translate-y-1 transition-transform">📷 BEFORE</div>
              <UploadCloud className="w-10 h-10 text-charcoal mb-4" />
              <h3 className="font-sans text-[18px] font-semibold text-deep-black mb-2 text-center">Drop BEFORE photo</h3>
              <p className="font-sans text-[14px] text-charcoal text-center">or click to browse</p>
           </div>
           <div 
             onClick={(e) => { e.stopPropagation(); activeSlotRef.current = 1; open(); }}
             data-slot="1"
             className="flex-1 border-2 border-dashed border-taupe bg-beige p-8 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center shadow-sm hover:bg-white group relative"
           >
              <div className="bg-deep-black text-white px-3 py-1 font-mono text-[12px] uppercase mb-4 shadow-sm group-hover:-translate-y-1 transition-transform">📸 AFTER</div>
              <UploadCloud className="w-10 h-10 text-charcoal mb-4" />
              <h3 className="font-sans text-[18px] font-semibold text-deep-black mb-2 text-center">Drop AFTER photo</h3>
              <p className="font-sans text-[14px] text-charcoal text-center">or click to browse</p>
           </div>
        </div>
      ) : (
        <div 
          className="border border-taupe bg-white p-4 md:p-[32px] flex flex-col gap-[32px] min-h-[70vh] shadow-[0px_4px_24px_rgba(0,0,0,0.04)]"
        >
          <ImagePanel 
             images={allImages} 
             onDeleteImage={handleDeleteImage} 
             onAddImage={(slot) => {
                 if (slot !== undefined) activeSlotRef.current = slot;
                 open();
             }} 
             onReset={handleReset} 
             disabled={loading}
             mode="compare"
          >
            <DeskPlanner 
               loading={loading}
               onSubmit={handleDeskPlannerSubmit}
            />
          </ImagePanel>

          <ChatPanel 
             messages={messages} 
             pendingImagesCount={pendingImages.length} 
             input={input} 
             setInput={setInput} 
             onSend={handleSend} 
             loading={loading}
             mode="compare"
          />
        </div>
      )}
    </div>
  );
}
