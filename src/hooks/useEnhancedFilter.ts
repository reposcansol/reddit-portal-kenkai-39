
import { useMemo } from 'react';

export interface KeywordCategory {
  id: string;
  name: string;
  keywords: string[];
  color: string;
  weight: number;
}

export const DEFAULT_CATEGORIES: KeywordCategory[] = [
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    keywords: [
      'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
      'chatgpt', 'gpt', 'llm', 'large language model', 'transformer', 'bert',
      'openai', 'anthropic', 'claude', 'gemini', 'bard', 'copilot',
      'ai', 'ml', 'nlp', 'computer vision', 'generative ai', 'prompt engineering',
      'fine-tuning', 'rlhf', 'agi', 'diffusion', 'stable diffusion'
    ],
    color: 'green',
    weight: 1.5
  },
  {
    id: 'development',
    name: 'Development & Programming',
    keywords: [
      'programming', 'coding', 'development', 'software', 'javascript', 'typescript',
      'react', 'vue', 'angular', 'node', 'python', 'rust', 'go', 'java',
      'api', 'framework', 'library', 'git', 'github', 'deployment', 'devops',
      'docker', 'kubernetes', 'cloud', 'aws', 'frontend', 'backend', 'fullstack'
    ],
    color: 'blue',
    weight: 1.2
  },
  {
    id: 'startup',
    name: 'Startup & Business',
    keywords: [
      'startup', 'entrepreneur', 'funding', 'venture capital', 'vc', 'investment',
      'saas', 'business model', 'revenue', 'growth', 'scale', 'monetization',
      'market', 'product', 'launch', 'ipo', 'acquisition', 'unicorn'
    ],
    color: 'amber',
    weight: 1.0
  },
  {
    id: 'tech',
    name: 'Technology Trends',
    keywords: [
      'blockchain', 'crypto', 'web3', 'metaverse', 'vr', 'ar', 'quantum',
      'cybersecurity', 'privacy', 'data', 'analytics', 'iot', '5g', 'edge computing',
      'serverless', 'microservices', 'automation', 'robotics'
    ],
    color: 'purple',
    weight: 1.1
  }
];

interface PostLike {
  title: string;
  score?: number;
  selftext?: string;
  subreddit?: string;
}

export interface EnhancedPostExtensions {
  relevanceScore: number;
  matchedCategories: string[];
  highlightLevel: 'none' | 'low' | 'medium' | 'high';
}

interface UseEnhancedFilterOptions {
  categories: KeywordCategory[];
  enabledCategories: string[];
  highlightThreshold: number;
  customKeywords: string[];
}

const calculateRelevanceScore = (
  post: PostLike, 
  categories: KeywordCategory[], 
  enabledCategories: string[],
  customKeywords: string[]
): { score: number; matchedCategories: string[] } => {
  const text = `${post.title} ${post.selftext || ''}`.toLowerCase();
  let score = 0;
  const matchedCategories: string[] = [];
  
  // Check enabled categories
  const activeCategories = categories.filter(cat => enabledCategories.includes(cat.id));
  
  activeCategories.forEach(category => {
    let categoryMatches = 0;
    category.keywords.forEach(keyword => {
      const occurrences = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      if (occurrences > 0) {
        const titleWeight = post.title.toLowerCase().includes(keyword.toLowerCase()) ? 3 : 1;
        categoryMatches += occurrences * titleWeight * category.weight;
      }
    });
    
    if (categoryMatches > 0) {
      matchedCategories.push(category.id);
      score += categoryMatches;
    }
  });
  
  // Check custom keywords
  customKeywords.forEach(keyword => {
    const occurrences = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    if (occurrences > 0) {
      const titleWeight = post.title.toLowerCase().includes(keyword.toLowerCase()) ? 3 : 1;
      score += occurrences * titleWeight * 1.3; // Custom keywords get higher weight
    }
  });
  
  // Boost score based on post engagement
  if (post.score) {
    score += Math.log(post.score + 1) * 0.2;
  }
  
  return { score, matchedCategories };
};

const getHighlightLevel = (score: number, threshold: number): 'none' | 'low' | 'medium' | 'high' => {
  if (score < threshold) return 'none';
  if (score < threshold * 2) return 'low';
  if (score < threshold * 4) return 'medium';
  return 'high';
};

export const useEnhancedFilter = <T extends PostLike>(
  posts: T[], 
  options: UseEnhancedFilterOptions
): (T & EnhancedPostExtensions)[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    const { categories, enabledCategories, highlightThreshold, customKeywords } = options;
    
    return posts
      .map(post => {
        const { score, matchedCategories } = calculateRelevanceScore(
          post, 
          categories, 
          enabledCategories, 
          customKeywords
        );
        
        return {
          ...post,
          relevanceScore: score,
          matchedCategories,
          highlightLevel: getHighlightLevel(score, highlightThreshold)
        } as T & EnhancedPostExtensions;
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by original score, not relevance
  }, [posts, options.categories, options.enabledCategories, options.highlightThreshold, options.customKeywords]);
};
