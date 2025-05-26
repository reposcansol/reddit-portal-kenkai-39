import React from 'react';
import { HackerNewsPost } from '@/hooks/useHackerNews';
import { EnhancedCompactHackerNewsCard } from '@/components/news/EnhancedCompactHackerNewsCard';
import { useEnhancedFilter } from '@/hooks/useEnhancedFilter';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';
import { Loader2, AlertCircle } from 'lucide-react';

interface HackerNewsColumnProps {
  columnIndex: number;
  posts: HackerNewsPost[];
  isLoading: boolean;
  error?: string;
}

export const HackerNewsColumn: React.FC<HackerNewsColumnProps> = ({
  columnIndex,
  posts,
  isLoading,
  error
}) => {
  const { preferences } = useHighlightPreferences();
  
  const enhancedPosts = useEnhancedFilter(posts, {
    categories: preferences.categories,
    enabledCategories: preferences.enabledCategories,
    highlightThreshold: preferences.highlightThreshold,
    primaryKeywords: preferences.primaryKeywords,
    secondaryKeywords: preferences.secondaryKeywords
  });

  return (
    <div 
      className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col h-full shadow-lg shadow-green-400/10 font-mono flex-1 min-w-0 overflow-hidden"
      role="region"
      aria-label={`Hacker News column ${columnIndex + 1}`}
    >
      {/* Column Header */}
      <div className="sticky top-0 bg-black mb-2 pb-2 border-b border-green-400/20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-green-400 font-mono">
            [HN_COL_{columnIndex + 1}]
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            {enhancedPosts.length} posts
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-none p-2 flex items-center gap-2 mb-2 font-mono flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">[ERROR] {error}</p>
        </div>
      )}

      {/* Article List with Scrolling */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-2 bg-gray-900 border border-green-400/20 rounded-none animate-pulse font-mono">
                <div className="h-3 bg-green-400/20 rounded-none mb-2 w-3/4"></div>
                <div className="h-2 bg-green-400/10 rounded-none w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          enhancedPosts.map((post, index) => (
            <EnhancedCompactHackerNewsCard 
              key={post.id} 
              post={post} 
              index={index}
              showHighlighting={preferences.enableHighlighting}
            />
          ))
        )}

        {!isLoading && enhancedPosts.length === 0 && !error && (
          <div className="text-center text-gray-500 text-xs py-4 font-mono">
            [NO DATA AVAILABLE]
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-2 flex-shrink-0">
          <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
          <span className="ml-2 text-xs text-green-400 font-mono">[LOADING...]</span>
        </div>
      )}
    </div>
  );
};
