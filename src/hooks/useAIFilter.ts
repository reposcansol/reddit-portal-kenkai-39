import { useMemo } from 'react';

const AI_KEYWORDS = [
  'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
  'chatgpt', 'gpt', 'llm', 'large language model', 'transformer', 'bert',
  'openai', 'anthropic', 'claude', 'gemini', 'bard', 'copilot',
  'ai', 'ml', 'nlp', 'computer vision', 'robotics', 'automation',
  'tensorflow', 'pytorch', 'hugging face', 'stable diffusion',
  'generative ai', 'prompt engineering', 'fine-tuning', 'rlhf',
  'agi', 'asi', 'singularity', 'alignment', 'safety'
];

interface PostLike {
  title: string;
  score?: number;
  selftext?: string;
}

const calculateRelevanceScore = (post: PostLike): number => {
  const text = `${post.title} ${post.selftext || ''}`.toLowerCase();
  let score = 0;
  
  AI_KEYWORDS.forEach(keyword => {
    const occurrences = (text.match(new RegExp(keyword, 'g')) || []).length;
    if (occurrences > 0) {
      // Higher weight for exact matches in title
      const titleWeight = post.title.toLowerCase().includes(keyword) ? 3 : 1;
      score += occurrences * titleWeight;
    }
  });
  
  // Boost score based on post engagement
  if (post.score) {
    score += Math.log(post.score + 1) * 0.1;
  }
  
  return score;
};

export const useAIFilter = <T extends PostLike>(posts: T[]): T[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    return posts
      .map(post => ({
        ...post,
        relevanceScore: calculateRelevanceScore(post)
      }))
      .filter(post => post.relevanceScore > 0.5) // Only show posts with some AI relevance
      .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort by upvotes/score, not relevance
      .slice(0, 20); // Limit to top 20 most upvoted posts
  }, [posts]);
};
