
import React, { createContext, useContext, ReactNode } from 'react';
import { useSubredditState } from '@/hooks/useSubredditState';

interface SubredditContextType {
  subreddits: string[];
  updateSubreddits: (subreddits: string[]) => void;
}

const SubredditContext = createContext<SubredditContextType | undefined>(undefined);

interface SubredditProviderProps {
  children: ReactNode;
}

export const SubredditProvider: React.FC<SubredditProviderProps> = ({ children }) => {
  console.log('🏭 SubredditProvider rendering - this should only happen once');
  
  const subredditState = useSubredditState();
  
  console.log('🏭 SubredditProvider state:', { subreddits: subredditState.subreddits, timestamp: new Date().toISOString() });

  return (
    <SubredditContext.Provider value={subredditState}>
      {children}
    </SubredditContext.Provider>
  );
};

export const useSubreddits = (): SubredditContextType => {
  const context = useContext(SubredditContext);
  if (context === undefined) {
    throw new Error('useSubreddits must be used within a SubredditProvider');
  }
  
  console.log('🎯 useSubreddits called - returning:', context.subreddits);
  return context;
};
