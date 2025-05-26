
import React from 'react';
import { useReddit } from '@/hooks/useReddit';
import { useEnhancedFilter } from '@/hooks/useEnhancedFilter';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { EnhancedCompactArticleCard } from '@/components/news/EnhancedCompactArticleCard';
import { Loader2, RefreshCw } from 'lucide-react';

export const RedditSourcePanel: React.FC = () => {
  const { data: posts, isLoading, error, refetch } = useReddit();
  const { preferences } = useHighlightPreferences();
  const { currentSort } = useSortPreferences();
  
  // Apply enhanced filtering
  const enhancedPosts = useEnhancedFilter(posts || [], {
    categories: preferences.categories,
    enabledCategories: preferences.enabledCategories,
    highlightThreshold: preferences.highlightThreshold,
    primaryKeywords: preferences.primaryKeywords,
    secondaryKeywords: preferences.secondaryKeywords
  });

  // Apply sorting based on current sort preference
  const sortedPosts = React.useMemo(() => {
    if (!enhancedPosts) return [];
    
    const sorted = [...enhancedPosts];
    
    switch (currentSort) {
      case 'newest':
        return sorted.sort((a, b) => b.created_utc - a.created_utc);
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'comments':
        return sorted.sort((a, b) => (b.num_comments || 0) - (a.num_comments || 0));
      case 'relevance':
      default:
        // Already sorted by relevance from useEnhancedFilter
        return sorted;
    }
  }, [enhancedPosts, currentSort]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-400 mb-4">Error loading Reddit posts</div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-green-900/30 text-green-400 border border-green-500 rounded hover:bg-green-900/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-green-400/30">
        <h2 className="text-lg font-bold text-green-400 font-mono">
          [REDDIT_FEED] ({sortedPosts?.length || 0} posts)
        </h2>
        <p className="text-xs text-gray-500 font-mono">
          Sort: {currentSort.toUpperCase()} | Highlighting: {preferences.enableHighlighting ? 'ON' : 'OFF'}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedPosts?.map((post, index) => (
          <EnhancedCompactArticleCard
            key={post.id}
            post={post}
            index={index}
            showHighlighting={preferences.enableHighlighting}
          />
        ))}
      </div>
    </div>
  );
};
