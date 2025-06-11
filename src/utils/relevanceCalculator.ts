
import { PostLike } from '@/types/enhancedFilter';

export const calculateRelevanceScore = (post: PostLike): number => {
  // Simple relevance based on engagement score only
  const engagementScore = post.score || 0;
  
  // Use logarithmic scaling for engagement
  const score = engagementScore > 0 ? Math.log(engagementScore + 1) * 0.5 : 0;
  
  return score;
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
