
import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/localStorage';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

export const useSubredditState = () => {
  console.log('🚀 useSubredditState hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 Initializing subreddits state...');
    const stored = getStorageItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('🏁 Initial subreddits loaded:', parsed);
          return parsed;
        }
      } catch (error) {
        console.error('Error parsing stored subreddits:', error);
      }
    }
    console.log('🏁 Using default subreddits:', DEFAULT_SUBREDDITS);
    return DEFAULT_SUBREDDITS;
  });

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
    
    // Save immediately
    console.log('💾 Saving subreddits immediately:', finalSubreddits);
    setStorageItem(STORAGE_KEY, JSON.stringify(finalSubreddits));
  }, [subreddits]);

  // Debug current state every render
  console.log('📊 useSubredditState render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    timestamp: new Date().toISOString()
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
