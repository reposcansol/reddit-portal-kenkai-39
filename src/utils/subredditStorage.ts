
import { loadSubredditsFromStorage, saveSubredditsToStorage, DEFAULT_SUBREDDITS } from './subredditPersistence';
import { 
  getGlobalSubreddits, 
  setGlobalSubreddits, 
  addGlobalListener, 
  removeGlobalListener 
} from './globalSubredditState';

// Re-export constants and functions to maintain API compatibility
export { DEFAULT_SUBREDDITS } from './subredditPersistence';
export { 
  addGlobalListener, 
  removeGlobalListener, 
  getGlobalSubreddits, 
  setGlobalSubreddits 
} from './globalSubredditState';

export const getStoredSubreddits = (): string[] => {
  console.log('🔍 getStoredSubreddits called');
  
  // Use global cache if available to prevent multiple reads
  const globalSubreddits = getGlobalSubreddits();
  if (globalSubreddits) {
    console.log('🔍 Using cached global subreddits:', globalSubreddits);
    return globalSubreddits;
  }
  
  const loaded = loadSubredditsFromStorage();
  setGlobalSubreddits(loaded);
  return loaded;
};

export const setStoredSubreddits = (subreddits: string[]): boolean => {
  console.log('💾 setStoredSubreddits called with:', subreddits);
  return saveSubredditsToStorage(subreddits);
};
