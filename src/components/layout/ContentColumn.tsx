
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ContentColumnProps {
  title: string;
  icon: React.ReactNode;
  isLoading: boolean;
  error?: string;
  count: number;
  children: React.ReactNode;
}

export const ContentColumn: React.FC<ContentColumnProps> = ({
  title,
  icon,
  isLoading,
  error,
  count,
  children
}) => {
  return (
    <div className="space-y-6">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-emerald-400">
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-slate-100">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {count} posts
          </span>
          {isLoading && (
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-3 w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
