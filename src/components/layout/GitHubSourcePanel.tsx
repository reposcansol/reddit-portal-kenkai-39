
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
import { CategoryManager } from '@/components/ui/CategoryManager';
import { RotateCcw } from 'lucide-react';
import { PostLike, EnhancedPostExtensions } from '@/types/enhancedFilter';

// Type for enhanced GitHub repos
type EnhancedGitHubRepo = GitHubRepo & EnhancedPostExtensions;

// Language mapping for columns
const LANGUAGE_COLUMNS = {
  'python': { id: 'python', name: 'Python', index: 0 },
  'javascript': { id: 'javascript', name: 'JavaScript', index: 1 },
  'typescript': { id: 'typescript', name: 'TypeScript', index: 2 },
  'rust': { id: 'rust', name: 'Rust', index: 3 }
};

export const GitHubSourcePanel = () => {
  const { data: githubData, isLoading, error } = useGitHub();
  const { currentSort, setCurrentSort } = useSortPreferences();
  const { preferences } = useHighlightPreferences();

  // Define the default order of columns (using language IDs as identifiers)
  const defaultColumnOrder = ['python', 'javascript', 'typescript', 'rust'];
  
  // Use the custom hook for managing column order
  const { columnOrder, setColumnOrder, resetOrder } = useColumnOrder({
    storageKey: 'github-language-column-order',
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
    enabledCategories: preferences.enabledCategories
  }) as EnhancedGitHubRepo[];

  // Group GitHub repos by language with sorting applied
  const groupedRepos = React.useMemo(() => {
    console.log('GitHub: Recalculating groupedRepos by language with sort:', currentSort);
    console.log('GitHub: Enhanced repos count:', enhancedRepos?.length || 0);
    
    if (!enhancedRepos || enhancedRepos.length === 0) {
      return { python: [], javascript: [], typescript: [], rust: [] };
    }
    
    // First filter and group repos by language
    const reposByLanguage: Record<string, EnhancedGitHubRepo[]> = {
      python: [],
      javascript: [],
      typescript: [],
      rust: []
    };
    
    enhancedRepos.forEach(repo => {
      const language = repo.language?.toLowerCase();
      if (language === 'python') {
        reposByLanguage.python.push(repo);
      } else if (language === 'javascript') {
        reposByLanguage.javascript.push(repo);
      } else if (language === 'typescript') {
        reposByLanguage.typescript.push(repo);
      } else if (language === 'rust') {
        reposByLanguage.rust.push(repo);
      }
    });
    
    // Apply sorting to each language group
    Object.keys(reposByLanguage).forEach(language => {
      reposByLanguage[language].sort((a, b) => {
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
    });
    
    console.log(`GitHub: Repos grouped by language:`, Object.entries(reposByLanguage).map(([lang, repos]) => `${lang}: ${repos.length}`));
    
    return reposByLanguage;
  }, [enhancedRepos, currentSort]);

  return (
    <main 
      className="p-4 h-full flex flex-col overflow-hidden"
      role="tabpanel"
      id="github-panel"
      aria-label="GitHub trending repositories by language"
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
        {columnOrder.map((languageId) => {
          const languageInfo = LANGUAGE_COLUMNS[languageId as keyof typeof LANGUAGE_COLUMNS];
          return (
            <DraggableColumn
              key={languageId}
              id={languageId}
              className="flex-1 min-w-0"
            >
              <GitHubColumn
                columnIndex={languageInfo.index}
                repos={groupedRepos[languageId] || []}
                isLoading={isLoading}
                error={error?.message}
                languageName={languageInfo.name}
              />
            </DraggableColumn>
          );
        })}
      </DraggableContainer>
    </main>
  );
};
