
import { useState, useEffect, useCallback } from 'react';
import { 
  getStoredSubreddits, 
  setStoredSubreddits, 
  addGlobalListener, 
  removeGlobalListener,
  DEFAULT_SUBREDDITS 
} from '@/utils/subredditStorage';

export const useSubredditState = () => {
  console.log('🚀 useSubredditState hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 Initializing subreddits state...');
    const initial = getStoredSubreddits();
    console.log('🏁 Initial subreddits loaded:', initial);
    return initial;
  });

  // Listen for external changes
  useEffect(() => {
    const listener = (newSubreddits: string[]) => {
      console.log('🔄 External subreddit change detected:', newSubreddits);
      setSubreddits(newSubreddits);
    };
    
    addGlobalListener(listener);
    
    return () => {
      removeGlobalListener(listener);
    };
  }, []);

  const updateSubreddits = useCallback((newSubreddits: string[]) => {
    console.log('🔄 updateSubreddits called with:', newSubreddits);
    console.log('🔄 Current subreddits before update:', subreddits);
    
    // Ensure we have valid subreddits and limit to 8
    const filtered = newSubreddits
      .filter(sub => typeof sub === 'string' && sub.trim() !== '')
      .slice(0, 8);
    
    console.log('🔄 Filtered subreddits:', filtered);
    
    const finalSubreddits = filtered.length === 0 ? DEFAULT_SUBREDDITS : filtered;
    
    console.log('🔄 Setting new subreddits:', finalSubreddits);
    setSubreddits(finalSubreddits);
    
    // Save immediately without debouncing
    console.log('💾 Saving subreddits immediately:', finalSubreddits);
    setStoredSubreddits(finalSubreddits);
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
