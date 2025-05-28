
import { useMemo } from 'react';
import { KeywordCategory, PostLike, EnhancedPostExtensions, UseEnhancedFilterOptions } from '@/types/enhancedFilter';
import { calculateRelevanceScore, calculatePercentage } from '@/utils/relevanceCalculator';
import { getHighlightLevel } from '@/utils/highlightUtils';

// Re-export types and constants for backward compatibility
export type { KeywordCategory, EnhancedPostExtensions };
export { DEFAULT_CATEGORIES } from '@/config/defaultCategories';

export const useEnhancedFilter = <T extends PostLike>(
  posts: T[], 
  options: UseEnhancedFilterOptions
): (T & EnhancedPostExtensions)[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    const { categories, enabledCategories, primaryKeywords = [], secondaryKeywords = [] } = options;
    
    console.log('Enhanced Filter: Processing', posts.length, 'posts without forced sorting');
    
    // First pass: calculate raw scores
    const postsWithScores = posts.map(post => {
      const { score, matchedCategories, matchedKeywords } = calculateRelevanceScore(
        post, 
        categories, 
        enabledCategories, 
        primaryKeywords,
        secondaryKeywords
      );
      
      return {
        ...post,
        rawScore: score,
        matchedCategories,
        matchedKeywords
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
    
    // REMOVED: The forced sorting that was overriding user choice
    // Return posts in their original order, allowing panels to handle sorting
    console.log('Enhanced Filter: Returning', enhancedPosts.length, 'enhanced posts without forced sort');
    return enhancedPosts;
  }, [posts, options.categories, options.enabledCategories, options.primaryKeywords, options.secondaryKeywords]);
};
