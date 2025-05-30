
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
  'learning'
];

const containsNegativeKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return NEGATIVE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

const fetchTrendingRepos = async (): Promise<GitHubRepo[]> => {
  try {
    // Calculate date for last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateQuery = yesterday.toISOString().split('T')[0];
    
    console.log('GitHub: Fetching trending repos from last 24 hours');
    
    // Search for repositories created/updated in the last 24 hours, sorted by stars
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=created:>${dateQuery}&sort=stars&order=desc&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AI-News-Aggregator/1.0'
        }
      }
    );
    
    const repos = response.data.items;
    console.log(`GitHub: Fetched ${repos.length} repositories from last 24 hours`);
    
    // Filter repositories with minimum requirements and no negative keywords
    const filteredRepos = repos.filter((repo: GitHubRepo) => {
      const hasMinStars = repo.stargazers_count >= 1; // Minimum 1 star
      const hasDescription = repo.description && repo.description.length > 0;
      const hasNegativeKeywords = containsNegativeKeywords(repo.description || '') || 
                                  containsNegativeKeywords(repo.name);
      
      const included = hasMinStars && hasDescription && !hasNegativeKeywords;
      
      if (!included) {
        console.log(`GitHub: Filtered out "${repo.name}" - ${!hasMinStars ? 'insufficient stars' : !hasDescription ? 'no description' : 'contains negative keywords'}`);
      }
      
      return included;
    });
    
    console.log(`GitHub: Filtered ${filteredRepos.length} repos with ≥1 stars, descriptions, and no negative keywords out of ${repos.length} total repos`);
    
    // Sort by stars in descending order
    return filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
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
