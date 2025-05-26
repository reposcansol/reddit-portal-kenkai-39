
import React, { useState } from 'react';
import { Settings, Plus, X, Zap, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';

export const KeywordManager: React.FC = () => {
  const {
    preferences,
    addPrimaryKeyword,
    addSecondaryKeyword,
    removePrimaryKeyword,
    removeSecondaryKeyword,
    resetPreferences
  } = useHighlightPreferences();

  const [newPrimaryKeyword, setNewPrimaryKeyword] = useState('');
  const [newSecondaryKeyword, setNewSecondaryKeyword] = useState('');
  const [showPrimaryInput, setShowPrimaryInput] = useState(false);
  const [showSecondaryInput, setShowSecondaryInput] = useState(false);

  const handleAddPrimaryKeyword = () => {
    if (newPrimaryKeyword.trim()) {
      addPrimaryKeyword(newPrimaryKeyword);
      setNewPrimaryKeyword('');
      setShowPrimaryInput(false);
    }
  };

  const handleAddSecondaryKeyword = () => {
    if (newSecondaryKeyword.trim()) {
      addSecondaryKeyword(newSecondaryKeyword);
      setNewSecondaryKeyword('');
      setShowSecondaryInput(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black border-green-400/30 text-green-400 hover:bg-green-400/10 font-mono"
        >
          <Target className="w-4 h-4 mr-2" />
          [KEYWORDS]
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-black border-green-400/30 font-mono max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-green-400">
          [KEYWORD_MANAGER]
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        {/* Primary Keywords */}
        <DropdownMenuLabel className="text-amber-400 text-xs flex items-center">
          <Zap className="w-3 h-3 mr-1" />
          [PRIMARY_KEYWORDS] (3x weight)
        </DropdownMenuLabel>
        
        {preferences.primaryKeywords.map(keyword => (
          <DropdownMenuItem
            key={`primary-${keyword}`}
            className="text-amber-300 hover:bg-amber-400/10 justify-between"
          >
            <span className="text-xs">{keyword}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removePrimaryKeyword(keyword);
              }}
              className="h-4 w-4 p-0 text-red-400 hover:text-red-300"
            >
              <X className="w-3 h-3" />
            </Button>
          </DropdownMenuItem>
        ))}
        
        {showPrimaryInput ? (
          <div className="px-2 py-2 flex gap-1">
            <input
              type="text"
              value={newPrimaryKeyword}
              onChange={(e) => setNewPrimaryKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPrimaryKeyword();
                if (e.key === 'Escape') setShowPrimaryInput(false);
              }}
              placeholder="Enter primary keyword..."
              className="flex-1 bg-gray-900 border border-amber-400/30 rounded px-2 py-1 text-xs text-amber-300 placeholder-gray-500"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddPrimaryKeyword}
              className="h-6 w-6 p-0 text-amber-400"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <DropdownMenuItem
            onClick={() => setShowPrimaryInput(true)}
            className="text-amber-300 hover:bg-amber-400/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Primary Keyword
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        {/* Secondary Keywords */}
        <DropdownMenuLabel className="text-blue-400 text-xs">
          [SECONDARY_KEYWORDS] (2x weight)
        </DropdownMenuLabel>
        
        {preferences.secondaryKeywords.map(keyword => (
          <DropdownMenuItem
            key={`secondary-${keyword}`}
            className="text-blue-300 hover:bg-blue-400/10 justify-between"
          >
            <span className="text-xs">{keyword}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeSecondaryKeyword(keyword);
              }}
              className="h-4 w-4 p-0 text-red-400 hover:text-red-300"
            >
              <X className="w-3 h-3" />
            </Button>
          </DropdownMenuItem>
        ))}
        
        {showSecondaryInput ? (
          <div className="px-2 py-2 flex gap-1">
            <input
              type="text"
              value={newSecondaryKeyword}
              onChange={(e) => setNewSecondaryKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSecondaryKeyword();
                if (e.key === 'Escape') setShowSecondaryInput(false);
              }}
              placeholder="Enter secondary keyword..."
              className="flex-1 bg-gray-900 border border-blue-400/30 rounded px-2 py-1 text-xs text-blue-300 placeholder-gray-500"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddSecondaryKeyword}
              className="h-6 w-6 p-0 text-blue-400"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <DropdownMenuItem
            onClick={() => setShowSecondaryInput(true)}
            className="text-blue-300 hover:bg-blue-400/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Secondary Keyword
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        <DropdownMenuItem
          onClick={resetPreferences}
          className="text-red-400 hover:bg-red-400/10"
        >
          Reset All Keywords
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
