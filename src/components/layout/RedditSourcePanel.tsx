
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
import { SubredditManager } from '@/components/ui/SubredditManager';
import { RotateCcw } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';
import { EnhancedPostExtensions } from '@/types/enhancedFilter';

interface RedditSourcePanelProps {
  subreddits: string[];
  onSubredditsChange: (subreddits: string[]) => void;
}

export const RedditSourcePanel: React.FC<RedditSourcePanelProps> = ({
  subreddits,
  onSubredditsChange
}) => {
  const { data: redditData, isLoading, error } = useReddit(subreddits);
  const { currentSort, setCurrentSort } = useSortPreferences();
  const { preferences } = useHighlightPreferences();

  // Use the custom hook for managing column order with dynamic subreddits
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'reddit-column-order',
    defaultOrder: subreddits
  });

  // Update column order when subreddits change
  React.useEffect(() => {
    setColumnOrder(subreddits);
  }, [subreddits, setColumnOrder]);

  // Apply enhanced filtering to all posts
  const enhancedPosts = useEnhancedFilter(redditData || [], {
    categories: preferences.categories,
    enabledCategories: preferences.enabledCategories,
    highlightThreshold: preferences.highlightThreshold,
    primaryKeywords: preferences.primaryKeywords,
    secondaryKeywords: preferences.secondaryKeywords
  });

  // Group posts by subreddit and apply sorting with force re-calculation
  const postsBySubreddit = React.useMemo(() => {
    console.log('Reddit: Recalculating postsBySubreddit with sort:', currentSort);
    console.log('Reddit: Enhanced posts count:', enhancedPosts?.length || 0);
    console.log('Reddit: Highlight preferences:', preferences.enableHighlighting);
    
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
      
      console.log(`Reddit: Sorted ${subreddit} posts (${originalLength} items) by ${currentSort}`);
      console.log(`Reddit: First 3 ${subreddit} post scores:`, 
        grouped[subreddit].slice(0, 3).map(p => ({ 
          title: p.title.slice(0, 30), 
          score: currentSort === 'score' ? p.score : currentSort === 'comments' ? p.num_comments : currentSort === 'newest' ? p.created_utc : p.relevanceScore 
        }))
      );
    });

    console.log('Reddit: Posts grouped and sorted by', currentSort);
    return grouped;
  }, [enhancedPosts, currentSort, preferences.enableHighlighting]); // Added preferences dependency for highlighting

  // Force re-render key to ensure UI updates
  const renderKey = React.useMemo(() => {
    return `${currentSort}-${preferences.enableHighlighting}-${subreddits.join(',')}-${Date.now()}`;
  }, [currentSort, preferences.enableHighlighting, subreddits]);

  console.log('Reddit: Current sort:', currentSort);
  console.log('Reddit: Posts by subreddit keys:', Object.keys(postsBySubreddit));
  console.log('Reddit: Highlighting enabled:', preferences.enableHighlighting);
  console.log('Reddit: Active subreddits:', subreddits);
  console.log('Reddit: Render key:', renderKey);

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
          <SubredditManager 
            subreddits={subreddits}
            onSubredditsChange={onSubredditsChange}
          />
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
            key={`${subreddit}-${renderKey}`}
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
