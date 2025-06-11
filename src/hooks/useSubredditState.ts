
import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/localStorage';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

export const useSubredditState = () => {
  console.log('🚀 useSubredditState hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 [SUBREDDIT1] Initializing subreddits state...');
    
    // Check if localStorage is available first
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
    
    console.log('🏁 [SUBREDDIT1] localStorage available:', isLSAvailable);
    
    if (!isLSAvailable) {
      console.log('🏁 [SUBREDDIT1] localStorage not available, using defaults:', DEFAULT_SUBREDDITS);
      return DEFAULT_SUBREDDITS;
    }
    
    const stored = getStorageItem(STORAGE_KEY);
    console.log('🏁 [SUBREDDIT1] Raw stored value:', stored);
    console.log('🏁 [SUBREDDIT1] Type of stored value:', typeof stored);
    console.log('🏁 [SUBREDDIT1] Stored === null:', stored === null);
    console.log('🏁 [SUBREDDIT1] Stored === undefined:', stored === undefined);
    console.log('🏁 [SUBREDDIT1] Stored === "":', stored === '');
    
    // If nothing is stored at all, use defaults
    if (stored === null) {
      console.log('🏁 [SUBREDDIT1] No stored data found (null), using default subreddits:', DEFAULT_SUBREDDITS);
      return DEFAULT_SUBREDDITS;
    }
    
    // If something is stored, parse it (even if it's an empty array)
    try {
      console.log('🏁 [SUBREDDIT1] Attempting to parse stored value...');
      const parsed = JSON.parse(stored);
      console.log('🏁 [SUBREDDIT1] Parsed value:', parsed);
      console.log('🏁 [SUBREDDIT1] Is parsed an array:', Array.isArray(parsed));
      console.log('🏁 [SUBREDDIT1] Parsed length:', parsed?.length);
      
      if (Array.isArray(parsed)) {
        console.log('🏁 [SUBREDDIT1] SUCCESSFULLY loaded subreddits from storage:', parsed);
        console.log('🏁 [SUBREDDIT1] This includes empty arrays - length:', parsed.length);
        return parsed;
      } else {
        console.log('🏁 [SUBREDDIT1] Parsed value is not an array, falling back to defaults');
        return DEFAULT_SUBREDDITS;
      }
    } catch (error) {
      console.error('🏁 [SUBREDDIT1] Error parsing stored subreddits:', error);
      console.log('🏁 [SUBREDDIT1] Parsing failed, using default subreddits:', DEFAULT_SUBREDDITS);
      return DEFAULT_SUBREDDITS;
    }
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 [SUBREDDIT1] updateSubreddits called with:', newSubreddits);
    console.log('🔄 [SUBREDDIT1] Current subreddits before update:', subreddits);
    console.log('🔄 [SUBREDDIT1] Type of newSubreddits:', typeof newSubreddits);
    console.log('🔄 [SUBREDDIT1] Is newSubreddits an array:', Array.isArray(newSubreddits));
    console.log('🔄 [SUBREDDIT1] newSubreddits length:', newSubreddits.length);
    
    // Clean the input but don't enforce minimums
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 [SUBREDDIT1] Filtered subreddits (after cleaning):', filtered);
    console.log('🔄 [SUBREDDIT1] Filtered length:', filtered.length);
    console.log('🔄 [SUBREDDIT1] Will save empty array if filtered is empty:', filtered.length === 0);
    
    // Use the filtered array as-is, even if empty
    console.log('🔄 [SUBREDDIT1] Setting new subreddits state to:', filtered);
    setSubreddits(filtered);
    
    // Save immediately, even if empty
    const stringToSave = JSON.stringify(filtered);
    console.log('💾 [SUBREDDIT1] About to save to localStorage with key:', STORAGE_KEY);
    console.log('💾 [SUBREDDIT1] String being saved:', stringToSave);
    console.log('💾 [SUBREDDIT1] String length:', stringToSave.length);
    
    const saveResult = setStorageItem(STORAGE_KEY, stringToSave);
    console.log('💾 [SUBREDDIT1] Save result:', saveResult);
    
    // Verify the save worked
    const verification = getStorageItem(STORAGE_KEY);
    console.log('💾 [SUBREDDIT1] Verification read back:', verification);
    console.log('💾 [SUBREDDIT1] Save was successful:', verification === stringToSave);
    
    if (verification !== stringToSave) {
      console.error('💾 [SUBREDDIT1] SAVE FAILED! Expected:', stringToSave, 'Got:', verification);
    } else {
      console.log('💾 [SUBREDDIT1] ✅ Save confirmed successful');
    }
  }, [subreddits]);

  // Debug current state every render
  console.log('📊 [SUBREDDIT1] useSubredditState render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    timestamp: new Date().toISOString(),
    storageKey: STORAGE_KEY
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
