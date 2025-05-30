
import React from 'react';
import { GitHubRepo } from '@/hooks/useGitHub';
import { EnhancedCompactGitHubCard } from '@/components/news/EnhancedCompactGitHubCard';
import { Loader2 } from 'lucide-react';

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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-400 mx-auto mb-2" />
          <p className="text-green-400 text-sm font-mono">[LOADING_REPOS]</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-sm font-mono">[ERROR]</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm font-mono">[NO_REPOS_FOUND]</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div 
        className="text-xs text-green-400 font-mono mb-3 pb-2 border-b border-green-400/20"
        role="columnheader"
      >
        [COLUMN_{columnIndex + 1}] • {repos.length} repos
      </div>
      
      <div className="space-y-3 h-full overflow-y-auto pr-1">
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
