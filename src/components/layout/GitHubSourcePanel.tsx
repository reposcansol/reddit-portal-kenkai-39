
import React from 'react';
import { useGitHub, GitHubRepo } from '@/hooks/useGitHub';
import { GitHubColumn } from './GitHubColumn';
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
import { PostLike, EnhancedPostExtensions } from '@/types/enhancedFilter';

// Type for enhanced GitHub repos
type EnhancedGitHubRepo = GitHubRepo & EnhancedPostExtensions;

export const GitHubSourcePanel = () => {
  const { data: githubData, isLoading, error } = useGitHub();
  const { currentSort, setCurrentSort } = useSortPreferences();
  const { preferences } = useHighlightPreferences();

  // Define the default order of columns (using indices as identifiers)
  const defaultColumnOrder = ['0', '1', '2', '3'];
  
  // Use the custom hook for managing column order
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'github-column-order',
    defaultOrder: defaultColumnOrder
  });

  // Convert GitHub repos to PostLike format for enhanced filtering
  const reposAsPostLike = React.useMemo(() => {
    if (!githubData) return [];
    
    return githubData.map(repo => ({
      ...repo,
      title: repo.name, // Map name to title for PostLike interface
      selftext: repo.description || '', // Map description to selftext
      score: repo.stargazers_count // Map stars to score
    })) as (PostLike & GitHubRepo)[];
  }, [githubData]);

  // Apply enhanced filtering to GitHub repos
  const enhancedRepos = useEnhancedFilter(reposAsPostLike, {
    categories: preferences.categories,
    enabledCategories: preferences.enabledCategories,
    highlightThreshold: preferences.highlightThreshold,
    primaryKeywords: preferences.primaryKeywords,
    secondaryKeywords: preferences.secondaryKeywords
  }) as EnhancedGitHubRepo[];

  // Group GitHub repos into 4 columns with sorting applied
  const groupedRepos = React.useMemo(() => {
    console.log('GitHub: Recalculating groupedRepos with sort:', currentSort);
    console.log('GitHub: Enhanced repos count:', enhancedRepos?.length || 0);
    
    if (!enhancedRepos || enhancedRepos.length === 0) {
      return { '0': [], '1': [], '2': [], '3': [] };
    }
    
    // First apply sorting to all repos
    const sortedRepos = [...enhancedRepos].sort((a, b) => {
      let result = 0;
      switch (currentSort) {
        case 'newest':
          result = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'score':
          result = b.stargazers_count - a.stargazers_count;
          break;
        case 'comments':
          result = b.forks_count - a.forks_count;
          break;
        case 'relevance':
        default:
          result = b.relevanceScore - a.relevanceScore;
          break;
      }
      return result;
    });
    
    console.log(`GitHub: Sorted ${sortedRepos.length} repos by ${currentSort}`);
    
    // Distribute repos into 4 columns
    const columns: Record<string, EnhancedGitHubRepo[]> = { '0': [], '1': [], '2': [], '3': [] };
    
    sortedRepos.forEach((repo, index) => {
      const columnIndex = (index % 4).toString();
      columns[columnIndex].push(repo);
    });
    
    console.log('GitHub: Repos distributed to columns:', Object.entries(columns).map(([key, repos]) => `${key}: ${repos.length}`));
    
    return columns;
  }, [enhancedRepos, currentSort]);

  // Force re-render key to ensure UI updates
  const renderKey = React.useMemo(() => {
    return `${currentSort}-${preferences.enableHighlighting}-${Date.now()}`;
  }, [currentSort, preferences.enableHighlighting]);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="github-panel"
      aria-label="GitHub trending repositories"
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
            <GitHubColumn
              columnIndex={parseInt(columnId)}
              repos={groupedRepos[columnId] || []}
              isLoading={isLoading}
              error={error?.message}
            />
          </DraggableColumn>
        ))}
      </DraggableContainer>
    </main>
  );
};
