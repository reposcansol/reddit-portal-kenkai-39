
import React from 'react';
import { ArrowUpDown, TrendingUp, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export type SortOption = 'relevance' | 'newest' | 'score' | 'comments';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  currentSort,
  onSortChange
}) => {
  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'relevance': return <Zap className="w-3 h-3" />;
      case 'newest': return <Clock className="w-3 h-3" />;
      case 'score': return <TrendingUp className="w-3 h-3" />;
      case 'comments': return <ArrowUpDown className="w-3 h-3" />;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'relevance': return 'Relevance';
      case 'newest': return 'Newest';
      case 'score': return 'Highest Score';
      case 'comments': return 'Most Comments';
    }
  };

  const getCurrentSortLabel = () => {
    return getSortLabel(currentSort).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black border-green-400/30 text-green-400 hover:bg-green-400/10 font-mono"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          [SORT: {getCurrentSortLabel()}]
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-black border-green-400/30 font-mono">
        <DropdownMenuLabel className="text-green-400">
          [SORT_OPTIONS]
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        <DropdownMenuItem
          onClick={() => onSortChange('relevance')}
          className={`text-green-300 hover:bg-green-400/10 ${
            currentSort === 'relevance' ? 'bg-green-400/20' : ''
          }`}
        >
          <Zap className="w-4 h-4 mr-2" />
          Relevance Score
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => onSortChange('newest')}
          className={`text-green-300 hover:bg-green-400/10 ${
            currentSort === 'newest' ? 'bg-green-400/20' : ''
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Newest First
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => onSortChange('score')}
          className={`text-green-300 hover:bg-green-400/10 ${
            currentSort === 'score' ? 'bg-green-400/20' : ''
          }`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Highest Score
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => onSortChange('comments')}
          className={`text-green-300 hover:bg-green-400/10 ${
            currentSort === 'comments' ? 'bg-green-400/20' : ''
          }`}
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Most Comments
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
