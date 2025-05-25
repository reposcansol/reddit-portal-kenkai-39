
import React from 'react';
import { HackerNewsPost } from '@/hooks/useHackerNews';
import { CompactHackerNewsCard } from '@/components/news/CompactHackerNewsCard';
import { Loader2, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [showScrollBottom, setShowScrollBottom] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const limitedPosts = React.useMemo(() => {
    return posts.slice(0, 20); // Limit to 20 posts maximum
  }, [posts]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollTop(scrollTop > 10);
      setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [limitedPosts]);

  return (
    <div 
      className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col shadow-lg shadow-green-400/10 font-mono h-[calc(100vh-200px)]"
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
            {limitedPosts.length} posts
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

      {/* Scroll indicator top */}
      {showScrollTop && (
        <div className="flex justify-center py-1 opacity-70 flex-shrink-0">
          <ChevronUp className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
      )}

      {/* Article List with scrolling */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth space-y-1 terminal-scrollbar"
        style={{
          scrollSnapType: 'y mandatory'
        }}
      >
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="p-2 bg-gray-900 border border-green-400/20 rounded-none animate-pulse font-mono min-h-[calc((100vh-300px)/5)]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="h-3 bg-green-400/20 rounded-none mb-2 w-3/4"></div>
                <div className="h-2 bg-green-400/10 rounded-none w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          limitedPosts.map((post, index) => (
            <div
              key={post.id}
              className="min-h-[calc((100vh-300px)/5)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <CompactHackerNewsCard 
                post={post} 
                index={index}
              />
            </div>
          ))
        )}

        {!isLoading && limitedPosts.length === 0 && !error && (
          <div className="text-center text-gray-500 text-xs py-4 font-mono">
            [NO DATA AVAILABLE]
          </div>
        )}
      </div>

      {/* Scroll indicator bottom */}
      {showScrollBottom && (
        <div className="flex justify-center py-1 opacity-70 flex-shrink-0">
          <ChevronDown className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
      )}

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
