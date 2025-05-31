
import React from 'react';
import { GitHubRepo } from '@/hooks/useGitHub';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedCompactGitHubCardProps {
  repo: GitHubRepo;
  index: number;
}

export const EnhancedCompactGitHubCard: React.FC<EnhancedCompactGitHubCardProps> = ({
  repo,
  index
}) => {
  const formatTimeAgo = (timestamp: string) => {
    const now = Math.floor(Date.now() / 1000);
    const createdTime = Math.floor(new Date(timestamp).getTime() / 1000);
    const diff = now - createdTime;
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  const handleClick = () => {
    window.open(repo.html_url, '_blank', 'noopener,noreferrer');
  };

  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-500 text-gray-100';
    
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-500 text-yellow-900',
      'TypeScript': 'bg-blue-500 text-blue-900',
      'Python': 'bg-green-500 text-green-900',
      'Java': 'bg-orange-500 text-orange-900',
      'C++': 'bg-purple-500 text-purple-900',
      'C': 'bg-gray-600 text-gray-100',
      'C#': 'bg-indigo-500 text-indigo-900',
      'Go': 'bg-cyan-500 text-cyan-900',
      'Rust': 'bg-red-500 text-red-900',
      'PHP': 'bg-violet-500 text-violet-900',
      'Ruby': 'bg-pink-500 text-pink-900',
      'Swift': 'bg-orange-400 text-orange-900',
      'Kotlin': 'bg-purple-400 text-purple-900',
      'Dart': 'bg-blue-400 text-blue-900',
      'Shell': 'bg-emerald-500 text-emerald-900',
      'HTML': 'bg-red-400 text-red-900',
      'CSS': 'bg-blue-600 text-blue-100',
      'Vue': 'bg-green-400 text-green-900',
      'React': 'bg-cyan-400 text-cyan-900'
    };
    
    return colors[language] || 'bg-gray-500 text-gray-100';
  };

  return (
    <div 
      className="p-2 bg-gray-900 border border-green-400/30 rounded-none hover:border-green-400 hover:shadow-green-400/20 shadow-lg shadow-green-400/10 transition-all duration-200 cursor-pointer group active:scale-[0.98] font-mono"
      onClick={handleClick}
      tabIndex={0}
      role="article"
      aria-label={`${repo.name} by ${repo.owner.login}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Header with stars badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-xs md:text-sm text-green-300 font-bold line-clamp-2 leading-tight group-hover:text-green-200 transition-colors">
            {repo.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <Badge 
            className="text-xs font-mono px-1 py-0 bg-amber-500 text-amber-900"
          >
            {repo.stargazers_count.toLocaleString()}★
          </Badge>
        </div>
      </div>

      {/* Description snippet */}
      {repo.description && (
        <p className="text-xs text-gray-400 mb-2 truncate font-mono">
          {repo.description}
        </p>
      )}
      
      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-1 text-green-400"
            aria-label={`${repo.stargazers_count} stars`}
          >
            <span>[+{repo.stargazers_count.toLocaleString()}]</span>
          </div>
          
          <div className="flex items-center gap-1 text-amber-400">
            <span>({repo.forks_count.toLocaleString()})</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-400">
            <span>{formatTimeAgo(repo.created_at)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 truncate">
          <span className="text-amber-400 truncate">@{repo.owner.login}</span>
          <ExternalLink className="w-3 h-3 group-hover:text-green-400 transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Language badge at bottom left */}
      {repo.language && (
        <div className="mt-2 flex items-center justify-start">
          <Badge 
            className={`text-xs font-mono px-2 py-0.5 rounded-full border-0 ${getLanguageColor(repo.language)}`}
          >
            {repo.language}
          </Badge>
        </div>
      )}
    </div>
  );
};
