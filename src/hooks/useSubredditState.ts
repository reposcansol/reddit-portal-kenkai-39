
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getStoredSubreddits, 
  setStoredSubreddits, 
  addGlobalListener, 
  removeGlobalListener,
  getGlobalSubreddits,
  setGlobalSubreddits,
  DEFAULT_SUBREDDITS 
} from '@/utils/subredditStorage';

const DEBOUNCE_DELAY = 500; // 500ms debounce

export const useSubredditState = () => {
  console.log('🚀 useSubredditState hook initializing at', new Date().toISOString());
  
  // Initialize with stored value or default
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    console.log('🏁 Initializing subreddits state...');
    
    // Use global cache if available to prevent multiple reads
    const globalSubreddits = getGlobalSubreddits();
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
    
    addGlobalListener(listener);
    
    return () => {
      removeGlobalListener(listener);
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
    setGlobalSubreddits(subreddits);
    
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
  console.log('📊 useSubredditState render - current state:', {
    subreddits,
    subredditsLength: subreddits.length,
    globalSubreddits: getGlobalSubreddits(),
    timestamp: new Date().toISOString()
  });

  return {
    subreddits,
    updateSubreddits,
  };
};
