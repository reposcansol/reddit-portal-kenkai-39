
// Singleton state to prevent multiple instances from conflicting
let globalSubreddits: string[] | null = null;
let globalListeners: Array<(subreddits: string[]) => void> = [];

export const getGlobalSubreddits = (): string[] | null => {
  return globalSubreddits;
};

export const setGlobalSubreddits = (subreddits: string[]): void => {
  globalSubreddits = subreddits;
};

export const addGlobalListener = (listener: (subreddits: string[]) => void): void => {
  globalListeners.push(listener);
};

export const removeGlobalListener = (listener: (subreddits: string[]) => void): void => {
  globalListeners = globalListeners.filter(l => l !== listener);
};

export const notifyGlobalListeners = (subreddits: string[]): void => {
  globalListeners.forEach(listener => {
    try {
      listener(subreddits);
    } catch (e) {
      console.error('Error notifying listener:', e);
    }
  });
};
