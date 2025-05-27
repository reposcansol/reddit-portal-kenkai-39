
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';
import { DraggableContainer } from './DraggableContainer';
import { DraggableColumn } from './DraggableColumn';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';
import { useEnhancedFilter } from '@/hooks/useEnhancedFilter';
import { SortControls } from '@/components/ui/SortControls';
import { HighlightControls } from '@/components/ui/HighlightControls';
import { KeywordManager } from '@/components/ui/KeywordManager';
import { CategoryManager } from '@/components/ui/CategoryManager';
import { RotateCcw } from 'lucide-react';

export const RedditSourcePanel = () => {
  const { data: redditData, isLoading, error } = useReddit();
  const { currentSort, setCurrentSort } = useSortPreferences();
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

  // Group posts by subreddit and apply sorting
  const postsBySubreddit = React.useMemo(() => {
    console.log('Reddit: Recalculating postsBySubreddit with sort:', currentSort);
    
    if (!enhancedPosts || enhancedPosts.length === 0) return {};
    
    // Group posts by subreddit
    const grouped = enhancedPosts.reduce((acc, post) => {
      const normalizedSubreddit = post.subreddit.toLowerCase();
      if (!acc[normalizedSubreddit]) {
        acc[normalizedSubreddit] = [];
      }
      acc[normalizedSubreddit].push(post);
      return acc;
    }, {} as Record<string, typeof enhancedPosts>);

    // Apply sorting to each subreddit's posts
    Object.keys(grouped).forEach(subreddit => {
      grouped[subreddit] = grouped[subreddit].sort((a, b) => {
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

    console.log('Reddit: Posts grouped and sorted by', currentSort);
    return grouped;
  }, [enhancedPosts, currentSort]);

  // Force component re-render when sort changes by using a counter
  const [sortChangeCounter, setSortChangeCounter] = React.useState(0);
  const previousSort = React.useRef(currentSort);
  
  React.useEffect(() => {
    if (previousSort.current !== currentSort) {
      console.log('Reddit: Sort changed from', previousSort.current, 'to', currentSort);
      setSortChangeCounter(prev => prev + 1);
      previousSort.current = currentSort;
    }
  }, [currentSort]);

  console.log('Reddit: Current sort:', currentSort);
  console.log('Reddit: Posts by subreddit keys:', Object.keys(postsBySubreddit));
  console.log('Reddit: Sort change counter:', sortChangeCounter);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="reddit-panel"
      aria-label="Reddit feeds"
    >
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <SortControls 
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
          <HighlightControls />
          <KeywordManager />
          <CategoryManager />
        </div>
        
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
            key={`${subreddit}-${sortChangeCounter}`}
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
