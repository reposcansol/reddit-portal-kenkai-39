
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useFilterPreferences } from '@/hooks/useFilterPreferences';
import { ScoreFilters } from './filters/ScoreFilters';
import { PostLimits } from './filters/PostLimits';
import { PostLengthFilters } from './filters/PostLengthFilters';
import { BlacklistInput } from './filters/BlacklistInput';
import { FilterActions } from './filters/FilterActions';

export const FilterControls: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    resetToDefaults,
    toggleEnabled,
    addToBlacklist,
    removeFromBlacklist
  } = useFilterPreferences();

  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    console.log('🔧 [FILTER_CONTROLS] Save button clicked, refreshing page');
    window.location.reload();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (preferences.minUpvotes > 1) count++;
    if (preferences.maxUpvotes) count++;
    if (preferences.minComments > 0) count++;
    if (preferences.characterBlacklist.length > 1) count++; // Default has "?"
    if (preferences.keywordBlacklist.length > 15) count++; // Default has many keywords now
    if (preferences.minPostLength > 0) count++;
    if (preferences.maxPostLength) count++;
    if (preferences.excludedFlairs.length > 1) count++; // Default has "help"
    if (preferences.excludedAuthors.length > 0) count++;
    if (preferences.postsPerSubreddit !== 15) count++;
    if (preferences.maxTotalPosts !== 80) count++;
    if (preferences.redditLimit !== 25) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-black text-green-400 border-green-500 hover:bg-green-900/30 hover:text-green-300 hover:border-green-300 font-mono rounded-none transition-all duration-200 relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          [FILTERS]
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-2 bg-green-400 text-black text-xs px-1 py-0">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black border-green-400/50 text-green-400 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-400 font-mono flex items-center justify-between">
            [POST_FILTERS]
            <div className="flex items-center gap-2">
              <Switch
                checked={preferences.enabled}
                onCheckedChange={toggleEnabled}
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-sm">{preferences.enabled ? 'ENABLED' : 'DISABLED'}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <ScoreFilters 
            preferences={preferences}
            updatePreferences={updatePreferences}
          />

          <PostLimits 
            preferences={preferences}
            updatePreferences={updatePreferences}
          />

          <BlacklistInput
            title="CHARACTER_BLACKLIST"
            placeholder="Add character to block"
            items={preferences.characterBlacklist}
            onAdd={(value) => addToBlacklist('character', value)}
            onRemove={(value) => removeFromBlacklist('character', value)}
          />

          <BlacklistInput
            title="KEYWORD_BLACKLIST"
            placeholder="Add keyword to block"
            items={preferences.keywordBlacklist}
            onAdd={(value) => addToBlacklist('keyword', value)}
            onRemove={(value) => removeFromBlacklist('keyword', value)}
            maxHeight="max-h-32"
          />

          <BlacklistInput
            title="FLAIR_BLACKLIST"
            placeholder="Add flair to block"
            items={preferences.excludedFlairs}
            onAdd={(value) => addToBlacklist('flair', value)}
            onRemove={(value) => removeFromBlacklist('flair', value)}
          />

          <PostLengthFilters 
            preferences={preferences}
            updatePreferences={updatePreferences}
          />

          <FilterActions
            onSave={handleSave}
            onReset={resetToDefaults}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
