
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

export const useSubredditManager = () => {
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('Loading subreddits from localStorage:', stored);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Using stored subreddits:', parsed);
          return parsed;
        }
      }
      
      console.log('Using default subreddits:', DEFAULT_SUBREDDITS);
      return DEFAULT_SUBREDDITS;
    } catch (error) {
      console.error('Error loading subreddits from localStorage:', error);
      return DEFAULT_SUBREDDITS;
    }
  });

  useEffect(() => {
    try {
      console.log('Saving subreddits to localStorage:', subreddits);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subreddits));
    } catch (error) {
      console.error('Error saving subreddits to localStorage:', error);
    }
  }, [subreddits]);

  const updateSubreddits = (newSubreddits: string[]) => {
    console.log('Updating subreddits:', newSubreddits);
    
    // Ensure we have at least 1 subreddit and max 4
    const filtered = newSubreddits
      .filter(sub => sub.trim() !== '')
      .slice(0, 4);
    
    if (filtered.length === 0) {
      console.log('No valid subreddits, reverting to defaults');
      setSubreddits(DEFAULT_SUBREDDITS);
    } else {
      console.log('Setting filtered subreddits:', filtered);
      setSubreddits(filtered);
    }
  };

  return {
    subreddits,
    updateSubreddits,
  };
};
