
import React from 'react';
import { SourceNavigator } from './SourceNavigator';
import { RefreshButton } from '@/components/ui/RefreshButton';
import { HighlightControls } from '@/components/ui/HighlightControls';
import { CategoryManager } from '@/components/ui/CategoryManager';
import { KeywordManager } from '@/components/ui/KeywordManager';
import { SortControls } from '@/components/ui/SortControls';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { Zap } from 'lucide-react';

export const CompactDashboardLayout = () => {
  const { currentSort, setCurrentSort } = useSortPreferences();

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-green-400/30 bg-black backdrop-blur-sm">
        <div className="w-full px-4 py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-none flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-400 tracking-tight font-mono">
                  [AI_NEWS_TERMINAL]
                </h1>
                <p className="text-gray-500 text-xs font-mono">
                  {'>> Accessing neural network feeds...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SortControls 
                currentSort={currentSort} 
                onSortChange={setCurrentSort} 
              />
              <CategoryManager />
              <KeywordManager />
              <HighlightControls />
              <RefreshButton />
            </div>
          </div>
        </div>
      </header>

      {/* Source Navigator with Content - takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <SourceNavigator />
      </div>
    </div>
  );
};
