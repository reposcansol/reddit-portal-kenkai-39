
import React from 'react';

type NewsSource = 'reddit' | 'reddit2';

interface SourceTabsProps {
  activeSource: NewsSource;
  onSourceChange: (source: NewsSource) => void;
}

export const SourceTabs: React.FC<SourceTabsProps> = ({ 
  activeSource, 
  onSourceChange 
}) => {
  const tabs = [
    {
      id: 'reddit' as NewsSource,
      label: 'Subreddit Monitor',
      badge: 'LIVE',
      feedCount: '6 active feeds'
    },
    {
      id: 'reddit2' as NewsSource,
      label: 'Analytics',
      badge: '',
      feedCount: 'Community insights'
    }
  ];

  return (
    <div className="w-full px-6 py-4 bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = activeSource === tab.id;
            
            return (
              <button
                key={tab.id}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
                onClick={() => onSourceChange(tab.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-500">{tab.feedCount}</span>
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-800 px-3 py-1 rounded text-sm font-medium">
            Sort: Activity
          </button>
          <button className="bg-slate-700 text-white px-3 py-1 rounded text-sm">
            Filters
          </button>
          <button className="bg-slate-700 text-white px-3 py-1 rounded text-sm">
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
