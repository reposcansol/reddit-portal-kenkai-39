
import React from 'react';
import { RedditPost } from '@/hooks/useReddit';
import { CompactArticleCard } from '@/components/news/CompactArticleCard';
import { Loader2, AlertCircle, Hash } from 'lucide-react';

interface SubredditColumnProps {
  subreddit: string;
  posts: RedditPost[];
  isLoading: boolean;
  error?: string;
}

export const SubredditColumn: React.FC<SubredditColumnProps> = ({
  subreddit,
  posts,
  isLoading,
  error
}) => {
  const sortedPosts = React.useMemo(() => {
    return posts
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [posts]);

  return (
    <div 
      className="bg-card rounded-lg border p-3 flex flex-col h-full"
      role="region"
      aria-label={`Posts from r/${subreddit}`}
    >
      {/* Subreddit Header */}
      <div className="sticky top-0 bg-card mb-2 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-foreground">
            r/{subreddit}
          </h2>
          <span className="text-xs text-muted-foreground ml-auto">
            {sortedPosts.length} posts
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-destructive text-xs">{error}</p>
        </div>
      )}

      {/* Article List */}
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-2 border rounded animate-pulse">
                <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          sortedPosts.map((post, index) => (
            <CompactArticleCard 
              key={post.id} 
              post={post} 
              index={index}
            />
          ))
        )}

        {!isLoading && sortedPosts.length === 0 && !error && (
          <div className="text-center text-muted-foreground text-xs py-4">
            No posts available
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
        </div>
      )}
    </div>
  );
};
