
import React from 'react';
import { useHackerNews } from '@/hooks/useHackerNews';
import { HackerNewsColumn } from './HackerNewsColumn';
import { DraggableContainer } from './DraggableContainer';
import { DraggableColumn } from './DraggableColumn';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { RotateCcw } from 'lucide-react';

export const HackerNewsSourcePanel = () => {
  const { data: hackerNewsData, isLoading, error } = useHackerNews();

  // Define the default order of columns (using indices as identifiers)
  const defaultColumnOrder = ['0', '1', '2', '3'];
  
  // Use the custom hook for managing column order
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'hackernews-column-order',
    defaultOrder: defaultColumnOrder
  });

  // Group HackerNews posts into 4 columns with 20 posts each, respecting the column order
  const groupedPosts = React.useMemo(() => {
    if (!hackerNewsData) return { '0': [], '1': [], '2': [], '3': [] };
    
    // Take first 80 posts and distribute them into 4 columns of 20 each
    const limitedPosts = hackerNewsData.slice(0, 80);
    const columns: Record<string, typeof hackerNewsData> = { '0': [], '1': [], '2': [], '3': [] };
    
    // Fill each column with 20 posts sequentially
    for (let i = 0; i < limitedPosts.length; i++) {
      const columnIndex = Math.floor(i / 20).toString();
      if (columnIndex in columns) {
        columns[columnIndex].push(limitedPosts[i]);
      }
    }
    
    console.log('HackerNews posts per column:', Object.entries(columns).map(([key, posts]) => `${key}: ${posts.length}`));
    
    return columns;
  }, [hackerNewsData]);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="hackernews-panel"
      aria-label="Hacker News feeds"
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
