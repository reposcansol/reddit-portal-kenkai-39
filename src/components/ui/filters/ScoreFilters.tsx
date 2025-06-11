
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { FilterPreferences } from '@/hooks/useFilterPreferences';

interface ScoreFiltersProps {
  preferences: FilterPreferences;
  updatePreferences: (updates: Partial<FilterPreferences>) => void;
}

export const ScoreFilters: React.FC<ScoreFiltersProps> = ({
  preferences,
  updatePreferences
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-green-400 font-mono">[SCORE_FILTERS]</Label>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-400">Minimum Upvotes: {preferences.minUpvotes}</Label>
        <Slider
          value={[preferences.minUpvotes]}
          onValueChange={([value]) => updatePreferences({ minUpvotes: value })}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-400">Max Upvotes (optional)</Label>
          <Input
            type="number"
            value={preferences.maxUpvotes || ''}
            onChange={(e) => updatePreferences({ 
              maxUpvotes: e.target.value ? parseInt(e.target.value) : null 
            })}
            placeholder="No limit"
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-400">Min Comments</Label>
          <Input
            type="number"
            value={preferences.minComments}
            onChange={(e) => updatePreferences({ minComments: parseInt(e.target.value) || 0 })}
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
      </div>
    </div>
  );
};
