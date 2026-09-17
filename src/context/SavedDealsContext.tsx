'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedDealsContextType {
  savedIds: string[];
  isSaved: (discountId: string) => boolean;
  toggleSave: (discountId: string) => void;
  savedCount: number;
}

const SAVED_STORAGE_KEY = 'olato_saved_deals_v1';

const SavedDealsContext = createContext<SavedDealsContextType | undefined>(undefined);

export function SavedDealsProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(['disc-1', 'disc-3']); // default pre-saved for demo

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (ids: string[]) => {
    setSavedIds(ids);
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  };

  const isSaved = (discountId: string) => savedIds.includes(discountId);

  const toggleSave = (discountId: string) => {
    if (isSaved(discountId)) {
      persist(savedIds.filter((id) => id !== discountId));
    } else {
      persist([...savedIds, discountId]);
    }
  };

  return (
    <SavedDealsContext.Provider
      value={{
        savedIds,
        isSaved,
        toggleSave,
        savedCount: savedIds.length,
      }}
    >
      {children}
    </SavedDealsContext.Provider>
  );
}

export function useSavedDeals() {
  const context = useContext(SavedDealsContext);
  if (!context) {
    throw new Error('useSavedDeals must be used within a SavedDealsProvider');
  }
  return context;
}
