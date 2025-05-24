
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';
import { RefreshButton } from '@/components/ui/RefreshButton';
import { Zap } from 'lucide-react';

export const CompactDashboardLayout = () => {
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-green-400/30 bg-black backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-none flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-400 tracking-tight font-mono">
                  [AI_NEWS_TERMINAL]
                </h1>
                <p className="text-gray-500 text-xs font-mono">
                  {'>> Accessing neural network feeds...'}
                </p>
              </div>
            </div>
            <RefreshButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-h-screen overflow-hidden p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
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
    </div>
  );
};
