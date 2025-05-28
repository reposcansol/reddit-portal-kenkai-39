
import React from 'react';
import { ExternalLink, Zap, Tag } from 'lucide-react';
import { RedditPost } from '@/hooks/useReddit';
import { EnhancedPostExtensions } from '@/hooks/useEnhancedFilter';
import { Badge } from '@/components/ui/badge';

interface EnhancedCompactArticleCardProps {
  post: RedditPost & EnhancedPostExtensions;
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
    if (!showHighlighting || post.relevancePercentage < 20) {
      return "border-green-400/30 hover:border-green-400";
    }

    if (post.relevancePercentage >= 75) {
      return "border-amber-400 shadow-amber-400/20 bg-amber-900/10 hover:border-amber-300";
    } else if (post.relevancePercentage >= 50) {
      return "border-blue-400 shadow-blue-400/20 bg-blue-900/10 hover:border-blue-300";
    } else {
      return "border-green-500 shadow-green-500/20 bg-green-900/10 hover:border-green-400";
    }
  };

  const getRelevanceBadge = () => {
    // Always show percentage badge, even for scores below 20%
    const colors = post.relevancePercentage >= 75
      ? 'bg-amber-500 text-amber-900'
      : post.relevancePercentage >= 50
      ? 'bg-blue-500 text-blue-900'
      : post.relevancePercentage >= 20
      ? 'bg-green-500 text-green-900'
      : 'bg-gray-500 text-gray-900';

    return (
      <Badge 
        className={`text-xs font-mono px-1 py-0 ${colors}`}
      >
        {post.relevancePercentage}%
      </Badge>
    );
  };

  // Function to determine if a color is light or dark
  const isLightColor = (hexColor: string): boolean => {
    if (!hexColor || hexColor === 'transparent') return false;
    
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance using standard formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return true if light (luminance > 0.5)
    return luminance > 0.5;
  };

  const getFlairBadge = () => {
    if (!post.link_flair_text) return null;

    const backgroundColor = post.link_flair_background_color || '#374151';
    
    // Determine appropriate text color based on background brightness
    let textColor = post.link_flair_text_color || '#ffffff';
    
    // Override text color if the background is light but text is also light
    if (isLightColor(backgroundColor) && (textColor === '#ffffff' || textColor === 'white' || isLightColor(textColor))) {
      textColor = '#000000';
    }
    // Override text color if the background is dark but text is also dark
    else if (!isLightColor(backgroundColor) && (textColor === '#000000' || textColor === 'black' || !isLightColor(textColor))) {
      textColor = '#ffffff';
    }

    const flairStyle = {
      backgroundColor,
      color: textColor
    };

    return (
      <Badge 
        className="text-xs font-mono px-2 py-0.5 border-0 inline-flex items-center"
        style={flairStyle}
      >
        <Tag className="w-2 h-2 mr-1" />
        {post.link_flair_text}
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
          {showHighlighting && post.relevancePercentage > 0 && (
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

      {/* Flair row at bottom left */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {getFlairBadge()}
          {post.author_flair_text && (
            <Badge className="text-xs font-mono px-1.5 py-0.5 bg-purple-600 text-purple-100 inline-flex items-center">
              {post.author_flair_text}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
