'use client';

import { useSyncExternalStore } from 'react';

const key = 'olato_card_preference';
let fallback = '';
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener('olato-card-change', listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener('olato-card-change', listener);
  };
}
function getSnapshot() {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}
function getServerSnapshot() { return ''; }

export function useCardPreference() {
  const cardPreference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setCardPreference = (card: string) => {
    fallback = card;
    try { localStorage.setItem(key, card); } catch { /* Preference still works for this session. */ }
    window.dispatchEvent(new Event('olato-card-change'));
  };
  return { cardPreference, setCardPreference };
}
