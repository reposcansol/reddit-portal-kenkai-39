
import { PostLike } from '@/types/enhancedFilter';

export const getHighlightLevel = (score: number): 'none' | 'low' | 'medium' | 'high' => {
  if (score >= 1000) return 'high';
  if (score >= 500) return 'medium';
  if (score >= 100) return 'low';
  return 'none';
};
