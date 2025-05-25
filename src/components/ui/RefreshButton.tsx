
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export const RefreshButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all queries to trigger fresh data fetching
      await queryClient.invalidateQueries({ queryKey: ['reddit'] });
      await queryClient.invalidateQueries({ queryKey: ['hackerNews'] });
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
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
  );
};
