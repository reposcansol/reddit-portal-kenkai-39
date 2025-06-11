
import { useMemo } from 'react';
import { RedditPost } from './useReddit';
import { FilterPreferences } from './useFilterPreferences';

export const usePostFilter = (posts: RedditPost[], filterPreferences: FilterPreferences): RedditPost[] => {
  return useMemo(() => {
    console.log('🔍 [POST_FILTER] Running filter with preferences:', filterPreferences);
    console.log('🔍 [POST_FILTER] Input posts count:', posts?.length || 0);
    
    if (!posts || posts.length === 0) {
      console.log('🔍 [POST_FILTER] No posts to filter');
      return posts;
    }
    
    if (!filterPreferences.enabled) {
      console.log('🔍 [POST_FILTER] Filters disabled, returning all posts');
      return posts;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeThreshold = now - (filterPreferences.timeRange * 3600);

    // Group posts by subreddit for per-subreddit limiting
    const postsBySubreddit: Record<string, RedditPost[]> = {};
    
    const filteredPosts = posts.filter(post => {
      // Score filters
      if (post.score < filterPreferences.minUpvotes) {
        return false;
      }
      if (filterPreferences.maxUpvotes && post.score > filterPreferences.maxUpvotes) {
        return false;
      }

      // Comment filters
      if (post.num_comments < filterPreferences.minComments) {
        return false;
      }

      // Time filter
      if (post.created_utc < timeThreshold) {
        return false;
      }

      // Character blacklist filter
      const titleLower = post.title.toLowerCase();
      const contentLower = (post.selftext || '').toLowerCase();
      const combinedText = `${titleLower} ${contentLower}`;
      
      for (const char of filterPreferences.characterBlacklist) {
        if (combinedText.includes(char.toLowerCase())) {
          return false;
        }
      }

      // Keyword blacklist filter
      for (const keyword of filterPreferences.keywordBlacklist) {
        if (combinedText.includes(keyword.toLowerCase())) {
          return false;
        }
      }

      // Post length filters
      const postLength = post.title.length + (post.selftext?.length || 0);
      if (postLength < filterPreferences.minPostLength) {
        return false;
      }
      if (filterPreferences.maxPostLength && postLength > filterPreferences.maxPostLength) {
        return false;
      }

      // Flair filter (case-insensitive)
      if (post.link_flair_text) {
        const flairLower = post.link_flair_text.toLowerCase();
        for (const excludedFlair of filterPreferences.excludedFlairs) {
          if (flairLower.includes(excludedFlair.toLowerCase())) {
            return false;
          }
        }
      }

      // Author filter
      if (filterPreferences.excludedAuthors.includes(post.author)) {
        return false;
      }

      return true;
    });

    console.log('🔍 [POST_FILTER] Posts after basic filtering:', filteredPosts.length);

    // Group by subreddit and apply per-subreddit limits
    filteredPosts.forEach(post => {
      const subreddit = post.subreddit.toLowerCase();
      if (!postsBySubreddit[subreddit]) {
        postsBySubreddit[subreddit] = [];
      }
      if (postsBySubreddit[subreddit].length < filterPreferences.postsPerSubreddit) {
        postsBySubreddit[subreddit].push(post);
      }
    });

    // Flatten and apply total post limit
    const finalPosts = Object.values(postsBySubreddit)
      .flat()
      .sort((a, b) => b.score - a.score)
      .slice(0, filterPreferences.maxTotalPosts);

    console.log('🔍 [POST_FILTER] Final filtered posts count:', finalPosts.length);
    return finalPosts;
  }, [posts, filterPreferences]);
};
