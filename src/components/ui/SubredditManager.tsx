
import React, { useState } from 'react';
import { Settings, Plus, X, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SubredditManagerProps {
  subreddits: string[];
  onSubredditsChange: (subreddits: string[]) => void;
}

export const SubredditManager: React.FC<SubredditManagerProps> = ({
  subreddits,
  onSubredditsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSubreddits, setLocalSubreddits] = useState<string[]>(subreddits);

  const addSubreddit = () => {
    setLocalSubreddits([...localSubreddits, '']);
  };

  const removeSubreddit = (index: number) => {
    const updated = localSubreddits.filter((_, i) => i !== index);
    setLocalSubreddits(updated);
  };

  const updateSubreddit = (index: number, value: string) => {
    const updated = [...localSubreddits];
    updated[index] = value.toLowerCase().replace(/^r\//, ''); // Remove r/ prefix if added
    setLocalSubreddits(updated);
  };

  const saveChanges = () => {
    const validSubreddits = localSubreddits.filter(sub => sub.trim() !== '');
    onSubredditsChange(validSubreddits);
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    setLocalSubreddits([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalSubreddits(subreddits);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500 text-black border-green-500 hover:bg-green-400 hover:border-green-400 font-mono transition-all duration-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          [SUBREDDITS]
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-400 font-mono">
            [CONFIGURE_SUBREDDITS]
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-slate-400 text-sm font-mono">
            Enter subreddit names without r/ prefix.
          </p>
          
          <div className="space-y-2">
            {localSubreddits.map((subreddit, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="text-green-400 font-mono text-sm min-w-[20px]">
                  r/
                </div>
                <Input
                  value={subreddit}
                  onChange={(e) => updateSubreddit(index, e.target.value)}
                  placeholder="subreddit"
                  className="bg-slate-700 border-slate-600 text-white font-mono focus:border-green-400"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubreddit(index)}
                  className="bg-slate-700 border-red-400/30 text-red-400 hover:border-red-400 hover:bg-red-900/30 p-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addSubreddit}
              className="bg-slate-700 border-green-400/30 text-green-400 hover:border-green-400 hover:bg-green-900/30 font-mono"
            >
              <Plus className="w-3 h-3 mr-1" />
              [ADD]
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="bg-slate-700 border-yellow-400/30 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-900/30 font-mono"
            >
              [RESET]
            </Button>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-slate-600">
            <Button
              onClick={saveChanges}
              className="bg-green-500 text-black hover:bg-green-400 font-mono flex-1"
            >
              <Save className="w-3 h-3 mr-1" />
              [SAVE]
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-600 font-mono"
            >
              [CANCEL]
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
