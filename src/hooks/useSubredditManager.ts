
import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];
const DEBOUNCE_DELAY = 500; // 500ms debounce

// Singleton state to prevent multiple instances from conflicting
let globalSubreddits: string[] | null = null;
let globalListeners: Array<(subreddits: string[]) => void> = [];

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

// Centralized localStorage operations with locking
let isLoading = false;
let isSaving = false;

const getStoredSubreddits = (): string[] => {
  console.log('🔍 getStoredSubreddits called, isLoading:', isLoading);
  
  if (isLoading) {
    console.log('🔒 Already loading, returning cached value');
    return globalSubreddits || DEFAULT_SUBREDDITS;
  }
  
  isLoading = true;
  
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, using defaults');
    isLoading = false;
    return DEFAULT_SUBREDDITS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 Raw localStorage value:', stored);
    console.log('🔍 Storage key used:', STORAGE_KEY);
    
    if (stored === null || stored === '') {
      console.log('📭 No stored subreddits found, using defaults:', DEFAULT_SUBREDDITS);
      globalSubreddits = DEFAULT_SUBREDDITS;
      isLoading = false;
      return DEFAULT_SUBREDDITS;
    }

    const parsed = JSON.parse(stored);
    console.log('🔍 Parsed value:', parsed);
    
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.warn('⚠️ Invalid stored data, using defaults');
      globalSubreddits = DEFAULT_SUBREDDITS;
      isLoading = false;
      return DEFAULT_SUBREDDITS;
    }

    const validSubreddits = parsed.filter(item => typeof item === 'string' && item.trim() !== '');
    
    if (validSubreddits.length === 0) {
      console.warn('⚠️ No valid subreddits, using defaults');
      globalSubreddits = DEFAULT_SUBREDDITS;
      isLoading = false;
      return DEFAULT_SUBREDDITS;
    }

    console.log('✅ Successfully loaded subreddits from localStorage:', validSubreddits);
    globalSubreddits = validSubreddits;
    isLoading = false;
    return validSubreddits;
  } catch (error) {
    console.error('❌ Error parsing stored subreddits:', error);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.error('❌ Could not clear corrupted data:', clearError);
    }
    
    globalSubreddits = DEFAULT_SUBREDDITS;
    isLoading = false;
    return DEFAULT_SUBREDDITS;
  }
};

const setStoredSubreddits = (subreddits: string[]): boolean => {
  console.log('💾 setStoredSubreddits called with:', subreddits, 'isSaving:', isSaving);
  
  if (isSaving) {
    console.log('🔒 Already saving, skipping...');
    return false;
  }
  
  isSaving = true;
  
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, cannot save subreddits');
    isSaving = false;
    return false;
  }

  try {
    const dataToStore = JSON.stringify(subreddits);
    console.log('💾 Attempting to save subreddits:', subreddits);
    console.log('💾 Serialized data:', dataToStore);
    
    localStorage.setItem(STORAGE_KEY, dataToStore);
    
    // Verify the save was successful
    const verification = localStorage.getItem(STORAGE_KEY);
    const success = verification === dataToStore;
    
    if (success) {
      console.log('✅ Successfully saved subreddits to localStorage');
      globalSubreddits = subreddits;
      
      // Notify all listeners
      globalListeners.forEach(listener => {
        try {
          listener(subreddits);
        } catch (e) {
          console.error('Error notifying listener:', e);
        }
      });
    } else {
      console.error('❌ Save verification failed');
    }
    
    isSaving = false;
    return success;
  } catch (error) {
    console.error('❌ Error saving subreddits to localStorage:', error);
    isSaving = false;
    return false;
  }
};

export const useSubredditManager = () => {
  console.log('🚀 useSubredditManager hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 Initializing subreddits state...');
    
    // Use global cache if available to prevent multiple reads
    if (globalSubreddits) {
      console.log('🏁 Using cached global subreddits:', globalSubreddits);
      return globalSubreddits;
    }
    
    const initial = getStoredSubreddits();
    console.log('🏁 Initial subreddits loaded:', initial);
    return initial;
  });

  // Debounced save function
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedSave = useCallback((newSubreddits: string[]) => {
    console.log('⏰ Scheduling debounced save for:', newSubreddits);
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      console.log('💾 Executing debounced save for:', newSubreddits);
      setStoredSubreddits(newSubreddits);
    }, DEBOUNCE_DELAY);
  }, []);

  // Listen for external changes
  useEffect(() => {
    const listener = (newSubreddits: string[]) => {
      console.log('🔄 External subreddit change detected:', newSubreddits);
      setSubreddits(newSubreddits);
    };
    
    globalListeners.push(listener);
    
    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Save when subreddits change (debounced)
  useEffect(() => {
    console.log('🔄 useEffect triggered - subreddits changed to:', subreddits);
    console.log('🔄 Current timestamp:', new Date().toISOString());
    
    // Update global cache immediately
    globalSubreddits = subreddits;
    
    // Schedule debounced save
    debouncedSave(subreddits);
    
  }, [subreddits, debouncedSave]);

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 updateSubreddits called with:', newSubreddits);
    console.log('🔄 Current subreddits before update:', subreddits);
    
    // Ensure we have valid subreddits
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 Filtered subreddits:', filtered);
    
    const finalSubreddits = filtered.length === 0 ? DEFAULT_SUBREDDITS : filtered;
    
    console.log('🔄 Setting new subreddits:', finalSubreddits);
    setSubreddits(finalSubreddits);
  }, [subreddits]);

  // Debug current state every render
  console.log('📊 useSubredditManager render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    globalSubreddits,
    timestamp: new Date().toISOString(),
    storageKey: STORAGE_KEY,
    defaults: DEFAULT_SUBREDDITS,
    isLoading,
    isSaving
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
