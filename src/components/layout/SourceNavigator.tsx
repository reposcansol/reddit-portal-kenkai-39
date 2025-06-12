
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SourceTabs } from './SourceTabs';
import { RedditSourcePanel } from './RedditSourcePanel';
import { RedditSourcePanel2 } from './RedditSourcePanel2';
import { useSubreddits } from '@/contexts/SubredditContext';
import { useSubreddits2 } from '@/contexts/SubredditContext2';

type NewsSource = 'reddit' | 'reddit2';

export const SourceNavigator = () => {
  const [activeSource, setActiveSource] = useState<NewsSource>('reddit');
  const { subreddits, updateSubreddits } = useSubreddits();
  const { subreddits: subreddits2, updateSubreddits: updateSubreddits2 } = useSubreddits2();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  console.log('🧭 [NAVIGATOR] SourceNavigator rendering with subreddits1:', subreddits);
  console.log('🧭 [NAVIGATOR] SourceNavigator rendering with subreddits2:', subreddits2);
  console.log('🧭 [NAVIGATOR] Render timestamp:', new Date().toISOString());
  console.log('🧭 [NAVIGATOR] Subreddits1 length:', subreddits.length);
  console.log('🧭 [NAVIGATOR] Subreddits2 length:', subreddits2.length);

  // Track whenever subreddits change in the navigator
  React.useEffect(() => {
    console.log('🧭 [NAVIGATOR] Subreddits1 changed in Navigator:', subreddits);
    console.log('🧭 [NAVIGATOR] Change timestamp:', new Date().toISOString());
  }, [subreddits]);

  React.useEffect(() => {
    console.log('🧭 [NAVIGATOR] Subreddits2 changed in Navigator:', subreddits2);
    console.log('🧭 [NAVIGATOR] Change timestamp:', new Date().toISOString());
  }, [subreddits2]);

  const handleSourceChange = (source: NewsSource) => {
    console.log('🧭 [NAVIGATOR] Source changing to:', source);
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
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Source Navigation Tabs */}
      <div className="flex-shrink-0 bg-slate-900 border-b border-slate-700">
        <SourceTabs 
          activeSource={activeSource} 
          onSourceChange={handleSourceChange} 
        />
      </div>

      {/* Content Container with Horizontal Scroll - takes remaining height */}
      <div className="flex-1 relative">
        {/* Scroll Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-green-500 text-black rounded p-2 hover:bg-green-400 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-green-500 text-black rounded p-2 hover:bg-green-400 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide min-h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Reddit Source Panel 1 */}
          <div 
            data-source="reddit"
            className="min-w-full snap-start min-h-full"
          >
            <RedditSourcePanel 
              subreddits={subreddits}
              onSubredditsChange={updateSubreddits}
            />
          </div>

          {/* Reddit Source Panel 2 */}
          <div 
            data-source="reddit2"
            className="min-w-full snap-start min-h-full"
          >
            <RedditSourcePanel2 
              subreddits={subreddits2}
              onSubredditsChange={updateSubreddits2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
