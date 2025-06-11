
import React, { createContext, useContext, ReactNode } from 'react';
import { useSubredditState2 } from '@/hooks/useSubredditState2';

interface SubredditContextType {
  subreddits: string[];
  updateSubreddits: (subreddits: string[]) => void;
}

const SubredditContext2 = createContext<SubredditContextType | undefined>(undefined);

export const SubredditProvider2: React.FC<{ children: ReactNode }> = ({ children }) => {
  const subredditState = useSubredditState2();
  
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
  return context;
};
