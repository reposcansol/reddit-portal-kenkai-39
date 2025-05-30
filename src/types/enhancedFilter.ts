
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
  id?: number;
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
  highlightThreshold: number;
  primaryKeywords: string[];
  secondaryKeywords: string[];
}
