
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
    window.open(post.permalink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="p-2 border rounded hover:bg-accent transition-colors cursor-pointer group"
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
      <h3 className="text-xs md:text-sm font-medium line-clamp-2 leading-tight mb-1 group-hover:text-amber-600 transition-colors">
        {post.title}
      </h3>
      
      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center gap-1"
            aria-label={`${post.score} upvotes`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{post.score}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{post.num_comments}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(post.created_utc)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 truncate">
          <span className="text-amber-600 truncate">u/{post.author}</span>
          <ExternalLink className="w-3 h-3 group-hover:text-amber-600 transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
