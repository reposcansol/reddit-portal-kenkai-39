
import { useSubredditState } from './useSubredditState';

export const useSubredditManager = () => {
  console.log('🚀 useSubredditManager hook delegating to useSubredditState');
  
  return useSubredditState();
};
