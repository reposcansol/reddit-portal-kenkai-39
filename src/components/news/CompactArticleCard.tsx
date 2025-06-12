
import React from 'react';
import { ExternalLink, TrendingUp, MessageSquare, Clock } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';

interface CompactArticleCardProps {
  post: RedditPost;
  index: number;
}

export const CompactArticleCard: React.FC<CompactArticleCardProps> = ({ 
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
    window.open(`https://reddit.com${post.permalink}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="p-3 bg-slate-700 hover:bg-slate-650 rounded-lg transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
      tabIndex={0}
      role="article"
      aria-label={`${post.title} by ${post.author}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Title */}
      <h4 className="text-sm text-white font-medium line-clamp-2 leading-tight mb-2 group-hover:text-orange-200 transition-colors">
        {post.title}
      </h4>
      
      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-1 text-orange-400"
            aria-label={`${post.score} upvotes`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{post.score}</span>
          </div>
          
          <div className="flex items-center gap-1 text-blue-400">
            <MessageSquare className="w-3 h-3" />
            <span>{post.num_comments}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(post.created_utc)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 truncate">
          <span className="text-slate-400 truncate text-xs">u/{post.author}</span>
          <ExternalLink className="w-3 h-3 group-hover:text-orange-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
