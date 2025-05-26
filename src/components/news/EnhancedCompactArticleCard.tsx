
import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';
import { EnhancedPost } from '@/hooks/useEnhancedFilter';
import { Badge } from '@/components/ui/badge';

interface EnhancedCompactArticleCardProps {
  post: RedditPost & EnhancedPost;
  index: number;
  showHighlighting: boolean;
}

export const EnhancedCompactArticleCard: React.FC<EnhancedCompactArticleCardProps> = ({ 
  post, 
  index,
  showHighlighting 
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

  const getHighlightStyles = () => {
    if (!showHighlighting || post.highlightLevel === 'none') {
      return "border-green-400/30 hover:border-green-400";
    }

    switch (post.highlightLevel) {
      case 'high':
        return "border-amber-400 shadow-amber-400/20 bg-amber-900/10 hover:border-amber-300";
      case 'medium':
        return "border-blue-400 shadow-blue-400/20 bg-blue-900/10 hover:border-blue-300";
      case 'low':
        return "border-green-500 shadow-green-500/20 bg-green-900/10 hover:border-green-400";
      default:
        return "border-green-400/30 hover:border-green-400";
    }
  };

  const getRelevanceBadge = () => {
    if (!showHighlighting || post.highlightLevel === 'none') return null;

    const colors = {
      high: 'bg-amber-500 text-amber-900',
      medium: 'bg-blue-500 text-blue-900',
      low: 'bg-green-500 text-green-900'
    };

    return (
      <Badge 
        className={`text-xs font-mono px-1 py-0 ${colors[post.highlightLevel]}`}
      >
        {post.highlightLevel.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div 
      className={`p-2 bg-gray-900 border rounded-none hover:shadow-lg shadow-green-400/10 transition-all duration-200 cursor-pointer group active:scale-[0.98] font-mono ${getHighlightStyles()}`}
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
      {/* Header with relevance indicator */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-xs md:text-sm text-green-300 font-bold line-clamp-2 leading-tight group-hover:text-green-200 transition-colors">
            {post.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showHighlighting && post.relevanceScore > 0 && (
            <Zap className="w-3 h-3 text-amber-400" />
          )}
          {getRelevanceBadge()}
        </div>
      </div>
      
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

      {/* Relevance info */}
      {showHighlighting && post.relevanceScore > 0 && (
        <div className="mt-1 text-xs text-gray-400 font-mono">
          Score: {post.relevanceScore.toFixed(1)}
          {post.matchedCategories.length > 0 && (
            <span className="ml-2">
              Categories: {post.matchedCategories.join(', ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
