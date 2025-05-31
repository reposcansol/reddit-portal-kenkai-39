
import React from 'react';
import { GitHubRepo } from '@/hooks/useGitHub';
import { EnhancedCompactGitHubCard } from '@/components/news/EnhancedCompactGitHubCard';
import { Loader2, AlertCircle } from 'lucide-react';

interface GitHubColumnProps {
  columnIndex: number;
  repos: GitHubRepo[];
  isLoading: boolean;
  error?: string;
}

export const GitHubColumn: React.FC<GitHubColumnProps> = ({
  columnIndex,
  repos,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div 
        className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col h-full shadow-lg shadow-green-400/10 font-mono flex-1 min-w-0 overflow-hidden"
        role="region"
        aria-label={`GitHub column ${columnIndex + 1}`}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-400 mx-auto mb-2" />
            <p className="text-green-400 text-sm font-mono">[LOADING_REPOS]</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col h-full shadow-lg shadow-green-400/10 font-mono flex-1 min-w-0 overflow-hidden"
        role="region"
        aria-label={`GitHub column ${columnIndex + 1}`}
      >
        {/* Column Header */}
        <div className="sticky top-0 bg-black mb-2 pb-2 border-b border-green-400/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-green-400 font-mono">
              [COLUMN_{columnIndex + 1}]
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              0 repos
            </span>
          </div>
        </div>

        {/* Error state */}
        <div className="bg-red-900/20 border border-red-400/30 rounded-none p-2 flex items-center gap-2 mb-2 font-mono flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">[ERROR] {error}</p>
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div 
        className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col h-full shadow-lg shadow-green-400/10 font-mono flex-1 min-w-0 overflow-hidden"
        role="region"
        aria-label={`GitHub column ${columnIndex + 1}`}
      >
        {/* Column Header */}
        <div className="sticky top-0 bg-black mb-2 pb-2 border-b border-green-400/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-green-400 font-mono">
              [COLUMN_{columnIndex + 1}]
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              0 repos
            </span>
          </div>
        </div>

        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-xs font-mono text-center">[NO DATA AVAILABLE]</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-black border border-green-400/30 rounded-none p-3 flex flex-col h-full shadow-lg shadow-green-400/10 font-mono flex-1 min-w-0 overflow-hidden"
      role="region"
      aria-label={`GitHub column ${columnIndex + 1}`}
    >
      {/* Column Header */}
      <div className="sticky top-0 bg-black mb-2 pb-2 border-b border-green-400/20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-green-400 font-mono">
            [COLUMN_{columnIndex + 1}]
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            {repos.length} repos
          </span>
        </div>
      </div>
      
      {/* Repo List with Scrolling */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scroll-smooth max-h-full scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent">
        {repos.map((repo, index) => (
          <EnhancedCompactGitHubCard
            key={repo.id}
            repo={repo}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
