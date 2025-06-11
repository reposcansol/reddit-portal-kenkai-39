
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
    
    // If nothing is stored at all, use defaults
    if (stored === null) {
      console.log('🏁 No stored data found, using default subreddits:', DEFAULT_SUBREDDITS);
      return DEFAULT_SUBREDDITS;
    }
    
    // If something is stored, parse it (even if it's an empty array)
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        console.log('🏁 Initial subreddits loaded (including empty arrays):', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing stored subreddits:', error);
    }
    
    // Only fall back to defaults if parsing failed
    console.log('🏁 Parsing failed, using default subreddits:', DEFAULT_SUBREDDITS);
    return DEFAULT_SUBREDDITS;
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 updateSubreddits called with:', newSubreddits);
    console.log('🔄 Current subreddits before update:', subreddits);
    
    // Clean the input but don't enforce minimums
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 Filtered subreddits (allowing empty):', filtered);
    
    // Use the filtered array as-is, even if empty
    console.log('🔄 Setting new subreddits:', filtered);
    setSubreddits(filtered);
    
    // Save immediately, even if empty
    console.log('💾 Saving subreddits immediately (even if empty):', filtered);
    setStorageItem(STORAGE_KEY, JSON.stringify(filtered));
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
