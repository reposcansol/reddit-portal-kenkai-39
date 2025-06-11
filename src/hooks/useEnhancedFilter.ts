
import { useMemo } from 'react';
import { PostLike, EnhancedPostExtensions, UseEnhancedFilterOptions } from '@/types/enhancedFilter';
import { calculateRelevanceScore, calculatePercentage } from '@/utils/relevanceCalculator';
import { getHighlightLevel } from '@/utils/highlightUtils';

// Re-export types for backward compatibility
export type { EnhancedPostExtensions };

export const useEnhancedFilter = <T extends PostLike>(
  posts: T[], 
  options: UseEnhancedFilterOptions
): (T & EnhancedPostExtensions)[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    console.log('Enhanced Filter: Processing', posts.length, 'posts without category filtering');
    
    // First pass: calculate raw scores (simplified without categories)
    const postsWithScores = posts.map(post => {
      const score = calculateRelevanceScore(post);
      
      return {
        ...post,
        rawScore: score
      };
    });
    
    // Get all scores for normalization
    const allScores = postsWithScores.map(p => p.rawScore);
    
    // Second pass: calculate percentages and final properties
    const enhancedPosts = postsWithScores.map(post => {
      const percentage = calculatePercentage(post.rawScore, allScores);
      
      return {
        ...post,
        relevanceScore: post.rawScore,
        relevancePercentage: percentage,
        highlightLevel: getHighlightLevel(percentage)
      } as T & EnhancedPostExtensions;
    });
    
    // Return posts in their original order
    console.log('Enhanced Filter: Returning', enhancedPosts.length, 'enhanced posts without category filtering');
    return enhancedPosts;
  }, [posts]);
};
