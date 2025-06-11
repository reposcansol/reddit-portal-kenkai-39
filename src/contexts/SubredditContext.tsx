
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
  console.log('🏭 [CONTEXT1] SubredditProvider rendering - this should only happen once');
  console.log('🏭 [CONTEXT1] Render timestamp:', new Date().toISOString());
  
  const subredditState = useSubredditState();
  
  console.log('🏭 [CONTEXT1] SubredditProvider state received from hook:', { 
    subreddits: subredditState.subreddits, 
    length: subredditState.subreddits.length,
    timestamp: new Date().toISOString() 
  });

  // Log whenever the subreddits change
  React.useEffect(() => {
    console.log('🏭 [CONTEXT1] SubredditProvider - subreddits changed to:', subredditState.subreddits);
    console.log('🏭 [CONTEXT1] SubredditProvider - change timestamp:', new Date().toISOString());
    console.log('🏭 [CONTEXT1] SubredditProvider - is empty array?', subredditState.subreddits.length === 0);
  }, [subredditState.subreddits]);

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
  
  console.log('🎯 [CONTEXT1] useSubreddits called - returning:', context.subreddits);
  console.log('🎯 [CONTEXT1] useSubreddits timestamp:', new Date().toISOString());
  return context;
};
