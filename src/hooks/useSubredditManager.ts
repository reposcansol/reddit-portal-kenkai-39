
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selected-subreddits';
const DEFAULT_SUBREDDITS = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

export const useSubredditManager = () => {
  const [subreddits, setSubreddits] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SUBREDDITS;
      } catch {
        return DEFAULT_SUBREDDITS;
      }
    }
    return DEFAULT_SUBREDDITS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subreddits));
  }, [subreddits]);

  const updateSubreddits = (newSubreddits: string[]) => {
    // Ensure we have at least 1 subreddit and max 4
    const filtered = newSubreddits
      .filter(sub => sub.trim() !== '')
      .slice(0, 4);
    
    if (filtered.length === 0) {
      setSubreddits(DEFAULT_SUBREDDITS);
    } else {
      setSubreddits(filtered);
    }
  };

  return {
    subreddits,
    updateSubreddits,
  };
};
