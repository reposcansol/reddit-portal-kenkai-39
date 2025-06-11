
import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/localStorage';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['technology', 'programming', 'webdev', 'reactjs'];

export const useSubredditState = () => {
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    const isLSAvailable = (() => {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })();
    
    if (!isLSAvailable) {
      return DEFAULT_SUBREDDITS;
    }
    
    const stored = getStorageItem(STORAGE_KEY);
    
    if (stored === null) {
      return DEFAULT_SUBREDDITS;
    }
    
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        return DEFAULT_SUBREDDITS;
      }
    } catch (error) {
      return DEFAULT_SUBREDDITS;
    }
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    setSubreddits(filtered);
    
    const stringToSave = JSON.stringify(filtered);
    setStorageItem(STORAGE_KEY, stringToSave);
  }, []);

  return {
    subreddits,
    updateSubreddits,
  };
};
