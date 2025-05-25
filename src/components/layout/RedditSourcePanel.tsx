
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';

export const RedditSourcePanel = () => {
  const { data: redditData, isLoading, error } = useReddit();

  // Group posts by subreddit
  const postsBySubreddit = React.useMemo(() => {
    if (!redditData) return {};
    
    return redditData.reduce((acc, post) => {
      if (!acc[post.subreddit]) {
        acc[post.subreddit] = [];
      }
      acc[post.subreddit].push(post);
      return acc;
    }, {} as Record<string, typeof redditData>);
  }, [redditData]);

  return (
    <main 
      className="p-4"
      role="tabpanel"
      id="reddit-panel"
      aria-label="Reddit feeds"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[calc(100vh-12rem)]">
        {Object.entries(postsBySubreddit).map(([subreddit, posts]) => (
          <SubredditColumn
            key={subreddit}
            subreddit={subreddit}
            posts={posts}
            isLoading={isLoading}
            error={error?.message}
          />
        ))}
      </div>
    </main>
  );
};
