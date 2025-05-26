
import React, { useState } from 'react';
import { Settings, Plus, X, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useHighlightPreferences } from '@/hooks/useHighlightPreferences';

export const CategoryManager: React.FC = () => {
  const { preferences, updatePreferences } = useHighlightPreferences();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editKeywords, setEditKeywords] = useState('');

  const startEditing = (categoryId: string) => {
    const category = preferences.categories.find(c => c.id === categoryId);
    if (category) {
      setEditKeywords(category.keywords.join(', '));
      setEditingCategory(categoryId);
    }
  };

  const saveKeywords = () => {
    if (!editingCategory) return;
    
    const keywords = editKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    const updatedCategories = preferences.categories.map(category => 
      category.id === editingCategory 
        ? { ...category, keywords }
        : category
    );
    
    updatePreferences({ categories: updatedCategories });
    setEditingCategory(null);
    setEditKeywords('');
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditKeywords('');
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-400 border-green-400/30';
      case 'blue': return 'text-blue-400 border-blue-400/30';
      case 'amber': return 'text-amber-400 border-amber-400/30';
      case 'purple': return 'text-purple-400 border-purple-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
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
          [CATEGORIES]
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[600px] bg-black border-green-400/30 font-mono max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-green-400">
          [CATEGORY_KEYWORDS]
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-green-400/20" />
        
        {preferences.categories.map(category => (
          <div key={category.id} className="p-3 border-b border-green-400/10 last:border-b-0">
            <div className={`flex items-center justify-between mb-2 ${getCategoryColor(category.color)}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">[{category.name.toUpperCase()}]</span>
                <span className="text-xs opacity-75">({category.keywords.length} keywords)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEditing(category.id)}
                className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
            
            {editingCategory === category.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  placeholder="Enter keywords separated by commas..."
                  className="bg-gray-900 border-green-400/30 text-green-300 text-xs font-mono min-h-[80px] resize-none"
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveKeywords}
                    className="h-6 px-2 text-green-400 hover:text-green-300"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-6 px-2 text-red-400 hover:text-red-300"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 leading-relaxed">
                {category.keywords.slice(0, 10).join(', ')}
                {category.keywords.length > 10 && (
                  <span className="text-gray-500"> ... +{category.keywords.length - 10} more</span>
                )}
              </div>
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
