
import React from 'react';
import { ExternalLink, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { HackerNewsPost } from '@/hooks/useHackerNews';

interface HackerNewsCardProps {
  post: HackerNewsPost;
  index: number;
}

export const HackerNewsCard: React.FC<HackerNewsCardProps> = ({ post, index }) => {
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
    if (post.url) {
      window.open(post.url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://news.ycombinator.com/item?id=${post.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 
                 hover:bg-slate-800/80 hover:border-emerald-500/30 hover:scale-[1.02] 
                 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-emerald-900/20"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      onClick={handleClick}
    >
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-slate-100 font-medium leading-tight group-hover:text-emerald-300 transition-colors">
          {post.title}
        </h3>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{post.score}</span>
            </div>
            
            {post.descendants && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.descendants}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTimeAgo(post.time)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">@{post.by}</span>
            <ExternalLink className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
