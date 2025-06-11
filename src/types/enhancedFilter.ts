
export interface KeywordCategory {
  id: string;
  name: string;
  keywords: string[];
  color: string;
  weight: number;
}

export interface PostLike {
  title?: string;
  score?: number;
  selftext?: string;
  subreddit?: string;
  
  // Reddit-specific properties
  id?: string | number;
  url?: string;
  author?: string;
  created_utc?: number;
  num_comments?: number;
  permalink?: string;
  link_flair_text?: string;
  link_flair_css_class?: string;
  link_flair_background_color?: string;
  link_flair_text_color?: string;
  author_flair_text?: string;
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
}
