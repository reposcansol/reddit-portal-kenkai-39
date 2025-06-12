
import React from 'react';
import { RedditPost } from '@/hooks/useReddit';
import { EnhancedCompactArticleCard } from '@/components/news/EnhancedCompactArticleCard';
import { EnhancedPostExtensions } from '@/hooks/useEnhancedFilter';
import { Loader2, AlertCircle } from 'lucide-react';

interface SubredditColumnProps {
  subreddit: string;
  posts: (RedditPost & EnhancedPostExtensions)[];
  isLoading: boolean;
  error?: string;
}

export const SubredditColumn: React.FC<SubredditColumnProps> = ({
  subreddit,
  posts,
  isLoading,
  error
}) => {
  // Get stats for the header
  const totalActivity = posts.reduce((sum, post) => sum + (post.score || 0), 0);
  const totalPosts = posts.length;
  const postsPerDay = Math.round(totalPosts * 24 / 1); // Rough estimate

  // Determine status
  const getStatus = () => {
    if (totalActivity > 1000) return { label: 'Hot', color: 'bg-red-500' };
    if (totalActivity > 500) return { label: 'Trending', color: 'bg-green-500' };
    if (totalActivity > 100) return { label: 'Normal', color: 'bg-blue-500' };
    return { label: 'Quiet', color: 'bg-gray-500' };
  };

  const status = getStatus();

  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col h-full card-hover"
      role="region"
      aria-label={`Posts from r/${subreddit}`}
    >
      {/* Subreddit Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {subreddit.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="font-semibold text-white">r/{subreddit}</h3>
            <span className="text-xs text-slate-400">1h</span>
          </div>
          <span className={`text-xs text-white px-2 py-1 rounded ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-green-400">+{Math.round(totalActivity / totalPosts * 100) || 0}%</span>
              <span className="text-slate-400 ml-1">Activity</span>
            </div>
            <div>
              <span className="text-white font-semibold">{totalActivity.toLocaleString()}</span>
              <span className="text-slate-400 ml-1">Posts/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3 flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">Error loading data</p>
        </div>
      )}

      {/* Article List with Scrolling */}
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 bg-slate-700 rounded-lg animate-pulse">
                <div className="h-4 bg-slate-600 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          posts.map((post, index) => (
            <EnhancedCompactArticleCard 
              key={post.id} 
              post={post} 
              index={index}
            />
          ))
        )}

        {!isLoading && posts.length === 0 && !error && (
          <div className="text-center text-slate-400 text-sm py-8">
            No posts available
          </div>
        )}
      </div>

      {/* Track Feed Button */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
          Track Feed
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
          <span className="ml-2 text-xs text-slate-400">Loading...</span>
        </div>
      )}
    </div>
  );
};
