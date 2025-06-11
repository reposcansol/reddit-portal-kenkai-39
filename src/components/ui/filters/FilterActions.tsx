
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  onReset: () => void;
  onClose: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  onReset,
  onClose
}) => {
  return (
    <div className="flex gap-2 pt-4 border-t border-green-400/20">
      <Button
        onClick={onReset}
        variant="outline"
        className="bg-black border-yellow-400/30 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-900/30 rounded-none font-mono"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        [RESET]
      </Button>
      
      <Button
        onClick={onClose}
        className="bg-green-900/30 text-green-400 border-green-400/50 hover:bg-green-900/50 rounded-none font-mono flex-1"
      >
        [CLOSE]
      </Button>
    </div>
  );
};
