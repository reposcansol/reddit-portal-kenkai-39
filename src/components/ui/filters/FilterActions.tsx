
import React from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  onSave: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  onSave,
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
        onClick={onSave}
        className="bg-green-900/30 text-green-400 border-green-400/50 hover:bg-green-900/50 rounded-none font-mono"
      >
        <Save className="w-3 h-3 mr-1" />
        [SAVE]
      </Button>
      
      <Button
        onClick={onClose}
        variant="outline"
        className="bg-black border-gray-400/30 text-gray-400 hover:border-gray-400 hover:bg-gray-900/30 rounded-none font-mono"
      >
        [CLOSE]
      </Button>
    </div>
  );
};
