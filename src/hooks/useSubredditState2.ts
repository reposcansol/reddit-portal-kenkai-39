
import { useState, useCallback } from 'react';
import { 
  getStorageItem, 
  setStorageItem 
} from '@/utils/localStorage';

const STORAGE_KEY_2 = 'selected-subreddits-2';

export const useSubredditState2 = () => {
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
      return [];
    }
    
    const stored = getStorageItem(STORAGE_KEY_2);
    
    if (stored === null) {
      return [];
    }
    
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '');
    
    setSubreddits(filtered);
    
    const stringToSave = JSON.stringify(filtered);
    setStorageItem(STORAGE_KEY_2, stringToSave);
  }, []);

  return {
    subreddits,
    updateSubreddits,
  };
};
