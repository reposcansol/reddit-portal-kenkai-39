
import React from 'react';
import { GitHubRepo } from '@/hooks/useGitHub';
import { GitFork, Code, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedCompactGitHubCardProps {
  repo: GitHubRepo;
  index: number;
}

export const EnhancedCompactGitHubCard: React.FC<EnhancedCompactGitHubCardProps> = ({
  repo,
  index
}) => {
  const timeAgo = formatDistanceToNow(new Date(repo.created_at), { addSuffix: true });

  const handleCardClick = () => {
    window.open(repo.html_url, '_blank', 'noopener,noreferrer');
  };

  const handleOwnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(repo.owner.html_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article 
      className="bg-black border border-green-500/30 p-3 hover:border-green-400/50 
                 transition-all duration-200 cursor-pointer group relative overflow-hidden"
      onClick={handleCardClick}
      role="article"
      aria-label={`GitHub repository: ${repo.full_name}`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      {/* Header with title and badges */}
      <div className="flex items-start justify-between mb-2 relative z-10">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="text-green-300 font-mono text-sm font-semibold mb-1 line-clamp-2 leading-tight">
            {repo.name}
          </h3>
          <button
            onClick={handleOwnerClick}
            className="text-gray-400 text-xs hover:text-green-400 transition-colors font-mono block"
          >
            @{repo.owner.login}
          </button>
        </div>
        
        {/* Stars badge in top right */}
        <div className="flex-shrink-0">
          <Badge 
            variant="outline" 
            className="text-xs border-green-400/30 text-green-400 bg-green-400/10 font-mono"
          >
            ★ {repo.stargazers_count.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-gray-300 text-xs mb-3 line-clamp-3 leading-relaxed relative z-10">
          {repo.description}
        </p>
      )}

      {/* Language and Topics */}
      <div className="mb-3 relative z-10">
        {repo.language && (
          <div className="flex items-center gap-1 mb-2">
            <Code className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400 text-xs font-mono">{repo.language}</span>
          </div>
        )}
        
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-xs bg-green-900/20 text-green-400 px-1.5 py-0.5 font-mono border border-green-400/20"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-xs text-gray-500 font-mono">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer with metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            <span className="font-mono">{repo.forks_count.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
    </article>
  );
};
