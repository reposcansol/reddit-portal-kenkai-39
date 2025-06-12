
import React from 'react';
import { ArrowUpDown, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export type SortOption = 'newest' | 'score' | 'comments';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  currentSort,
  onSortChange
}) => {
  const getSortLabel = (option: SortOption) => {
    switch (option) {
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
          className="bg-green-500 text-black border-green-500 hover:bg-green-400 hover:border-green-400 font-mono transition-all duration-200"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          [SORT: {getCurrentSortLabel()}]
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-slate-800 border-slate-600 font-mono">
        <DropdownMenuLabel className="text-green-400">
          [SORT_OPTIONS]
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-600" />
        
        <DropdownMenuItem
          onClick={() => onSortChange('newest')}
          className={`text-white hover:bg-slate-700 ${
            currentSort === 'newest' ? 'bg-slate-700' : ''
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Newest First
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => onSortChange('score')}
          className={`text-white hover:bg-slate-700 ${
            currentSort === 'score' ? 'bg-slate-700' : ''
          }`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Highest Score
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => onSortChange('comments')}
          className={`text-white hover:bg-slate-700 ${
            currentSort === 'comments' ? 'bg-slate-700' : ''
          }`}
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Most Comments
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
