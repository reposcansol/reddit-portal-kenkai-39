
import { useMemo } from 'react';
import { RedditPost } from './useReddit';
import { FilterPreferences } from './useFilterPreferences';

export const usePostFilter = (posts: RedditPost[], filterPreferences: FilterPreferences): RedditPost[] => {
  return useMemo(() => {
    if (!posts || posts.length === 0 || !filterPreferences.enabled) {
      return posts;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeThreshold = now - (filterPreferences.timeRange * 3600); // Convert hours to seconds

    return posts.filter(post => {
      // Score filters
      if (post.score < filterPreferences.minUpvotes) return false;
      if (filterPreferences.maxUpvotes && post.score > filterPreferences.maxUpvotes) return false;

      // Comment filters
      if (post.num_comments < filterPreferences.minComments) return false;

      // Time filter
      if (post.created_utc < timeThreshold) return false;

      // Character blacklist filter
      const titleLower = post.title.toLowerCase();
      const contentLower = (post.selftext || '').toLowerCase();
      const combinedText = `${titleLower} ${contentLower}`;
      
      for (const char of filterPreferences.characterBlacklist) {
        if (combinedText.includes(char.toLowerCase())) return false;
      }

      // Keyword blacklist filter
      for (const keyword of filterPreferences.keywordBlacklist) {
        if (combinedText.includes(keyword.toLowerCase())) return false;
      }

      // Post length filters
      const postLength = post.title.length + (post.selftext?.length || 0);
      if (postLength < filterPreferences.minPostLength) return false;
      if (filterPreferences.maxPostLength && postLength > filterPreferences.maxPostLength) return false;

      // Flair filter
      if (post.link_flair_text && filterPreferences.excludedFlairs.includes(post.link_flair_text)) return false;

      // Author filter
      if (filterPreferences.excludedAuthors.includes(post.author)) return false;

      return true;
    });
  }, [posts, filterPreferences]);
};
