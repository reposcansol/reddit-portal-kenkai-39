
import React, { createContext, useContext, ReactNode } from 'react';
import { useSubredditState2 } from '@/hooks/useSubredditState2';

interface SubredditContextType {
  subreddits: string[];
  updateSubreddits: (subreddits: string[]) => void;
}

const SubredditContext2 = createContext<SubredditContextType | undefined>(undefined);

export const SubredditProvider2: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🏭 [CONTEXT2] SubredditProvider2 rendering - this should only happen once');
  console.log('🏭 [CONTEXT2] Render timestamp:', new Date().toISOString());
  
  const subredditState = useSubredditState2();
  
  console.log('🏭 [CONTEXT2] SubredditProvider2 state received from hook:', { 
    subreddits: subredditState.subreddits, 
    length: subredditState.subreddits.length,
    timestamp: new Date().toISOString() 
  });

  // Log whenever the subreddits change
  React.useEffect(() => {
    console.log('🏭 [CONTEXT2] SubredditProvider2 - subreddits changed to:', subredditState.subreddits);
    console.log('🏭 [CONTEXT2] SubredditProvider2 - change timestamp:', new Date().toISOString());
    console.log('🏭 [CONTEXT2] SubredditProvider2 - is empty array?', subredditState.subreddits.length === 0);
  }, [subredditState.subreddits]);

  return (
    <SubredditContext2.Provider value={subredditState}>
      {children}
    </SubredditContext2.Provider>
  );
};

export const useSubreddits2 = () => {
  const context = useContext(SubredditContext2);
  if (context === undefined) {
    throw new Error('useSubreddits2 must be used within a SubredditProvider2');
  }
  
  console.log('🎯 [CONTEXT2] useSubreddits2 called - returning:', context.subreddits);
  console.log('🎯 [CONTEXT2] useSubreddits2 timestamp:', new Date().toISOString());
  return context;
};
