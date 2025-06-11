
import React, { useState } from 'react';
import { Filter, X, Plus, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useFilterPreferences } from '@/hooks/useFilterPreferences';

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
  const [newCharacter, setNewCharacter] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newFlair, setNewFlair] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const handleAddCharacter = () => {
    if (newCharacter.trim()) {
      addToBlacklist('character', newCharacter);
      setNewCharacter('');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addToBlacklist('keyword', newKeyword);
      setNewKeyword('');
    }
  };

  const handleAddFlair = () => {
    if (newFlair.trim()) {
      addToBlacklist('flair', newFlair);
      setNewFlair('');
    }
  };

  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      addToBlacklist('author', newAuthor);
      setNewAuthor('');
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (preferences.minUpvotes > 1) count++;
    if (preferences.maxUpvotes) count++;
    if (preferences.minComments > 0) count++;
    if (preferences.characterBlacklist.length > 1) count++; // Default has "?"
    if (preferences.keywordBlacklist.length > 2) count++; // Default has "removed", "deleted"
    if (preferences.timeRange < 24) count++;
    if (preferences.minPostLength > 0) count++;
    if (preferences.maxPostLength) count++;
    if (preferences.excludedFlairs.length > 0) count++;
    if (preferences.excludedAuthors.length > 0) count++;
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
      
      <DialogContent className="bg-black border-green-400/50 text-green-400 max-w-2xl max-h-[80vh] overflow-y-auto">
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
          {/* Score Filters */}
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

          {/* Time Filter */}
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

          {/* Character Blacklist */}
          <div className="space-y-2">
            <Label className="text-green-400 font-mono">[CHARACTER_BLACKLIST]</Label>
            <div className="flex gap-2">
              <Input
                value={newCharacter}
                onChange={(e) => setNewCharacter(e.target.value)}
                placeholder="Add character to block"
                className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCharacter()}
              />
              <Button
                onClick={handleAddCharacter}
                size="sm"
                className="bg-green-900/30 border-green-400/50 text-green-400 rounded-none"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {preferences.characterBlacklist.map((char, index) => (
                <Badge
                  key={index}
                  className="bg-red-900/30 text-red-400 border-red-400/30 font-mono"
                >
                  "{char}"
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => removeFromBlacklist('character', char)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Keyword Blacklist */}
          <div className="space-y-2">
            <Label className="text-green-400 font-mono">[KEYWORD_BLACKLIST]</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword to block"
                className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button
                onClick={handleAddKeyword}
                size="sm"
                className="bg-green-900/30 border-green-400/50 text-green-400 rounded-none"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {preferences.keywordBlacklist.map((keyword, index) => (
                <Badge
                  key={index}
                  className="bg-red-900/30 text-red-400 border-red-400/30 font-mono"
                >
                  {keyword}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => removeFromBlacklist('keyword', keyword)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Post Length Filters */}
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-green-400/20">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              className="bg-black border-yellow-400/30 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-900/30 rounded-none font-mono"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              [RESET]
            </Button>
            
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-green-900/30 text-green-400 border-green-400/50 hover:bg-green-900/50 rounded-none font-mono flex-1"
            >
              [CLOSE]
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
