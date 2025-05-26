
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
  relevancePercentage: number;
  matchedCategories: string[];
  highlightLevel: 'none' | 'low' | 'medium' | 'high';
  matchedKeywords: string[];
}

interface UseEnhancedFilterOptions {
  categories: KeywordCategory[];
  enabledCategories: string[];
  highlightThreshold: number;
  primaryKeywords: string[];
  secondaryKeywords: string[];
}

const calculateRelevanceScore = (
  post: PostLike, 
  categories: KeywordCategory[], 
  enabledCategories: string[],
  primaryKeywords: string[] = [],
  secondaryKeywords: string[] = []
): { score: number; matchedCategories: string[]; matchedKeywords: string[] } => {
  const text = `${post.title} ${post.selftext || ''}`.toLowerCase();
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
        const titleWeight = post.title.toLowerCase().includes(keywordLower) ? 3 : 1;
        categoryMatches += occurrences * titleWeight * category.weight;
        matchedKeywords.push(keyword);
      }
    });
    
    if (categoryMatches > 0) {
      matchedCategories.push(category.id);
      score += categoryMatches;
    }
  });
  
  // Check primary keywords (3x weight)
  primaryKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (text.match(new RegExp(keywordLower, 'g')) || []).length;
    if (occurrences > 0) {
      const titleWeight = post.title.toLowerCase().includes(keywordLower) ? 3 : 1;
      score += occurrences * titleWeight * 3.0; // Primary keywords get 3x weight
      matchedKeywords.push(keyword);
    }
  });
  
  // Check secondary keywords (2x weight)
  secondaryKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (text.match(new RegExp(keywordLower, 'g')) || []).length;
    if (occurrences > 0) {
      const titleWeight = post.title.toLowerCase().includes(keywordLower) ? 3 : 1;
      score += occurrences * titleWeight * 2.0; // Secondary keywords get 2x weight
      matchedKeywords.push(keyword);
    }
  });
  
  // Boost score based on post engagement (25% of total score potential)
  if (post.score) {
    score += Math.log(post.score + 1) * 0.5;
  }
  
  return { score, matchedCategories, matchedKeywords: [...new Set(matchedKeywords)] };
};

const calculatePercentage = (score: number, allScores: number[]): number => {
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

const getHighlightLevel = (percentage: number): 'none' | 'low' | 'medium' | 'high' => {
  if (percentage < 20) return 'none';
  if (percentage < 50) return 'low';
  if (percentage < 75) return 'medium';
  return 'high';
};

export const useEnhancedFilter = <T extends PostLike>(
  posts: T[], 
  options: UseEnhancedFilterOptions
): (T & EnhancedPostExtensions)[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    const { categories, enabledCategories, primaryKeywords = [], secondaryKeywords = [] } = options;
    
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
    
    // Sort by percentage (highest first), then by original score
    return enhancedPosts.sort((a, b) => {
      if (b.relevancePercentage !== a.relevancePercentage) {
        return b.relevancePercentage - a.relevancePercentage;
      }
      return (b.score || 0) - (a.score || 0);
    });
  }, [posts, options.categories, options.enabledCategories, options.primaryKeywords, options.secondaryKeywords]);
};
