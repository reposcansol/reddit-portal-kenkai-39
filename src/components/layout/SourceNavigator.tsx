
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SourceTabs } from './SourceTabs';
import { RedditSourcePanel } from './RedditSourcePanel';
import { HackerNewsSourcePanel } from './HackerNewsSourcePanel';
import { useSubreddits } from '@/contexts/SubredditContext';

type NewsSource = 'reddit' | 'hackernews';

export const SourceNavigator = () => {
  const [activeSource, setActiveSource] = useState<NewsSource>('reddit');
  const { subreddits, updateSubreddits } = useSubreddits();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  console.log('🧭 SourceNavigator rendering with subreddits:', subreddits);

  const handleSourceChange = (source: NewsSource) => {
    setActiveSource(source);
    
    if (scrollContainerRef.current) {
      const targetPanel = scrollContainerRef.current.querySelector(
        `[data-source="${source}"]`
      ) as HTMLElement;
      
      if (targetPanel) {
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full bg-black flex flex-col overflow-hidden">
      {/* Source Navigation Tabs */}
      <div className="flex-shrink-0 bg-black border-b border-green-400/30">
        <SourceTabs 
          activeSource={activeSource} 
          onSourceChange={handleSourceChange} 
        />
      </div>

      {/* Content Container with Horizontal Scroll - takes remaining height */}
      <div className="flex-1 relative overflow-hidden">
        {/* Scroll Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 border border-green-400/50 rounded-none p-2 hover:border-green-400 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-green-400" />
        </button>
        
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 border border-green-400/50 rounded-none p-2 hover:border-green-400 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-green-400" />
        </button>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Reddit Source Panel */}
          <div 
            data-source="reddit"
            className="min-w-full snap-start h-full"
          >
            <RedditSourcePanel 
              subreddits={subreddits}
              onSubredditsChange={updateSubreddits}
            />
          </div>

          {/* HackerNews Source Panel */}
          <div 
            data-source="hackernews"
            className="min-w-full snap-start h-full"
          >
            <HackerNewsSourcePanel />
          </div>
        </div>
      </div>
    </div>
  );
};
