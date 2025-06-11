
import { getStorageItem, setStorageItem, removeStorageItem } from './localStorage';
import { setGlobalSubreddits, notifyGlobalListeners } from './globalSubredditState';

const STORAGE_KEY = 'selected-subreddits';
export const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

// Centralized localStorage operations with locking
let isLoading = false;
let isSaving = false;

export const loadSubredditsFromStorage = (): string[] => {
  console.log('🔍 loadSubredditsFromStorage called, isLoading:', isLoading);
  
  if (isLoading) {
    console.log('🔒 Already loading, returning defaults');
    return DEFAULT_SUBREDDITS;
  }
  
  isLoading = true;
  
  try {
    const stored = getStorageItem(STORAGE_KEY);
    console.log('🔍 Raw localStorage value:', stored);
    console.log('🔍 Storage key used:', STORAGE_KEY);
    
    if (stored === null || stored === '') {
      console.log('📭 No stored subreddits found, using defaults:', DEFAULT_SUBREDDITS);
      isLoading = false;
      return DEFAULT_SUBREDDITS;
    }

    const parsed = JSON.parse(stored);
    console.log('🔍 Parsed value:', parsed);
    
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.warn('⚠️ Invalid stored data, using defaults');
      isLoading = false;
      return DEFAULT_SUBREDDITS;
    }

    const validSubreddits = parsed.filter(item => typeof item === 'string' && item.trim() !== '');
    
    if (validSubreddits.length === 0) {
      console.warn('⚠️ No valid subreddits, using defaults');
      isLoading = false;
      return DEFAULT_SUBREDDITS;
    }

    console.log('✅ Successfully loaded subreddits from localStorage:', validSubreddits);
    isLoading = false;
    return validSubreddits;
  } catch (error) {
    console.error('❌ Error parsing stored subreddits:', error);
    
    try {
      removeStorageItem(STORAGE_KEY);
    } catch (clearError) {
      console.error('❌ Could not clear corrupted data:', clearError);
    }
    
    isLoading = false;
    return DEFAULT_SUBREDDITS;
  }
};

export const saveSubredditsToStorage = (subreddits: string[]): boolean => {
  console.log('💾 saveSubredditsToStorage called with:', subreddits, 'isSaving:', isSaving);
  
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
      setGlobalSubreddits(subreddits);
      
      // Notify all listeners
      notifyGlobalListeners(subreddits);
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
