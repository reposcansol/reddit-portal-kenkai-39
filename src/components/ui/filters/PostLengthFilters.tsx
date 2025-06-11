
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FilterPreferences } from '@/hooks/useFilterPreferences';

interface PostLengthFiltersProps {
  preferences: FilterPreferences;
  updatePreferences: (updates: Partial<FilterPreferences>) => void;
}

export const PostLengthFilters: React.FC<PostLengthFiltersProps> = ({
  preferences,
  updatePreferences
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-green-400 font-mono">[POST_LENGTH]</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-400">Min Characters</Label>
          <Input
            type="number"
            value={preferences.minPostLength}
            onChange={(e) => updatePreferences({ minPostLength: parseInt(e.target.value) || 0 })}
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-400">Max Characters (optional)</Label>
          <Input
            type="number"
            value={preferences.maxPostLength || ''}
            onChange={(e) => updatePreferences({ 
              maxPostLength: e.target.value ? parseInt(e.target.value) : null 
            })}
            placeholder="No limit"
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
      </div>
    </div>
  );
};
