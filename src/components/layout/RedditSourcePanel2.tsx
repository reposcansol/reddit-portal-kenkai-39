import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { SubredditColumn } from './SubredditColumn';
import { DraggableContainer } from './DraggableContainer';
import { DraggableColumn } from './DraggableColumn';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { useSortPreferences } from '@/hooks/useSortPreferences';
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
  const { data: redditData, isLoading, error, isFetching } = useReddit(subreddits, 'panel2');
  const { currentSort, setCurrentSort } = useSortPreferences();
  const { preferences: filterPreferences } = useFilterPreferences();

  console.log('📊 [REDDIT_PANEL2] Rendering with filter preferences:', filterPreferences);

  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'reddit-column-order-2',
    defaultOrder: subreddits
  });

  React.useEffect(() => {
    setColumnOrder(subreddits);
  }, [subreddits, setColumnOrder]);

  const filteredPosts = usePostFilter(redditData || [], filterPreferences);
  const enhancedPosts = useEnhancedFilter(filteredPosts, {});

  console.log('📊 [REDDIT_PANEL2] Raw posts:', redditData?.length || 0);
  console.log('📊 [REDDIT_PANEL2] Filtered posts:', filteredPosts?.length || 0);
  console.log('📊 [REDDIT_PANEL2] Enhanced posts:', enhancedPosts?.length || 0);

  const postsBySubreddit = React.useMemo(() => {
    if (!enhancedPosts || enhancedPosts.length === 0) return {};
    
    const grouped = enhancedPosts.reduce((acc, post) => {
      const normalizedSubreddit = post.subreddit!.toLowerCase();
      if (!acc[normalizedSubreddit]) {
        acc[normalizedSubreddit] = [];
      }
      acc[normalizedSubreddit].push(post as RedditPost & EnhancedPostExtensions);
      return acc;
    }, {} as Record<string, (RedditPost & EnhancedPostExtensions)[]>);

    Object.keys(grouped).forEach(subreddit => {
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
          default:
            result = (b.score || 0) - (a.score || 0);
            break;
        }
        return result;
      });
    });

    console.log('📊 [REDDIT_PANEL2] Posts by subreddit:', Object.keys(grouped).reduce((acc, key) => ({
      ...acc,
      [key]: grouped[key].length
    }), {}));

    return grouped;
  }, [enhancedPosts, currentSort]);

  const isLoadingNewData = isLoading || isFetching;

  return (
    <main 
      className="p-4 min-h-screen flex flex-col"
      role="tabpanel"
      id="reddit2-panel"
      aria-label="Reddit feeds 2"
    >
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
        className="flex gap-4 flex-1 overflow-x-auto pb-8"
      >
        {columnOrder.map((subreddit) => (
          <DraggableColumn
            key={subreddit}
            id={subreddit}
            className="w-1/4 min-w-[300px] min-h-full"
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
