
import { KeywordCategory } from '@/types/enhancedFilter';

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
