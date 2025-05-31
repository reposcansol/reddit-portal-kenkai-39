
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';
import { EnhancedPostExtensions } from '@/hooks/useEnhancedFilter';
import { Badge } from '@/components/ui/badge';

interface EnhancedCompactArticleCardProps {
  post: RedditPost & EnhancedPostExtensions;
  index: number;
}

export const EnhancedCompactArticleCard: React.FC<EnhancedCompactArticleCardProps> = ({ 
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

  // Calculate badge color based on score
  const getBadgeColor = (score: number) => {
    if (score >= 1000) return 'bg-green-500 text-white border-green-500';
    if (score >= 500) return 'bg-green-400 text-white border-green-400';
    if (score >= 200) return 'bg-green-300 text-black border-green-300';
    if (score >= 100) return 'bg-green-200 text-black border-green-200';
    if (score >= 50) return 'bg-green-100 text-black border-green-100';
    return 'bg-gray-200 text-black border-gray-200';
  };

  return (
    <div 
      className="p-2 bg-gray-900 border border-green-400/30 rounded-none hover:border-green-400 hover:shadow-green-400/20 shadow-lg shadow-green-400/10 transition-all duration-200 cursor-pointer group active:scale-[0.98] font-mono relative"
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
      {/* Score Badge */}
      <div className="absolute top-1 right-1">
        <Badge 
          className={`text-xs px-1 py-0 font-mono rounded-full ${getBadgeColor(post.score)}`}
        >
          {post.score >= 1000 ? `${Math.round(post.score / 1000)}k` : post.score}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-xs md:text-sm text-green-300 font-bold line-clamp-2 leading-tight mb-2 group-hover:text-green-200 transition-colors pr-12">
        {post.title}
      </h3>
      
      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-1 text-green-400"
            aria-label={`${post.score} upvotes`}
          >
            <span>[+{post.score}]</span>
          </div>
          
          <div className="flex items-center gap-1 text-amber-400">
            <span>({post.num_comments})</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-400">
            <span>{formatTimeAgo(post.created_utc)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 truncate">
          <span className="text-amber-400 truncate">@{post.author}</span>
          <ExternalLink className="w-3 h-3 group-hover:text-green-400 transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Flair badge at bottom left */}
      {post.link_flair_text && (
        <div className="mt-2 flex items-center justify-start">
          <Badge 
            className="text-xs font-mono px-2 py-0.5 rounded-full border-0"
            style={{
              backgroundColor: post.link_flair_background_color || '#374151',
              color: post.link_flair_text_color || '#d1d5db'
            }}
          >
            {post.link_flair_text}
          </Badge>
        </div>
      )}
    </div>
  );
};
