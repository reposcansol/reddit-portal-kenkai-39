
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
      className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100"
    >
      <RefreshCw 
        className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
};
