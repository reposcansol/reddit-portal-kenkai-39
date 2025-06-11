
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
  highlightLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface UseEnhancedFilterOptions {
  // Empty for now - can be extended in the future
}
