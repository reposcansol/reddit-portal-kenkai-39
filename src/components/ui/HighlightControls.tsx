import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Plus, X } from 'lucide-react';
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

export const HighlightControls: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    toggleCategory,
    resetPreferences
  } = useHighlightPreferences();

  const getCategoryColor = (categoryId: string) => {
    const category = preferences.categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black text-green-400 border-green-500 hover:bg-green-900/30 hover:text-green-300 hover:border-green-300 font-mono rounded-none transition-all duration-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          [HIGHLIGHT]
          {preferences.enableHighlighting ? (
            <Eye className="w-4 h-4 ml-2" />
          ) : (
            <EyeOff className="w-4 h-4 ml-2" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black border-green-400/30 font-mono">
        <DropdownMenuLabel className="text-green-400">
          [HIGHLIGHT_CONFIG]
        </DropdownMenuLabel>
        
        {/* Toggle highlighting */}
        <DropdownMenuItem
          onClick={() => updatePreferences({ enableHighlighting: !preferences.enableHighlighting })}
          className="text-green-300 hover:bg-green-400/10"
        >
          {preferences.enableHighlighting ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Disable Highlighting
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Enable Highlighting
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        {/* Categories */}
        <DropdownMenuLabel className="text-green-400 text-xs">
          [CATEGORIES]
        </DropdownMenuLabel>
        {preferences.categories.map(category => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className="text-green-300 hover:bg-green-400/10 justify-between"
          >
            <span className="text-xs">{category.name}</span>
            {preferences.enabledCategories.includes(category.id) && (
              <Badge 
                variant="outline" 
                className={`border-${category.color}-400 text-${category.color}-400 text-xs`}
              >
                ON
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        {/* Threshold slider */}
        <div className="px-2 py-2">
          <label className="text-green-400 text-xs block mb-1">
            [MIN_SCORE: {preferences.highlightThreshold.toFixed(1)}]
          </label>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={preferences.highlightThreshold}
            onChange={(e) => updatePreferences({ highlightThreshold: parseFloat(e.target.value) })}
            className="w-full accent-green-400"
          />
        </div>
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        <DropdownMenuItem
          onClick={resetPreferences}
          className="text-red-400 hover:bg-red-400/10"
        >
          Reset to Defaults
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
