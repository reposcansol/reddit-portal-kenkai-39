
import React from 'react';
import { ExternalLink, MessageSquare, TrendingUp, Clock, Hash } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';

interface RedditCardProps {
  post: RedditPost;
  index: number;
}

export const RedditCard: React.FC<RedditCardProps> = ({ post, index }) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'now';
  };

  const handleClick = () => {
    window.open(post.permalink, '_blank', 'noopener,noreferrer');
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 
                 hover:bg-slate-800/80 hover:border-amber-500/30 hover:scale-[1.02] 
                 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-amber-900/20"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      onClick={handleClick}
    >
      <div className="space-y-4">
        {/* Subreddit tag */}
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-medium">r/{post.subreddit}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-slate-100 font-medium leading-tight group-hover:text-amber-300 transition-colors">
          {post.title}
        </h3>
        
        {/* Excerpt if available */}
        {post.selftext && (
          <p className="text-slate-300 text-sm leading-relaxed">
            {truncateText(post.selftext, 120)}
          </p>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{post.score}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.num_comments}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTimeAgo(post.created_utc)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-amber-400">u/{post.author}</span>
            <ExternalLink className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
