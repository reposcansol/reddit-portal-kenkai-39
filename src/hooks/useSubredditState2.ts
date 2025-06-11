
import { useState, useEffect, useCallback } from 'react';
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
    console.log('🏁 Initializing subreddits state 2...');
    const stored = getStorageItem(STORAGE_KEY_2);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('🏁 Initial subreddits 2 loaded:', parsed);
          return parsed;
        }
      } catch (error) {
        console.error('Error parsing stored subreddits 2:', error);
      }
    }
    console.log('🏁 Using default subreddits 2:', DEFAULT_SUBREDDITS_2);
    return DEFAULT_SUBREDDITS_2;
  });

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 updateSubreddits2 called with:', newSubreddits);
    console.log('🔄 Current subreddits 2 before update:', subreddits);
    
    // Ensure we have valid subreddits
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 4);
    
    console.log('🔄 Filtered subreddits 2:', filtered);
    
    const finalSubreddits = filtered.length === 0 ? DEFAULT_SUBREDDITS_2 : filtered;
    
    console.log('🔄 Setting new subreddits 2:', finalSubreddits);
    setSubreddits(finalSubreddits);
    
    // Save immediately
    console.log('💾 Saving subreddits 2 immediately:', finalSubreddits);
    setStorageItem(STORAGE_KEY_2, JSON.stringify(finalSubreddits));
  }, [subreddits]);

  // Debug current state every render
  console.log('📊 useSubredditState2 render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    timestamp: new Date().toISOString()
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
