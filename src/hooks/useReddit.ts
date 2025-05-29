
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

const fetchRedditPosts = async (subreddits: string[]): Promise<RedditPost[]> => {
  try {
    const allPosts: RedditPost[] = [];
    
    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
    console.log('24 hours ago timestamp:', twentyFourHoursAgo);
    console.log('Current timestamp:', Math.floor(Date.now() / 1000));
    console.log('Fetching from subreddits:', subreddits);
    
    const postsBySubreddit: Record<string, RedditPost[]> = {};
    
    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
          {
            headers: {
              'User-Agent': 'AI-News-Aggregator/1.0'
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
          }))
          .filter((post: RedditPost) => {
            const isRecent = post.created_utc >= twentyFourHoursAgo;
            const hoursAgo = Math.floor((Math.floor(Date.now() / 1000) - post.created_utc) / 3600);
            console.log(`Post "${post.title.substring(0, 50)}..." from r/${post.subreddit} - ${hoursAgo}h ago - ${isRecent ? 'INCLUDED' : 'FILTERED OUT'}`);
            return isRecent;
          })
          .sort((a: RedditPost, b: RedditPost) => b.score - a.score);
        
        postsBySubreddit[subreddit] = posts;
        console.log(`r/${subreddit}: ${posts.length} posts after filtering`);
        
        // Take top posts from each subreddit to ensure representation
        allPosts.push(...posts.slice(0, 15));
      } catch (error) {
        console.error(`Error fetching posts from r/${subreddit}:`, error);
        postsBySubreddit[subreddit] = [];
      }
    }
    
    console.log(`Total posts before final sort: ${allPosts.length}`);
    console.log('Posts per subreddit:', Object.entries(postsBySubreddit).map(([sub, posts]) => `${sub}: ${posts.length}`).join(', '));
    
    // Sort by score and return top posts
    const finalPosts = allPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, 80); // Increased to allow more posts per column
      
    console.log(`Final posts count: ${finalPosts.length}`);
    
    // Log distribution in final posts
    const finalDistribution = finalPosts.reduce((acc, post) => {
      acc[post.subreddit] = (acc[post.subreddit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('Final distribution:', finalDistribution);
    
    return finalPosts;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    throw new Error('Failed to fetch Reddit posts');
  }
};

export const useReddit = (subreddits: string[]) => {
  return useQuery({
    queryKey: ['reddit', subreddits],
    queryFn: () => fetchRedditPosts(subreddits),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
