
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';
import { DraggableContainer } from './DraggableContainer';
import { DraggableColumn } from './DraggableColumn';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { RotateCcw } from 'lucide-react';

export const RedditSourcePanel = () => {
  const { data: redditData, isLoading, error } = useReddit();

  // Define the default order of subreddits
  const defaultSubredditOrder = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];
  
  // Use the custom hook for managing column order
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'reddit-column-order',
    defaultOrder: defaultSubredditOrder
  });

  // Group posts by subreddit with case-insensitive matching
  const postsBySubreddit = React.useMemo(() => {
    if (!redditData) return {};
    
    return redditData.reduce((acc, post) => {
      // Normalize subreddit name to lowercase for consistent grouping
      const normalizedSubreddit = post.subreddit.toLowerCase();
      if (!acc[normalizedSubreddit]) {
        acc[normalizedSubreddit] = [];
      }
      acc[normalizedSubreddit].push(post);
      return acc;
    }, {} as Record<string, typeof redditData>);
  }, [redditData]);

  console.log('Posts by subreddit:', Object.keys(postsBySubreddit));
  console.log('Current column order:', columnOrder);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="reddit-panel"
      aria-label="Reddit feeds"
    >
      {/* Reset button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={resetOrder}
          className="text-xs text-gray-500 hover:text-green-400 transition-colors 
                     flex items-center gap-1 font-mono
                     bg-black border border-green-400/30 rounded-none px-2 py-1
                     hover:border-green-400/50"
          title="Reset column order"
        >
          <RotateCcw className="w-3 h-3" />
          [RESET_ORDER]
        </button>
      </div>

      <DraggableContainer
        items={columnOrder}
        onReorder={setColumnOrder}
        className="flex gap-4 h-full overflow-hidden"
      >
        {columnOrder.map((subreddit) => (
          <DraggableColumn
            key={subreddit}
            id={subreddit}
            className="w-1/4"
          >
            <SubredditColumn
              subreddit={subreddit}
              posts={postsBySubreddit[subreddit] || []}
              isLoading={isLoading}
              error={error?.message}
            />
          </DraggableColumn>
        ))}
      </DraggableContainer>
    </main>
  );
};
