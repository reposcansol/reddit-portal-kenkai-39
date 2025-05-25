
import React from 'react';
import { useHackerNews } from '@/hooks/useHackerNews';
import { HackerNewsColumn } from './HackerNewsColumn';

export const HackerNewsSourcePanel = () => {
  const { data: hackerNewsData, isLoading, error } = useHackerNews();

  // Group HackerNews posts into 4 columns for consistent layout
  const groupedPosts = React.useMemo(() => {
    if (!hackerNewsData) return [[], [], [], []];
    
    const columns: typeof hackerNewsData[] = [[], [], [], []];
    hackerNewsData.forEach((post, index) => {
      columns[index % 4].push(post);
    });
    
    return columns;
  }, [hackerNewsData]);

  return (
    <main 
      className="p-4"
      role="tabpanel"
      id="hackernews-panel"
      aria-label="Hacker News feeds"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[calc(100vh-12rem)]">
        {groupedPosts.map((posts, index) => (
          <HackerNewsColumn
            key={index}
            columnIndex={index}
            posts={posts}
            isLoading={isLoading}
            error={error?.message}
          />
        ))}
      </div>
    </main>
  );
};
