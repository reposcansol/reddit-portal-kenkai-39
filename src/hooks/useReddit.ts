
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useFilterPreferences } from './useFilterPreferences';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  score: number;
  author: string;
  created_utc: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
  selftext?: string;
  link_flair_text?: string;
  link_flair_css_class?: string;
  link_flair_background_color?: string;
  link_flair_text_color?: string;
  author_flair_text?: string;
}

const fetchRedditPosts = async (subreddits: string[], redditLimit: number): Promise<RedditPost[]> => {
  try {
    console.log('🌐 [REDDIT_API] Fetching posts with limit:', redditLimit, 'for subreddits:', subreddits);
    const allPosts: RedditPost[] = [];
    
    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=${redditLimit}`,
          {
            headers: {
              'User-Agent': 'Reddit-Portal/1.0'
            }
          }
        );
        
        const posts = response.data.data.children
          .map((child: any) => ({
            id: child.data.id,
            title: child.data.title,
            url: child.data.url,
            score: child.data.score,
            author: child.data.author,
            created_utc: child.data.created_utc,
            num_comments: child.data.num_comments,
            subreddit: child.data.subreddit,
            permalink: `https://reddit.com${child.data.permalink}`,
            selftext: child.data.selftext,
            link_flair_text: child.data.link_flair_text,
            link_flair_css_class: child.data.link_flair_css_class,
            link_flair_background_color: child.data.link_flair_background_color,
            link_flair_text_color: child.data.link_flair_text_color,
            author_flair_text: child.data.author_flair_text
          }));
        
        console.log(`🌐 [REDDIT_API] Fetched ${posts.length} posts from r/${subreddit}`);
        allPosts.push(...posts);
      } catch (error) {
        console.log(`🌐 [REDDIT_API] Failed to fetch from r/${subreddit}:`, error);
        // Silent fallback - continue with other subreddits
      }
    }
    
    console.log('🌐 [REDDIT_API] Total posts fetched:', allPosts.length);
    return allPosts;
  } catch (error) {
    console.error('🌐 [REDDIT_API] Critical fetch error:', error);
    throw new Error('Failed to fetch Reddit posts');
  }
};

export const useReddit = (subreddits: string[]) => {
  const queryClient = useQueryClient();
  const { preferences } = useFilterPreferences();
  
  const stableKey = [...subreddits].sort().join(',');
  
  // Invalidate when subreddits change
  useEffect(() => {
    console.log('🌐 [REDDIT_HOOK] Subreddits changed, invalidating queries');
    queryClient.invalidateQueries({ 
      queryKey: ['reddit'],
      exact: false 
    });
  }, [stableKey, queryClient]);

  // Invalidate when redditLimit changes (this was missing!)
  useEffect(() => {
    console.log('🌐 [REDDIT_HOOK] Reddit limit changed to:', preferences.redditLimit, 'invalidating queries');
    queryClient.invalidateQueries({ 
      queryKey: ['reddit'],
      exact: false 
    });
  }, [preferences.redditLimit, queryClient]);

  return useQuery({
    queryKey: ['reddit', stableKey, preferences.redditLimit],
    queryFn: () => fetchRedditPosts(subreddits, preferences.redditLimit),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });
};
