
import React from 'react';
import { useHackerNews } from '@/hooks/useHackerNews';
import { HackerNewsColumn } from './HackerNewsColumn';
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

export const HackerNewsSourcePanel = () => {
  const { data: hackerNewsData, isLoading, error } = useHackerNews();
  const { currentSort, setCurrentSort } = useSortPreferences();
  const { preferences } = useHighlightPreferences();

  // Define the default order of columns (using indices as identifiers)
  const defaultColumnOrder = ['0', '1', '2', '3'];
  
  // Use the custom hook for managing column order
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'hackernews-column-order',
    defaultOrder: defaultColumnOrder
  });

  // Apply enhanced filtering to HackerNews posts
  const enhancedPosts = useEnhancedFilter(hackerNewsData || [], {
    categories: preferences.categories,
    enabledCategories: preferences.enabledCategories,
    highlightThreshold: preferences.highlightThreshold,
    primaryKeywords: preferences.primaryKeywords,
    secondaryKeywords: preferences.secondaryKeywords
  });

  // Group HackerNews posts into 4 columns with sorting applied
  const groupedPosts = React.useMemo(() => {
    console.log('HN: Recalculating groupedPosts with sort:', currentSort);
    console.log('HN: Enhanced posts count:', enhancedPosts?.length || 0);
    console.log('HN: Highlight preferences:', preferences.enableHighlighting);
    
    if (!enhancedPosts || enhancedPosts.length === 0) {
      return { '0': [], '1': [], '2': [], '3': [] };
    }
    
    // First apply sorting to all posts - create completely new array
    const sortedPosts = [...enhancedPosts].sort((a, b) => {
      let result = 0;
      switch (currentSort) {
        case 'newest':
          result = b.time - a.time;
          break;
        case 'score':
          result = (b.score || 0) - (a.score || 0);
          break;
        case 'comments':
          result = (b.descendants || 0) - (a.descendants || 0);
          break;
        case 'relevance':
        default:
          result = b.relevanceScore - a.relevanceScore;
          break;
      }
      return result;
    });
    
    console.log(`HN: Sorted ${sortedPosts.length} posts by ${currentSort}`);
    console.log(`HN: Top 5 post scores:`, 
      sortedPosts.slice(0, 5).map(p => ({ 
        title: p.title.slice(0, 30), 
        score: currentSort === 'score' ? p.score : currentSort === 'comments' ? p.descendants : currentSort === 'newest' ? p.time : p.relevanceScore 
      }))
    );
    
    // Take first 80 posts and distribute them into 4 columns of 20 each
    const limitedPosts = sortedPosts.slice(0, 80);
    const columns: Record<string, typeof enhancedPosts> = { '0': [], '1': [], '2': [], '3': [] };
    
    // Fill each column with 20 posts sequentially
    for (let i = 0; i < limitedPosts.length; i++) {
      const columnIndex = Math.floor(i / 20).toString();
      if (columnIndex in columns && columns[columnIndex].length < 20) {
        columns[columnIndex].push(limitedPosts[i]);
      }
    }
    
    console.log('HN: Posts sorted by', currentSort, 'and distributed to columns');
    console.log('HN: Posts per column:', Object.entries(columns).map(([key, posts]) => `${key}: ${posts.length}`));
    
    return columns;
  }, [enhancedPosts, currentSort, preferences.enableHighlighting]); // Added preferences dependency for highlighting

  // Force re-render key to ensure UI updates
  const renderKey = React.useMemo(() => {
    return `${currentSort}-${preferences.enableHighlighting}-${Date.now()}`;
  }, [currentSort, preferences.enableHighlighting]);

  console.log('HN: Current sort:', currentSort);
  console.log('HN: Highlighting enabled:', preferences.enableHighlighting);
  console.log('HN: Render key:', renderKey);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="hackernews-panel"
      aria-label="Hacker News feeds"
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
        {columnOrder.map((columnId) => (
          <DraggableColumn
            key={`${columnId}-${renderKey}`}
            id={columnId}
            className="w-1/4"
          >
            <HackerNewsColumn
              columnIndex={parseInt(columnId)}
              posts={groupedPosts[columnId] || []}
              isLoading={isLoading}
              error={error?.message}
            />
          </DraggableColumn>
        ))}
      </DraggableContainer>
    </main>
  );
};
