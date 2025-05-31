
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
  id?: string | number; // Allow both string (Reddit) and number (GitHub)
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
  
  // GitHub-specific properties
  name?: string;
  description?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  html_url?: string;
  full_name?: string;
  language?: string | null;
  owner?: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  topics?: string[];
  license?: {
    name: string;
  } | null;
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
