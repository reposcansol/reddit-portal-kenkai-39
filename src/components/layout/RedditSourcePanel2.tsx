
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';
import { DraggableContainer } from './DraggableContainer';
import { DraggableColumn } from './DraggableColumn';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';
import { useEnhancedFilter } from '@/hooks/useEnhancedFilter';
import { useFilterPreferences } from '@/hooks/useFilterPreferences';
import { usePostFilter } from '@/hooks/usePostFilter';
import { SortControls } from '@/components/ui/SortControls';
import { SubredditManager } from '@/components/ui/SubredditManager';
import { FilterControls } from '@/components/ui/FilterControls';
import { RotateCcw, Loader2 } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';
import { EnhancedPostExtensions } from '@/types/enhancedFilter';

interface RedditSourcePanel2Props {
  subreddits: string[];
  onSubredditsChange: (subreddits: string[]) => void;
}

export const RedditSourcePanel2: React.FC<RedditSourcePanel2Props> = ({
  subreddits,
  onSubredditsChange
}) => {
  console.log('📺 RedditSourcePanel2 rendering with subreddits:', subreddits);
  
  const { data: redditData, isLoading, error, isFetching } = useReddit(subreddits);
  const { currentSort, setCurrentSort } = useSortPreferences();
  const { preferences } = useHighlightPreferences();
  const { preferences: filterPreferences } = useFilterPreferences();

  // Use the custom hook for managing column order with dynamic subreddits
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'reddit-column-order-2',
    defaultOrder: subreddits
  });

  // Update column order when subreddits change
  React.useEffect(() => {
    console.log('📺 RedditSourcePanel2: Updating column order to:', subreddits);
    setColumnOrder(subreddits);
  }, [subreddits, setColumnOrder]);

  // Apply filtering first, then enhanced filtering
  const filteredPosts = usePostFilter(redditData || [], filterPreferences);
  const enhancedPosts = useEnhancedFilter(filteredPosts, {});

  // Group posts by subreddit and apply sorting with force re-calculation
  const postsBySubreddit = React.useMemo(() => {
    console.log('Reddit2: Recalculating postsBySubreddit with sort:', currentSort);
    console.log('Reddit2: Enhanced posts count:', enhancedPosts?.length || 0);
    
    if (!enhancedPosts || enhancedPosts.length === 0) return {};
    
    // Group posts by subreddit
    const grouped = enhancedPosts.reduce((acc, post) => {
      const normalizedSubreddit = post.subreddit!.toLowerCase();
      if (!acc[normalizedSubreddit]) {
        acc[normalizedSubreddit] = [];
      }
      acc[normalizedSubreddit].push(post as RedditPost & EnhancedPostExtensions);
      return acc;
    }, {} as Record<string, (RedditPost & EnhancedPostExtensions)[]>);

    // Apply sorting to each subreddit's posts - create completely new arrays
    Object.keys(grouped).forEach(subreddit => {
      const originalLength = grouped[subreddit].length;
      
      grouped[subreddit] = [...grouped[subreddit]].sort((a, b) => {
        let result = 0;
        switch (currentSort) {
          case 'newest':
            result = (b.created_utc || 0) - (a.created_utc || 0);
            break;
          case 'score':
            result = (b.score || 0) - (a.score || 0);
            break;
          case 'comments':
            result = (b.num_comments || 0) - (a.num_comments || 0);
            break;
          case 'relevance':
          default:
            result = b.relevanceScore - a.relevanceScore;
            break;
        }
        return result;
      });
      
      console.log(`Reddit2: Sorted ${subreddit} posts (${originalLength} items) by ${currentSort}`);
    });

    console.log('Reddit2: Posts grouped and sorted by', currentSort);
    return grouped;
  }, [enhancedPosts, currentSort]);

  // Show loading state when fetching new data for different subreddits
  const isLoadingNewData = isLoading || isFetching;

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="reddit2-panel"
      aria-label="Reddit feeds 2"
    >
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <SortControls 
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
          <FilterControls />
          <SubredditManager 
            subreddits={subreddits}
            onSubredditsChange={onSubredditsChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {isFetching && (
            <div className="flex items-center gap-1 text-green-400 text-xs font-mono">
              <Loader2 className="w-3 h-3 animate-spin" />
              [UPDATING...]
            </div>
          )}
          
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
              isLoading={isLoadingNewData}
              error={error?.message}
            />
          </DraggableColumn>
        ))}
      </DraggableContainer>
    </main>
  );
};
