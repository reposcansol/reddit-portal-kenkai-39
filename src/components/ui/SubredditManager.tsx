
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
    if (localSubreddits.length < 4) {
      setLocalSubreddits([...localSubreddits, '']);
    }
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
    const defaultSubreddits = ['localllama', 'roocode', 'chatgptcoding', 'cursor'];
    setLocalSubreddits(defaultSubreddits);
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
          className="bg-black text-green-400 border-green-500 hover:bg-green-900/30 hover:text-green-300 hover:border-green-300 font-mono rounded-none transition-all duration-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          [SUBREDDITS]
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black border-green-400/50 text-green-400 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-400 font-mono">
            [CONFIGURE_SUBREDDITS]
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-400 text-sm font-mono">
            Max 4 subreddits. Enter names without r/ prefix.
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
                  className="bg-black border-green-400/30 text-green-400 font-mono rounded-none focus:border-green-400"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubreddit(index)}
                  className="bg-black border-red-400/30 text-red-400 hover:border-red-400 hover:bg-red-900/30 rounded-none p-2"
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
              disabled={localSubreddits.length >= 4}
              className="bg-black border-green-400/30 text-green-400 hover:border-green-400 hover:bg-green-900/30 rounded-none font-mono"
            >
              <Plus className="w-3 h-3 mr-1" />
              [ADD]
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="bg-black border-yellow-400/30 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-900/30 rounded-none font-mono"
            >
              [RESET]
            </Button>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-green-400/20">
            <Button
              onClick={saveChanges}
              className="bg-green-900/30 text-green-400 border-green-400/50 hover:bg-green-900/50 rounded-none font-mono flex-1"
            >
              <Save className="w-3 h-3 mr-1" />
              [SAVE]
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-black border-gray-400/30 text-gray-400 hover:border-gray-400 hover:bg-gray-900/30 rounded-none font-mono"
            >
              [CANCEL]
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
