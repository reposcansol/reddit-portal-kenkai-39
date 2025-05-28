
export interface KeywordCategory {
  id: string;
  name: string;
  keywords: string[];
  color: string;
  weight: number;
}

export interface PostLike {
  title: string;
  score?: number;
  selftext?: string;
  subreddit?: string;
}

export interface EnhancedPostExtensions {
  relevanceScore: number;
  relevancePercentage: number;
  matchedCategories: string[];
  highlightLevel: 'none' | 'low' | 'medium' | 'high';
  matchedKeywords: string[];
}

export interface UseEnhancedFilterOptions {
  categories: KeywordCategory[];
  enabledCategories: string[];
  highlightThreshold: number;
  primaryKeywords: string[];
  secondaryKeywords: string[];
}
