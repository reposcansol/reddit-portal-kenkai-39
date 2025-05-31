
import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
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

  // Function to determine if a color is light or dark
  const isLightColor = (hexColor: string): boolean => {
    if (!hexColor || hexColor === 'transparent' || hexColor === '') return false;
    
    // Handle different color formats
    let hex = hexColor;
    
    // Remove # if present
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }
    
    // Handle 3-digit hex codes
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Must be 6 digits for valid hex
    if (hex.length !== 6) return false;
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Check if values are valid
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    
    // Calculate luminance using standard formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return true if light (luminance > 0.5)
    return luminance > 0.5;
  };

  const getFlairBadge = () => {
    if (!post.link_flair_text) return null;

    const backgroundColor = post.link_flair_background_color || '#374151';
    
    // Simple rule: if background is light, use black text. If dark, use white text.
    const isBackgroundLight = isLightColor(backgroundColor);
    const textColor = isBackgroundLight ? '#000000' : '#ffffff';

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
      className="p-2 bg-gray-900 border border-green-400/30 rounded-none hover:shadow-lg shadow-green-400/10 transition-all duration-200 cursor-pointer group active:scale-[0.98] font-mono hover:border-green-400"
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
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-xs md:text-sm text-green-300 font-bold line-clamp-2 leading-tight group-hover:text-green-200 transition-colors">
            {post.title}
          </h3>
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
