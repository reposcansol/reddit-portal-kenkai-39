import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  topics: string[];
  license: {
    name: string;
  } | null;
}

// Enhanced interface for trending calculation
interface GitHubRepoWithTrending extends GitHubRepo {
  trendingScore: number;
  starVelocity: number;
  daysSinceCreation: number;
}

// AI-related programming languages
const AI_LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'Julia',
  'R',
  'Scala',
  'C++', // Used for ML frameworks like PyTorch C++ backend
  'Swift', // Swift for TensorFlow
  'Jupyter Notebook' // Often shows up as a language for AI notebooks
];

// Negative keywords to filter out
const NEGATIVE_KEYWORDS = [
  'help',
  'how do you',
  'how to',
  'can someone',
  'need help',
  'please help',
  'question',
  'eli5',
  'explain like',
  'what is',
  'why is',
  'where is',
  'when is',
  'which is',
  'tutorial',
  'beginner',
  'learning',
  'awesome',
  'list',
  'collection',
  'resources'
];

const containsNegativeKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return NEGATIVE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

const isAIRelatedLanguage = (language: string | null): boolean => {
  if (!language) return false;
  return AI_LANGUAGES.includes(language);
};

const calculateTrendingScore = (repo: GitHubRepo): { trendingScore: number; starVelocity: number; daysSinceCreation: number } => {
  const now = new Date();
  const createdAt = new Date(repo.created_at);
  const pushedAt = new Date(repo.pushed_at);
  
  // Calculate days since creation
  const daysSinceCreation = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate hours since last push
  const hoursSincePush = (now.getTime() - pushedAt.getTime()) / (1000 * 60 * 60);
  
  // Star velocity: stars per day since creation
  const starVelocity = repo.stargazers_count / daysSinceCreation;
  
  // Recency boost: give higher score to repos pushed more recently
  const recencyBoost = Math.max(0.1, 1 - (hoursSincePush / 24));
  
  // Fork factor: repos with more forks tend to be more significant
  const forkFactor = Math.log(repo.forks_count + 1) / 10;
  
  // Base trending score calculation
  let trendingScore = starVelocity * recencyBoost;
  
  // Boost newer repos that are gaining traction quickly
  if (daysSinceCreation <= 30 && starVelocity > 1) {
    trendingScore *= 2; // Double boost for new repos with good velocity
  }
  
  // Add fork factor
  trendingScore += forkFactor;
  
  // Penalty for very old repos (they need higher velocity to be considered trending)
  if (daysSinceCreation > 365) {
    trendingScore *= 0.5;
  }
  
  return { trendingScore, starVelocity, daysSinceCreation };
};

const fetchTrendingRepos = async (): Promise<GitHubRepo[]> => {
  try {
    // Calculate date for last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateQuery = yesterday.toISOString().split('T')[0];
    
    console.log('GitHub: Fetching trending AI-related repos with recent activity in last 24 hours');
    
    // Multiple search strategies to get comprehensive trending results for AI languages
    const searchQueries = [
      // Recently pushed repos with decent stars (catching momentum) - AI languages
      `pushed:>${dateQuery} stars:10..1000 language:Python sort:stars`,
      `pushed:>${dateQuery} stars:10..1000 language:JavaScript sort:stars`,
      `pushed:>${dateQuery} stars:10..1000 language:TypeScript sort:stars`,
      `pushed:>${dateQuery} stars:10..1000 language:Go sort:stars`,
      `pushed:>${dateQuery} stars:10..1000 language:Rust sort:stars`,
      // Popular repos with recent activity (established repos trending again)
      `pushed:>${dateQuery} stars:>100 language:Python sort:updated`,
      `pushed:>${dateQuery} stars:>100 language:JavaScript sort:updated`,
      `pushed:>${dateQuery} stars:>100 language:TypeScript sort:updated`,
      // Newer repos (last 7 days) with good traction in AI languages
      `created:>${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} stars:>5 pushed:>${dateQuery} language:Python sort:stars`,
      `created:>${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} stars:>5 pushed:>${dateQuery} language:JavaScript sort:stars`
    ];
    
    const allRepos: GitHubRepo[] = [];
    const seenRepos = new Set<number>();
    
    // Execute all search queries
    for (const query of searchQueries) {
      try {
        console.log(`GitHub: Searching with query: ${query}`);
        const response = await axios.get(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=50`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'AI-News-Aggregator/1.0'
            }
          }
        );
        
        const repos = response.data.items || [];
        console.log(`GitHub: Found ${repos.length} repos for query`);
        
        // Add unique repos to collection
        repos.forEach((repo: GitHubRepo) => {
          if (!seenRepos.has(repo.id)) {
            seenRepos.add(repo.id);
            allRepos.push(repo);
          }
        });
      } catch (queryError) {
        console.warn(`GitHub: Query failed: ${query}`, queryError);
      }
    }
    
    console.log(`GitHub: Collected ${allRepos.length} unique repositories`);
    
    // Filter repositories with quality requirements and AI language focus
    const filteredRepos = allRepos.filter((repo: GitHubRepo) => {
      const hasMinStars = repo.stargazers_count >= 5; // Minimum 5 stars
      const hasDescription = repo.description && repo.description.length > 10;
      const hasNegativeKeywords = containsNegativeKeywords(repo.description || '') || 
                                  containsNegativeKeywords(repo.name);
      const hasRecentActivity = new Date(repo.pushed_at) > yesterday;
      const isAILanguage = isAIRelatedLanguage(repo.language);
      
      const included = hasMinStars && hasDescription && !hasNegativeKeywords && hasRecentActivity && isAILanguage;
      
      if (!included) {
        const reason = !hasMinStars ? 'insufficient stars' : 
                      !hasDescription ? 'no/short description' : 
                      hasNegativeKeywords ? 'contains negative keywords' :
                      !hasRecentActivity ? 'no recent activity' :
                      !isAILanguage ? `not AI language (${repo.language})` : 'unknown';
        console.log(`GitHub: Filtered out "${repo.name}" - ${reason}`);
      }
      
      return included;
    });
    
    console.log(`GitHub: Filtered to ${filteredRepos.length} AI-related repos`);
    
    // Calculate trending scores for all repos
    const reposWithTrending: GitHubRepoWithTrending[] = filteredRepos.map(repo => {
      const trending = calculateTrendingScore(repo);
      return {
        ...repo,
        ...trending
      };
    });
    
    // Sort by trending score (highest first)
    const sortedRepos = reposWithTrending
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 100); // Limit to top 100 trending repos
    
    console.log(`GitHub: Top trending AI repos by score:`);
    sortedRepos.slice(0, 10).forEach((repo, i) => {
      console.log(`${i + 1}. ${repo.name} (${repo.language}) - Score: ${repo.trendingScore.toFixed(2)}, Velocity: ${repo.starVelocity.toFixed(2)} stars/day, Age: ${repo.daysSinceCreation.toFixed(1)} days`);
    });
    
    // Return repos without the trending metadata (keep original interface)
    return sortedRepos.map(({ trendingScore, starVelocity, daysSinceCreation, ...repo }) => repo);
    
  } catch (error) {
    console.error('Error fetching GitHub trending repos:', error);
    throw new Error('Failed to fetch GitHub trending repositories');
  }
};

export const useGitHub = () => {
  return useQuery({
    queryKey: ['github'],
    queryFn: fetchTrendingRepos,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
