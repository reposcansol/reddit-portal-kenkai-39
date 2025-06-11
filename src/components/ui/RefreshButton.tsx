
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export const RefreshButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  // Set initial last refreshed time when component mounts
  useEffect(() => {
    setLastRefreshed(new Date());
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all queries to trigger fresh data fetching
      await queryClient.invalidateQueries({ queryKey: ['reddit'] });
      
      // Update last refreshed time
      setLastRefreshed(new Date());
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex items-center gap-3">
      {lastRefreshed && (
        <span className="text-xs text-gray-500 font-mono">
          [LAST_REFRESHED: {formatTime(lastRefreshed)}]
        </span>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="bg-black text-green-400 border-green-500 hover:bg-green-900/30 hover:text-green-300 hover:border-green-300 font-mono rounded-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw 
          className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
        />
        {isRefreshing ? '[REFRESHING...]' : '[REFRESH]'}
      </Button>
    </div>
  );
};
