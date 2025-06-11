
import { useState, useCallback } from 'react';
import { 
  getStorageItem, 
  setStorageItem 
} from '@/utils/localStorage';

const STORAGE_KEY_2 = 'selected-subreddits-2';
const DEFAULT_SUBREDDITS_2 = ['programming', 'MachineLearning', 'artificial', 'singularity'];

export const useSubredditState2 = () => {
  console.log('🚀 useSubredditState2 hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 [SUBREDDIT2] Initializing subreddits state 2...');
    
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
    
    console.log('🏁 [SUBREDDIT2] localStorage available:', isLSAvailable);
    
    if (!isLSAvailable) {
      console.log('🏁 [SUBREDDIT2] localStorage not available, using defaults:', DEFAULT_SUBREDDITS_2);
      return DEFAULT_SUBREDDITS_2;
    }
    
    const stored = getStorageItem(STORAGE_KEY_2);
    console.log('🏁 [SUBREDDIT2] Raw stored value:', stored);
    console.log('🏁 [SUBREDDIT2] Type of stored value:', typeof stored);
    console.log('🏁 [SUBREDDIT2] Stored === null:', stored === null);
    console.log('🏁 [SUBREDDIT2] Stored === undefined:', stored === undefined);
    console.log('🏁 [SUBREDDIT2] Stored === "":', stored === '');
    
    // If nothing is stored at all, use defaults
    if (stored === null) {
      console.log('🏁 [SUBREDDIT2] No stored data found (null), using default subreddits 2:', DEFAULT_SUBREDDITS_2);
      return DEFAULT_SUBREDDITS_2;
    }
    
    // If something is stored, parse it (even if it's an empty array)
    try {
      console.log('🏁 [SUBREDDIT2] Attempting to parse stored value...');
      const parsed = JSON.parse(stored);
      console.log('🏁 [SUBREDDIT2] Parsed value:', parsed);
      console.log('🏁 [SUBREDDIT2] Is parsed an array:', Array.isArray(parsed));
      console.log('🏁 [SUBREDDIT2] Parsed length:', parsed?.length);
      
      if (Array.isArray(parsed)) {
        console.log('🏁 [SUBREDDIT2] SUCCESSFULLY loaded subreddits from storage:', parsed);
        console.log('🏁 [SUBREDDIT2] This includes empty arrays - length:', parsed.length);
        return parsed;
      } else {
        console.log('🏁 [SUBREDDIT2] Parsed value is not an array, falling back to defaults');
        return DEFAULT_SUBREDDITS_2;
      }
    } catch (error) {
      console.error('🏁 [SUBREDDIT2] Error parsing stored subreddits 2:', error);
      console.log('🏁 [SUBREDDIT2] Parsing failed, using default subreddits 2:', DEFAULT_SUBREDDITS_2);
      return DEFAULT_SUBREDDITS_2;
    }
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 [SUBREDDIT2] updateSubreddits2 called with:', newSubreddits);
    console.log('🔄 [SUBREDDIT2] Current subreddits 2 before update:', subreddits);
    console.log('🔄 [SUBREDDIT2] Type of newSubreddits:', typeof newSubreddits);
    console.log('🔄 [SUBREDDIT2] Is newSubreddits an array:', Array.isArray(newSubreddits));
    console.log('🔄 [SUBREDDIT2] newSubreddits length:', newSubreddits.length);
    
    // Clean the input but don't enforce minimums
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 [SUBREDDIT2] Filtered subreddits 2 (after cleaning):', filtered);
    console.log('🔄 [SUBREDDIT2] Filtered length:', filtered.length);
    console.log('🔄 [SUBREDDIT2] Will save empty array if filtered is empty:', filtered.length === 0);
    
    // Use the filtered array as-is, even if empty
    console.log('🔄 [SUBREDDIT2] Setting new subreddits 2 state to:', filtered);
    setSubreddits(filtered);
    
    // Save immediately, even if empty
    const stringToSave = JSON.stringify(filtered);
    console.log('💾 [SUBREDDIT2] About to save to localStorage with key:', STORAGE_KEY_2);
    console.log('💾 [SUBREDDIT2] String being saved:', stringToSave);
    console.log('💾 [SUBREDDIT2] String length:', stringToSave.length);
    
    const saveResult = setStorageItem(STORAGE_KEY_2, stringToSave);
    console.log('💾 [SUBREDDIT2] Save result:', saveResult);
    
    // Verify the save worked
    const verification = getStorageItem(STORAGE_KEY_2);
    console.log('💾 [SUBREDDIT2] Verification read back:', verification);
    console.log('💾 [SUBREDDIT2] Save was successful:', verification === stringToSave);
    
    if (verification !== stringToSave) {
      console.error('💾 [SUBREDDIT2] SAVE FAILED! Expected:', stringToSave, 'Got:', verification);
    } else {
      console.log('💾 [SUBREDDIT2] ✅ Save confirmed successful');
    }
  }, [subreddits]);

  // Debug current state every render
  console.log('📊 [SUBREDDIT2] useSubredditState2 render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    timestamp: new Date().toISOString(),
    storageKey: STORAGE_KEY_2
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
