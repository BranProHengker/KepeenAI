import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Message } from '../types';
import { saveMessages, loadMessages } from '../lib/indexedDB';
import ImagePanel from './ImagePanel';
import ChatPanel from './ChatPanel';

export default function RoastMode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const allImagesRef = useRef<string[]>([]);
  const pendingImagesRef = useRef<string[]>([]);

  // Load from DB on mount
  useEffect(() => {
    loadMessages('chat_messages_roast').then(saved => {
      if (saved && saved.length > 0) {
        setMessages(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  // Save to DB on change
  useEffect(() => {
    if (isLoaded) {
      saveMessages(messages, 'chat_messages_roast');
    }
  }, [messages, isLoaded]);

  const allImages = messages.flatMap(m => m.images || []).concat(pendingImages);
  
  // Keep refs in sync
  allImagesRef.current = allImages;
  pendingImagesRef.current = pendingImages;

  const processFiles = useCallback((files: File[]) => {
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
       setPendingImages(prev => [...prev, ...results].filter(x => x !== ""));
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
    onDrop: (acceptedFiles) => processFiles(acceptedFiles),
    noClick: true,
    noKeyboard: true,
  });

  const handleSend = async () => {
    if ((!input.trim() && pendingImages.length === 0) || loading) return;

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
        body: JSON.stringify({ contents, mode: 'roast' }),
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
           Drop Setup Here
         </h2>
         <p className="font-sans text-[18px] text-charcoal mt-2 pointer-events-none">Maksimal 2 foto ya ngab!</p>
      </div>

      {messages.length === 0 && pendingImages.length === 0 ? (
        <div 
          onClick={open}
          className="border border-taupe bg-beige p-12 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[400px] shadow-sm hover:bg-white"
        >
          <UploadCloud className="w-12 h-12 text-charcoal mb-4" />
          <h3 className="font-sans text-[20px] font-semibold text-deep-black mb-2 text-center">Drag and drop up to 2 workspace images</h3>
          <p className="font-sans text-[16px] text-charcoal mb-6 text-center">or click to browse files</p>
          <div className="bg-charcoal text-white px-4 py-2 font-mono text-[12px] tracking-wider text-center">CTRL + V ANYWHERE TO PASTE</div>
        </div>
      ) : (
        <div 
          className="border border-taupe bg-white p-4 md:p-[32px] flex flex-col lg:flex-row gap-[32px] min-h-[70vh] shadow-[0px_4px_24px_rgba(0,0,0,0.04)]"
        >
          <ImagePanel 
             images={allImages} 
             onDeleteImage={handleDeleteImage} 
             onAddImage={() => open()} 
             onReset={handleReset} 
             disabled={loading}
             mode="roast"
          />

          <ChatPanel 
             messages={messages} 
             pendingImagesCount={pendingImages.length} 
             input={input} 
             setInput={setInput} 
             onSend={handleSend} 
             loading={loading}
             mode="roast"
          />
        </div>
      )}
    </div>
  );
}
