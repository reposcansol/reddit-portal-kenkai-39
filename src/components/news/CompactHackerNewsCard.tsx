
import React from 'react';
import { ExternalLink, TrendingUp, MessageSquare } from 'lucide-react';
import { HackerNewsPost } from '@/hooks/useHackerNews';

interface CompactHackerNewsCardProps {
  post: HackerNewsPost;
  index: number;
}

export const CompactHackerNewsCard: React.FC<CompactHackerNewsCardProps> = ({ 
  post, 
  index 
}) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  const handleClick = () => {
    if (post.url) {
      window.open(post.url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://news.ycombinator.com/item?id=${post.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="p-2 bg-gray-900 border border-green-400/30 rounded-none hover:border-green-400 hover:shadow-green-400/20 shadow-lg shadow-green-400/10 transition-all duration-200 cursor-pointer group active:scale-[0.98] font-mono"
      onClick={handleClick}
      tabIndex={0}
      role="article"
      aria-label={`${post.title} by ${post.by}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Title */}
      <h3 className="text-xs md:text-sm text-green-300 font-bold line-clamp-2 leading-tight mb-2 group-hover:text-green-200 transition-colors">
        {post.title}
      </h3>
      
      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-1 text-green-400"
            aria-label={`${post.score} points`}
          >
            <span>[+{post.score}]</span>
          </div>
          
          {post.descendants && (
            <div className="flex items-center gap-1 text-amber-400">
              <span>({post.descendants})</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-400">
            <span>{formatTimeAgo(post.time)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 truncate">
          <span className="text-amber-400 truncate">@{post.by}</span>
          <ExternalLink className="w-3 h-3 group-hover:text-green-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
