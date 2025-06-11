
import { useMemo } from 'react';
import { RedditPost } from './useReddit';
import { FilterPreferences } from './useFilterPreferences';

export const usePostFilter = (posts: RedditPost[], filterPreferences: FilterPreferences): RedditPost[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0 || !filterPreferences.enabled) {
      return posts;
    }

    console.log(`🔍 [FILTER] Starting with ${posts.length} posts`);
    const now = Math.floor(Date.now() / 1000);
    const timeThreshold = now - (filterPreferences.timeRange * 3600); // Convert hours to seconds

    // Group posts by subreddit for per-subreddit limiting
    const postsBySubreddit: Record<string, RedditPost[]> = {};
    
    const filteredPosts = posts.filter(post => {
      // Score filters
      if (post.score < filterPreferences.minUpvotes) {
        console.log(`🔍 [FILTER] Filtered "${post.title}" - score ${post.score} < ${filterPreferences.minUpvotes}`);
        return false;
      }
      if (filterPreferences.maxUpvotes && post.score > filterPreferences.maxUpvotes) {
        console.log(`🔍 [FILTER] Filtered "${post.title}" - score ${post.score} > ${filterPreferences.maxUpvotes}`);
        return false;
      }

      // Comment filters
      if (post.num_comments < filterPreferences.minComments) {
        console.log(`🔍 [FILTER] Filtered "${post.title}" - comments ${post.num_comments} < ${filterPreferences.minComments}`);
        return false;
      }

      // Time filter
      if (post.created_utc < timeThreshold) {
        const hoursAgo = Math.floor((now - post.created_utc) / 3600);
        console.log(`🔍 [FILTER] Filtered "${post.title}" - ${hoursAgo}h old > ${filterPreferences.timeRange}h limit`);
        return false;
      }

      // Character blacklist filter
      const titleLower = post.title.toLowerCase();
      const contentLower = (post.selftext || '').toLowerCase();
      const combinedText = `${titleLower} ${contentLower}`;
      
      for (const char of filterPreferences.characterBlacklist) {
        if (combinedText.includes(char.toLowerCase())) {
          console.log(`🔍 [FILTER] Filtered "${post.title}" - contains blacklisted character "${char}"`);
          return false;
        }
      }

      // Keyword blacklist filter
      for (const keyword of filterPreferences.keywordBlacklist) {
        if (combinedText.includes(keyword.toLowerCase())) {
          console.log(`🔍 [FILTER] Filtered "${post.title}" - contains blacklisted keyword "${keyword}"`);
          return false;
        }
      }

      // Post length filters
      const postLength = post.title.length + (post.selftext?.length || 0);
      if (postLength < filterPreferences.minPostLength) {
        console.log(`🔍 [FILTER] Filtered "${post.title}" - length ${postLength} < ${filterPreferences.minPostLength}`);
        return false;
      }
      if (filterPreferences.maxPostLength && postLength > filterPreferences.maxPostLength) {
        console.log(`🔍 [FILTER] Filtered "${post.title}" - length ${postLength} > ${filterPreferences.maxPostLength}`);
        return false;
      }

      // Flair filter (case-insensitive)
      if (post.link_flair_text) {
        const flairLower = post.link_flair_text.toLowerCase();
        for (const excludedFlair of filterPreferences.excludedFlairs) {
          if (flairLower.includes(excludedFlair.toLowerCase())) {
            console.log(`🔍 [FILTER] Filtered "${post.title}" - flair "${post.link_flair_text}" contains excluded "${excludedFlair}"`);
            return false;
          }
        }
      }

      // Author filter
      if (filterPreferences.excludedAuthors.includes(post.author)) {
        console.log(`🔍 [FILTER] Filtered "${post.title}" - author "${post.author}" is excluded`);
        return false;
      }

      return true;
    });

    console.log(`🔍 [FILTER] After basic filtering: ${filteredPosts.length} posts remaining`);

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

    console.log(`🔍 [FILTER] Final result: ${finalPosts.length} posts after per-subreddit (${filterPreferences.postsPerSubreddit}) and total (${filterPreferences.maxTotalPosts}) limits`);
    
    // Log distribution
    const distribution = finalPosts.reduce((acc, post) => {
      acc[post.subreddit] = (acc[post.subreddit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('🔍 [FILTER] Final distribution:', distribution);

    return finalPosts;
  }, [posts, filterPreferences]);
};
