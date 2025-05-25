
import React from 'react';
import { HackerNewsPost } from '@/hooks/useHackerNews';
import { CompactHackerNewsCard } from '@/components/news/CompactHackerNewsCard';
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
  return (
    <div 
      className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col h-full shadow-lg shadow-green-400/10 font-mono"
      role="region"
      aria-label={`Hacker News column ${columnIndex + 1}`}
    >
      {/* Column Header */}
      <div className="sticky top-0 bg-black mb-2 pb-2 border-b border-green-400/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-green-400 font-mono">
            [HN_COL_{columnIndex + 1}]
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            {posts.length} posts
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-none p-2 flex items-center gap-2 mb-2 font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">[ERROR] {error}</p>
        </div>
      )}

      {/* Article List */}
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-2 bg-gray-900 border border-green-400/20 rounded-none animate-pulse font-mono">
                <div className="h-3 bg-green-400/20 rounded-none mb-2 w-3/4"></div>
                <div className="h-2 bg-green-400/10 rounded-none w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          posts.map((post, index) => (
            <CompactHackerNewsCard 
              key={post.id} 
              post={post} 
              index={index}
            />
          ))
        )}

        {!isLoading && posts.length === 0 && !error && (
          <div className="text-center text-gray-500 text-xs py-4 font-mono">
            [NO DATA AVAILABLE]
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
          <span className="ml-2 text-xs text-green-400 font-mono">[LOADING...]</span>
        </div>
      )}
    </div>
  );
};
