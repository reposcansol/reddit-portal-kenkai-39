
import React from 'react';
import { useHackerNews } from '@/hooks/useHackerNews';
import { HackerNewsColumn } from './HackerNewsColumn';

export const HackerNewsSourcePanel = () => {
  const { data: hackerNewsData, isLoading, error } = useHackerNews();

  // Group HackerNews posts into 4 columns with 20 posts each
  const groupedPosts = React.useMemo(() => {
    if (!hackerNewsData) return [[], [], [], []];
    
    // Take first 80 posts and distribute them into 4 columns of 20 each
    const limitedPosts = hackerNewsData.slice(0, 80);
    const columns: typeof hackerNewsData[] = [[], [], [], []];
    
    // Fill each column with 20 posts sequentially
    for (let i = 0; i < limitedPosts.length; i++) {
      const columnIndex = Math.floor(i / 20);
      if (columnIndex < 4) {
        columns[columnIndex].push(limitedPosts[i]);
      }
    }
    
    console.log('HackerNews posts per column:', columns.map(col => col.length));
    
    return columns;
  }, [hackerNewsData]);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="hackernews-panel"
      aria-label="Hacker News feeds"
    >
      <div className="flex gap-4 h-full overflow-hidden">
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
