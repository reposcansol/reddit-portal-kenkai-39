
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

const fetchHackerNewsStories = async (): Promise<HackerNewsPost[]> => {
  try {
    // Fetch top stories IDs
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    
    const storyIds = topStoriesResponse.data.slice(0, 50); // Get first 50 stories
    
    // Fetch individual stories
    const storyPromises = storyIds.map(async (id: number) => {
      const storyResponse = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.data;
    });
    
    const stories = await Promise.all(storyPromises);
    
    // Filter for valid stories and posts from last 24 hours
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
    
    return stories.filter(story => 
      story && 
      story.title && 
      story.time >= twentyFourHoursAgo
    );
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
