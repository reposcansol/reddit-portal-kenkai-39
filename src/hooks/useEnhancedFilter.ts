
import { useMemo } from 'react';
import { PostLike, EnhancedPostExtensions, UseEnhancedFilterOptions } from '@/types/enhancedFilter';
import { getHighlightLevel } from '@/utils/relevanceCalculator';

// Re-export types for backward compatibility
export type { EnhancedPostExtensions };

export const useEnhancedFilter = <T extends PostLike>(
  posts: T[], 
  options: UseEnhancedFilterOptions
): (T & EnhancedPostExtensions)[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    console.log('Enhanced Filter: Processing', posts.length, 'posts');
    
    // Add highlight level based on score
    const enhancedPosts = posts.map(post => {
      return {
        ...post,
        highlightLevel: getHighlightLevel(post.score || 0)
      } as T & EnhancedPostExtensions;
    });
    
    console.log('Enhanced Filter: Returning', enhancedPosts.length, 'enhanced posts');
    return enhancedPosts;
  }, [posts]);
};
