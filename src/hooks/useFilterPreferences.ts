
import { useState, useEffect } from 'react';

export interface FilterPreferences {
  minUpvotes: number;
  maxUpvotes: number | null;
  minComments: number;
  characterBlacklist: string[];
  keywordBlacklist: string[];
  minPostLength: number;
  maxPostLength: number | null;
  excludedFlairs: string[];
  excludedAuthors: string[];
  postsPerSubreddit: number;
  maxTotalPosts: number;
  redditLimit: number;
  enabled: boolean;
}

const DEFAULT_PREFERENCES: FilterPreferences = {
  minUpvotes: 1,
  maxUpvotes: null,
  minComments: 0,
  characterBlacklist: [],
  keywordBlacklist: ['removed', 'deleted'],
  minPostLength: 0,
  maxPostLength: null,
  excludedFlairs: [],
  excludedAuthors: [],
  postsPerSubreddit: 15,
  maxTotalPosts: 80,
  redditLimit: 25,
  enabled: true
};

const STORAGE_KEY = 'reddit-filter-preferences';

export const useFilterPreferences = () => {
  const [preferences, setPreferences] = useState<FilterPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('🔧 [FILTER] Loaded preferences from storage:', parsed);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.error('🔧 [FILTER] Error loading preferences:', error);
    }
    console.log('🔧 [FILTER] Using default preferences');
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      console.log('🔧 [FILTER] Saved preferences to storage:', preferences);
    } catch (error) {
      console.error('🔧 [FILTER] Error saving preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<FilterPreferences>) => {
    console.log('🔧 [FILTER] Updating preferences with:', updates);
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      console.log('🔧 [FILTER] New preferences state:', newPrefs);
      return newPrefs;
    });
  };

  const resetToDefaults = () => {
    console.log('🔧 [FILTER] Resetting to defaults');
    setPreferences(DEFAULT_PREFERENCES);
  };

  const toggleEnabled = () => {
    console.log('🔧 [FILTER] Toggling enabled state from:', preferences.enabled);
    setPreferences(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const addToBlacklist = (type: 'character' | 'keyword' | 'flair' | 'author', value: string) => {
    if (!value.trim()) return;
    
    console.log(`🔧 [FILTER] Adding to ${type} blacklist:`, value);
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
    console.log(`🔧 [FILTER] Removing from ${type} blacklist:`, value);
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
