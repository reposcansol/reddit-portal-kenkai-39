
import { useState, useEffect } from 'react';

export interface FilterPreferences {
  minUpvotes: number;
  maxUpvotes: number | null;
  minComments: number;
  characterBlacklist: string[];
  keywordBlacklist: string[];
  timeRange: number; // hours
  minPostLength: number;
  maxPostLength: number | null;
  excludedFlairs: string[];
  excludedAuthors: string[];
  enabled: boolean;
}

const DEFAULT_PREFERENCES: FilterPreferences = {
  minUpvotes: 1,
  maxUpvotes: null,
  minComments: 0,
  characterBlacklist: ['?'],
  keywordBlacklist: ['removed', 'deleted'],
  timeRange: 24, // 24 hours
  minPostLength: 0,
  maxPostLength: null,
  excludedFlairs: [],
  excludedAuthors: [],
  enabled: true
};

const STORAGE_KEY = 'reddit-filter-preferences';

export const useFilterPreferences = () => {
  const [preferences, setPreferences] = useState<FilterPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.error('Error loading filter preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving filter preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<FilterPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const toggleEnabled = () => {
    setPreferences(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const addToBlacklist = (type: 'character' | 'keyword' | 'flair' | 'author', value: string) => {
    if (!value.trim()) return;
    
    setPreferences(prev => {
      switch (type) {
        case 'character':
          return { ...prev, characterBlacklist: [...new Set([...prev.characterBlacklist, value.trim()])] };
        case 'keyword':
          return { ...prev, keywordBlacklist: [...new Set([...prev.keywordBlacklist, value.trim().toLowerCase()])] };
        case 'flair':
          return { ...prev, excludedFlairs: [...new Set([...prev.excludedFlairs, value.trim()])] };
        case 'author':
          return { ...prev, excludedAuthors: [...new Set([...prev.excludedAuthors, value.trim()])] };
        default:
          return prev;
      }
    });
  };

  const removeFromBlacklist = (type: 'character' | 'keyword' | 'flair' | 'author', value: string) => {
    setPreferences(prev => {
      switch (type) {
        case 'character':
          return { ...prev, characterBlacklist: prev.characterBlacklist.filter(item => item !== value) };
        case 'keyword':
          return { ...prev, keywordBlacklist: prev.keywordBlacklist.filter(item => item !== value) };
        case 'flair':
          return { ...prev, excludedFlairs: prev.excludedFlairs.filter(item => item !== value) };
        case 'author':
          return { ...prev, excludedAuthors: prev.excludedAuthors.filter(item => item !== value) };
        default:
          return prev;
      }
    });
  };

  return {
    preferences,
    updatePreferences,
    resetToDefaults,
    toggleEnabled,
    addToBlacklist,
    removeFromBlacklist
  };
};
