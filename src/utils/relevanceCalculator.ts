
import { KeywordCategory, PostLike } from '@/types/enhancedFilter';

export const calculateRelevanceScore = (
  post: PostLike, 
  categories: KeywordCategory[], 
  enabledCategories: string[]
): { score: number; matchedCategories: string[]; matchedKeywords: string[] } => {
  // Handle both Reddit posts and Hacker News posts
  const title = post.title || '';
  const content = post.selftext || '';
  const text = `${title} ${content}`.toLowerCase();
  
  let score = 0;
  const matchedCategories: string[] = [];
  const matchedKeywords: string[] = [];
  
  // Check enabled categories
  const activeCategories = categories.filter(cat => enabledCategories.includes(cat.id));
  
  activeCategories.forEach(category => {
    let categoryMatches = 0;
    category.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const occurrences = (text.match(new RegExp(keywordLower, 'g')) || []).length;
      if (occurrences > 0) {
        const titleWeight = title.toLowerCase().includes(keywordLower) ? 3 : 1;
        categoryMatches += occurrences * titleWeight * category.weight;
        matchedKeywords.push(keyword);
      }
    });
    
    if (categoryMatches > 0) {
      matchedCategories.push(category.id);
      score += categoryMatches;
    }
  });
  
  // Boost score based on post engagement (25% of total score potential)
  // Handle Reddit score and Hacker News score
  const engagementScore = post.score || 0;
  if (engagementScore) {
    score += Math.log(engagementScore + 1) * 0.5;
  }
  
  return { score, matchedCategories, matchedKeywords: [...new Set(matchedKeywords)] };
};

export const calculatePercentage = (score: number, allScores: number[]): number => {
  if (allScores.length === 0 || score === 0) return 0;
  
  // Find max score in current batch for normalization
  const maxScore = Math.max(...allScores);
  if (maxScore === 0) return 0;
  
  // Calculate percentage (0-100)
  let percentage = (score / maxScore) * 100;
  
  // Apply some smoothing to avoid too many 100% scores
  percentage = Math.min(percentage, 95);
  
  return Math.round(percentage);
};
