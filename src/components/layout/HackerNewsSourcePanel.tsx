
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
    enabledCategories: preferences.enabledCategories
  });

  // Group HackerNews posts into 4 columns with sorting applied
  const groupedPosts = React.useMemo(() => {
    console.log('HN: Recalculating groupedPosts with sort:', currentSort);
    console.log('HN: Enhanced posts count:', enhancedPosts?.length || 0);
    
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
    
    // Distribute all available posts into 4 columns
    const columns: Record<string, typeof enhancedPosts> = { '0': [], '1': [], '2': [], '3': [] };
    
    // Distribute posts evenly across columns
    sortedPosts.forEach((post, index) => {
      const columnIndex = (index % 4).toString();
      columns[columnIndex].push(post);
    });
    
    console.log('HN: Posts sorted by', currentSort, 'and distributed to columns');
    console.log('HN: Posts per column:', Object.entries(columns).map(([key, posts]) => `${key}: ${posts.length}`));
    
    return columns;
  }, [enhancedPosts, currentSort]);

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
            key={columnId}
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
