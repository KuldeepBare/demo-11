import { mergeConfig } from '../data/defaultConfig';
import type { BirthdayConfig } from '../types/birthday';

const DB_NAME = 'TinyBirthdayWorldDB';
const DB_VERSION = 1;
const STORE_NAME = 'storyConfig';
const CONFIG_KEY = 'current';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

export function isExportedRecipientMode(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__BIRTHDAY_HIDE_EDITOR__ === true) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'recipient';
  } catch {
    return false;
  }
}

export async function loadSavedConfig(): Promise<{
  config: BirthdayConfig;
  isExported: boolean;
}> {
  // 1. Check inline baked config from a static export
  if (typeof window !== 'undefined' && window.__BIRTHDAY_EXPORTED_CONFIG__) {
    return {
      config: mergeConfig(window.__BIRTHDAY_EXPORTED_CONFIG__),
      isExported: window.__BIRTHDAY_HIDE_EDITOR__ === true,
    };
  }

  // 2. Check /birthday-config.json (used in source-exported Vercel projects)
  try {
    const res = await fetch('./birthday-config.json', { cache: 'no-store' });
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = (await res.json()) as Partial<BirthdayConfig> & { hideEditor?: boolean };
        return {
          config: mergeConfig(json),
          isExported: Boolean(json.hideEditor),
        };
      }
    }
  } catch {
    // Not a pre-exported deployment; continue to local editor storage
  }

  // 3. Load persisted editor draft from IndexedDB
  try {
    const db = await openDB();
    const saved = await new Promise<Partial<BirthdayConfig> | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(CONFIG_KEY);
      req.onsuccess = () => resolve(req.result as Partial<BirthdayConfig> | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (saved) {
      return {
        config: mergeConfig(saved),
        isExported: isExportedRecipientMode(),
      };
    }
  } catch {
    // Fallback quietly to defaults
  }

  return {
    config: mergeConfig(null),
    isExported: isExportedRecipientMode(),
  };
}

export async function saveConfig(config: BirthdayConfig): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(config, CONFIG_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  db.close();
}

export async function clearSavedConfig(): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(CONFIG_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  db.close();
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read file'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('File read error'));
    reader.readAsDataURL(file);
  });
}
