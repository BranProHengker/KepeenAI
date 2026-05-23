import type { Message } from '../types';

export const saveMessages = async (messages: Message[], key: string = 'chat_messages') => {
  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kepeenAI', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('store');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = db.transaction('store', 'readwrite');
    tx.objectStore('store').put(messages, key);
  } catch (e) {
    console.error("Failed to save to DB", e);
  }
};

export const loadMessages = async (key: string = 'chat_messages'): Promise<Message[] | null> => {
  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kepeenAI', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('store');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return await new Promise((resolve) => {
      if (!db.objectStoreNames.contains('store')) return resolve(null);
      const tx = db.transaction('store', 'readonly');
      const req = tx.objectStore('store').get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error("Failed to load from DB", e);
    return null;
  }
};
