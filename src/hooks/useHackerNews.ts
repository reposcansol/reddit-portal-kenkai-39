
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface HackerNewsPost {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
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
  'ask hn',
  'show hn: help'
];

const containsNegativeKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return NEGATIVE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

const fetchHackerNewsStories = async (): Promise<HackerNewsPost[]> => {
  try {
    // Fetch top stories IDs (HackerNews provides up to 500 top stories)
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    
    const storyIds = topStoriesResponse.data; // Get all available stories (up to 500)
    console.log(`HN: Fetching ${storyIds.length} top stories from HackerNews`);
    
    // Fetch individual stories in batches to avoid overwhelming the API
    const batchSize = 50;
    const allStories = [];
    
    for (let i = 0; i < storyIds.length; i += batchSize) {
      const batch = storyIds.slice(i, i + batchSize);
      const storyPromises = batch.map(async (id: number) => {
        const storyResponse = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return storyResponse.data;
      });
      
      const batchStories = await Promise.all(storyPromises);
      allStories.push(...batchStories);
      
      console.log(`HN: Fetched batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(storyIds.length / batchSize)}`);
    }
    
    // Filter for valid stories, posts from last 24 hours, minimum 1 upvote, and no negative keywords
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
    
    const filteredStories = allStories.filter(story => {
      if (!story || !story.title) return false;
      
      const isRecent = story.time >= twentyFourHoursAgo;
      const hasMinUpvotes = (story.score || 0) >= 1;
      const hasNegativeKeywords = containsNegativeKeywords(story.title);
      
      const included = isRecent && hasMinUpvotes && !hasNegativeKeywords;
      
      if (!included) {
        console.log(`HN: Filtered out "${story.title.substring(0, 50)}..." - ${!isRecent ? 'too old' : !hasMinUpvotes ? 'insufficient upvotes' : 'contains negative keywords'}`);
      }
      
      return included;
    });
    
    console.log(`HN: Filtered ${filteredStories.length} stories from last 24 hours with ≥1 upvotes and no negative keywords out of ${allStories.length} total stories`);
    
    // Sort by score (upvotes) in descending order
    return filteredStories.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    console.error('Error fetching Hacker News stories:', error);
    throw new Error('Failed to fetch Hacker News stories');
  }
};

export const useHackerNews = () => {
  return useQuery({
    queryKey: ['hackerNews'],
    queryFn: fetchHackerNewsStories,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
