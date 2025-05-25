
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

  // Define the order of subreddits to ensure consistent layout
  const subredditOrder = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];

  return (
    <main 
      className="p-4 h-full"
      role="tabpanel"
      id="reddit-panel"
      aria-label="Reddit feeds"
    >
      <div className="flex gap-4 h-full min-h-[calc(100vh-12rem)]">
        {subredditOrder.map((subreddit) => (
          <SubredditColumn
            key={subreddit}
            subreddit={subreddit}
            posts={postsBySubreddit[subreddit] || []}
            isLoading={isLoading}
            error={error?.message}
          />
        ))}
      </div>
    </main>
  );
};
