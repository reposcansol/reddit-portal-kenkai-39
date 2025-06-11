
import { useMemo } from 'react';
import { PostLike, EnhancedPostExtensions, UseEnhancedFilterOptions } from '@/types/enhancedFilter';
import { getHighlightLevel } from '@/utils/relevanceCalculator';

export type { EnhancedPostExtensions };

export const useEnhancedFilter = <T extends PostLike>(
  posts: T[], 
  options: UseEnhancedFilterOptions
): (T & EnhancedPostExtensions)[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    const enhancedPosts = posts.map(post => {
      return {
        ...post,
        highlightLevel: getHighlightLevel(post.score || 0)
      } as T & EnhancedPostExtensions;
    });
    
    return enhancedPosts;
  }, [posts]);
};
