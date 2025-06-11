
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FilterPreferences } from '@/hooks/useFilterPreferences';

interface TimeFilterProps {
  preferences: FilterPreferences;
  updatePreferences: (updates: Partial<FilterPreferences>) => void;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  preferences,
  updatePreferences
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-green-400 font-mono">[TIME_FILTER]</Label>
      <Label className="text-sm text-gray-400">Show posts from last {preferences.timeRange} hours</Label>
      <Slider
        value={[preferences.timeRange]}
        onValueChange={([value]) => updatePreferences({ timeRange: value })}
        min={1}
        max={168} // 1 week
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>1h</span>
        <span>1 week</span>
      </div>
    </div>
  );
};
