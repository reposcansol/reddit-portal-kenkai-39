
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';
import { DraggableContainer } from './DraggableContainer';
import { DraggableColumn } from './DraggableColumn';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';
import { useEnhancedFilter } from '@/hooks/useEnhancedFilter';
import { RotateCcw } from 'lucide-react';

export const RedditSourcePanel = () => {
  const { data: redditData, isLoading, error } = useReddit();
  const { currentSort } = useSortPreferences();
  const { preferences } = useHighlightPreferences();

  // Define the default order of subreddits
  const defaultSubredditOrder = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];
  
  // Use the custom hook for managing column order
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'reddit-column-order',
    defaultOrder: defaultSubredditOrder
  });

  // Apply enhanced filtering to all posts
  const enhancedPosts = useEnhancedFilter(redditData || [], {
    categories: preferences.categories,
    enabledCategories: preferences.enabledCategories,
    highlightThreshold: preferences.highlightThreshold,
    primaryKeywords: preferences.primaryKeywords,
    secondaryKeywords: preferences.secondaryKeywords
  });

  // Group posts by subreddit with case-insensitive matching
  const postsBySubreddit = React.useMemo(() => {
    if (!enhancedPosts) return {};
    
    const grouped = enhancedPosts.reduce((acc, post) => {
      // Normalize subreddit name to lowercase for consistent grouping
      const normalizedSubreddit = post.subreddit.toLowerCase();
      if (!acc[normalizedSubreddit]) {
        acc[normalizedSubreddit] = [];
      }
      acc[normalizedSubreddit].push(post);
      return acc;
    }, {} as Record<string, typeof enhancedPosts>);

    // Apply sorting to each subreddit's posts
    Object.keys(grouped).forEach(subreddit => {
      grouped[subreddit].sort((a, b) => {
        switch (currentSort) {
          case 'newest':
            return b.created_utc - a.created_utc;
          case 'score':
            return (b.score || 0) - (a.score || 0);
          case 'comments':
            return (b.num_comments || 0) - (a.num_comments || 0);
          case 'relevance':
          default:
            return b.relevanceScore - a.relevanceScore;
        }
      });
    });

    return grouped;
  }, [enhancedPosts, currentSort]);

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
