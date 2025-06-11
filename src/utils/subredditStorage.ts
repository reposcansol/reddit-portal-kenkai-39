
import { getStorageItem, setStorageItem, removeStorageItem } from './localStorage';

const STORAGE_KEY = 'selected-subreddits';
export const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

// Singleton state to prevent multiple instances from conflicting
let globalSubreddits: string[] | null = null;
let globalListeners: Array<(subreddits: string[]) => void> = [];

// Centralized localStorage operations with locking
let isLoading = false;
let isSaving = false;

export const getStoredSubreddits = (): string[] => {
  console.log('🔍 getStoredSubreddits called, isLoading:', isLoading);
  
  if (isLoading) {
    console.log('🔒 Already loading, returning cached value');
    return globalSubreddits || DEFAULT_SUBREDDITS;
  }
  
  isLoading = true;
  
  try {
    const stored = getStorageItem(STORAGE_KEY);
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
      removeStorageItem(STORAGE_KEY);
    } catch (clearError) {
      console.error('❌ Could not clear corrupted data:', clearError);
    }
    
    globalSubreddits = DEFAULT_SUBREDDITS;
    isLoading = false;
    return DEFAULT_SUBREDDITS;
  }
};

export const setStoredSubreddits = (subreddits: string[]): boolean => {
  console.log('💾 setStoredSubreddits called with:', subreddits, 'isSaving:', isSaving);
  
  if (isSaving) {
    console.log('🔒 Already saving, skipping...');
    return false;
  }
  
  isSaving = true;
  
  try {
    const dataToStore = JSON.stringify(subreddits);
    console.log('💾 Attempting to save subreddits:', subreddits);
    console.log('💾 Serialized data:', dataToStore);
    
    const success = setStorageItem(STORAGE_KEY, dataToStore);
    
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

// Global listener management
export const addGlobalListener = (listener: (subreddits: string[]) => void): void => {
  globalListeners.push(listener);
};

export const removeGlobalListener = (listener: (subreddits: string[]) => void): void => {
  globalListeners = globalListeners.filter(l => l !== listener);
};

export const getGlobalSubreddits = (): string[] | null => {
  return globalSubreddits;
};

export const setGlobalSubreddits = (subreddits: string[]): void => {
  globalSubreddits = subreddits;
};
