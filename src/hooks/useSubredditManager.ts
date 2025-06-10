
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

// Test localStorage availability
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    console.log('✅ localStorage is available');
    return true;
  } catch (e) {
    console.error('❌ localStorage is not available:', e);
    return false;
  }
};

// Enhanced localStorage getter with debugging
const getStoredSubreddits = (): string[] => {
  console.log('🔍 getStoredSubreddits called');
  
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, using defaults');
    return DEFAULT_SUBREDDITS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 Raw localStorage value:', stored);
    console.log('🔍 Storage key used:', STORAGE_KEY);
    console.log('🔍 All localStorage keys:', Object.keys(localStorage));
    
    if (stored === null) {
      console.log('📭 No stored subreddits found, using defaults:', DEFAULT_SUBREDDITS);
      return DEFAULT_SUBREDDITS;
    }

    if (stored === '') {
      console.log('📭 Empty stored subreddits, using defaults');
      return DEFAULT_SUBREDDITS;
    }

    const parsed = JSON.parse(stored);
    console.log('🔍 Parsed value:', parsed);
    console.log('🔍 Parsed type:', typeof parsed);
    console.log('🔍 Is array:', Array.isArray(parsed));
    
    if (!Array.isArray(parsed)) {
      console.warn('⚠️ Stored value is not an array, using defaults. Got:', typeof parsed);
      return DEFAULT_SUBREDDITS;
    }

    if (parsed.length === 0) {
      console.log('📭 Stored array is empty, using defaults');
      return DEFAULT_SUBREDDITS;
    }

    // Validate array contains only strings
    const validSubreddits = parsed.filter(item => typeof item === 'string' && item.trim() !== '');
    
    if (validSubreddits.length === 0) {
      console.warn('⚠️ No valid subreddits in stored data, using defaults');
      return DEFAULT_SUBREDDITS;
    }

    console.log('✅ Successfully loaded subreddits from localStorage:', validSubreddits);
    return validSubreddits;
  } catch (error) {
    console.error('❌ Error parsing stored subreddits:', error);
    console.log('🔄 Clearing corrupted data and using defaults');
    
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.error('❌ Could not clear corrupted data:', clearError);
    }
    
    return DEFAULT_SUBREDDITS;
  }
};

// Enhanced localStorage setter with debugging
const setStoredSubreddits = (subreddits: string[]): boolean => {
  console.log('💾 setStoredSubreddits called with:', subreddits);
  
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, cannot save subreddits');
    return false;
  }

  try {
    const dataToStore = JSON.stringify(subreddits);
    console.log('💾 Attempting to save subreddits:', subreddits);
    console.log('💾 Serialized data:', dataToStore);
    console.log('💾 Data length:', dataToStore.length);
    
    localStorage.setItem(STORAGE_KEY, dataToStore);
    
    // Verify the save was successful
    const verification = localStorage.getItem(STORAGE_KEY);
    const success = verification === dataToStore;
    
    if (success) {
      console.log('✅ Successfully saved subreddits to localStorage');
      console.log('✅ Verification passed');
    } else {
      console.error('❌ Save verification failed');
      console.log('Expected:', dataToStore);
      console.log('Got:', verification);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error saving subreddits to localStorage:', error);
    
    // Check if quota exceeded
    if (error instanceof DOMException && error.code === 22) {
      console.error('💾 localStorage quota exceeded');
    }
    
    return false;
  }
};

export const useSubredditManager = () => {
  console.log('🚀 useSubredditManager hook initializing at', new Date().toISOString());
  
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 Initializing subreddits state...');
    const initial = getStoredSubreddits();
    console.log('🏁 Initial subreddits loaded:', initial);
    return initial;
  });

  // Save to localStorage whenever subreddits change
  useEffect(() => {
    console.log('🔄 useEffect triggered - subreddits changed to:', subreddits);
    console.log('🔄 Current timestamp:', new Date().toISOString());
    console.log('🔄 Subreddits array length:', subreddits.length);
    console.log('🔄 Subreddits stringified:', JSON.stringify(subreddits));
    
    const saveResult = setStoredSubreddits(subreddits);
    
    if (!saveResult) {
      console.warn('⚠️ Failed to save subreddits to localStorage');
    }
    
    // Log current localStorage state after save attempt
    console.log('🔍 Post-save localStorage check:');
    try {
      const currentStored = localStorage.getItem(STORAGE_KEY);
      console.log('🔍 Currently stored value:', currentStored);
      console.log('🔍 Currently stored parsed:', currentStored ? JSON.parse(currentStored) : null);
    } catch (e) {
      console.error('🔍 Could not read current stored value:', e);
    }
  }, [subreddits]);

  const updateSubreddits = (newSubreddits: string[]) => {
    console.log('🔄 updateSubreddits called with:', newSubreddits);
    console.log('🔄 Current subreddits before update:', subreddits);
    
    // Ensure we have at least 1 subreddit and max 4
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 Filtered subreddits:', filtered);
    
    if (filtered.length === 0) {
      console.log('🔄 No valid subreddits, reverting to defaults');
      setSubreddits(DEFAULT_SUBREDDITS);
    } else {
      console.log('🔄 Setting new subreddits:', filtered);
      setSubreddits(filtered);
    }
  };

  // Debug current state every render
  console.log('📊 useSubredditManager render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    timestamp: new Date().toISOString(),
    storageKey: STORAGE_KEY,
    defaults: DEFAULT_SUBREDDITS
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
