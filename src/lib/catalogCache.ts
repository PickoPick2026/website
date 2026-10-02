import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface CatalogSnapshot {
  categories: Record<string, any>[];
  products: Record<string, any>[];
  savedAt: number;
}

const CACHE_KEY = `catalog-v1:${import.meta.env.VITE_SUPABASE_URL}`;
const FRESH_FOR = 5 * 60 * 1000;
let memory: CatalogSnapshot | null = null;
let reading: Promise<CatalogSnapshot | null> | null = null;
let refreshing: Promise<CatalogSnapshot> | null = null;
const listeners = new Set<(catalog: CatalogSnapshot) => void>();

// Cache only public catalogue data; cart, identity and request data stay separate.
function openCache(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('Storage unavailable'));
    const request = indexedDB.open('pickopick-catalog', 1);
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      reject(new Error('Storage timed out'));
    }, 2000);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('snapshots')) request.result.createObjectStore('snapshots');
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (settled) return request.result.close();
      settled = true;
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => { clearTimeout(timer); settled = true; reject(request.error); };
    request.onblocked = () => { clearTimeout(timer); settled = true; reject(new Error('Storage blocked')); };
  });
}

async function readCache(): Promise<CatalogSnapshot | null> {
  if (memory) return memory;
  if (reading) return reading;
  reading = (async () => {
    let db: IDBDatabase | undefined;
    try {
      db = await openCache();
      const snapshot = await new Promise<CatalogSnapshot | undefined>((resolve, reject) => {
        const request = db!.transaction('snapshots').objectStore('snapshots').get(CACHE_KEY);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      if (snapshot && Array.isArray(snapshot.categories) && Array.isArray(snapshot.products) && Number.isFinite(snapshot.savedAt)) {
        memory = snapshot;
      }
    } catch {
      // Private browsing, quota and storage errors must not block the directory.
    } finally { db?.close(); }
    return memory;
  })().finally(() => { reading = null; });
  return reading;
}

async function writeCache(snapshot: CatalogSnapshot) {
  let db: IDBDatabase | undefined;
  try {
    db = await openCache();
    await new Promise<void>((resolve, reject) => {
      const transaction = db!.transaction('snapshots', 'readwrite');
      transaction.objectStore('snapshots').put(snapshot, CACHE_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } catch {
    // Keep the in-memory cache even when persistent storage cannot be written.
  } finally { db?.close(); }
}

async function fetchAll(table: string, orderBy: string) {
  const rows: Record<string, any>[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.from(table).select('*').order(orderBy).range(offset, offset + pageSize - 1);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < pageSize) return rows;
  }
}

async function refreshCatalog() {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const [categories, products] = await Promise.all([fetchAll('category', 'categoryID'), fetchAll('productTable', 'productID')]);
    const snapshot = { categories, products, savedAt: Date.now() };
    memory = snapshot;
    listeners.forEach(listener => listener(snapshot));
    void writeCache(snapshot);
    return snapshot;
  })().finally(() => { refreshing = null; });
  return refreshing;
}

export function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogSnapshot | null>(memory);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const receive = (snapshot: CatalogSnapshot) => {
      if (active) { setCatalog(snapshot); setError(''); }
    };
    listeners.add(receive);
    const load = async () => {
      const cached = await readCache();
      if (!active) return;
      if (cached) receive(cached);
      if (cached && Date.now() - cached.savedAt < FRESH_FOR) return;
      try { receive(await refreshCatalog()); }
      catch { if (active && !memory) setError('Unable to load the catalogue. Please try again.'); }
    };
    void load();
    window.addEventListener('online', load);
    window.addEventListener('focus', load);
    return () => {
      active = false;
      listeners.delete(receive);
      window.removeEventListener('online', load);
      window.removeEventListener('focus', load);
    };
  }, []);
  return { categories: catalog?.categories || [], products: catalog?.products || [], loading: !catalog && !error, error };
}
