
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FilterPreferences } from '@/hooks/useFilterPreferences';

interface PostLimitsProps {
  preferences: FilterPreferences;
  updatePreferences: (updates: Partial<FilterPreferences>) => void;
}

export const PostLimits: React.FC<PostLimitsProps> = ({
  preferences,
  updatePreferences
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-green-400 font-mono">[POST_LIMITS]</Label>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-gray-400">Posts per Subreddit</Label>
          <Input
            type="number"
            value={preferences.postsPerSubreddit}
            onChange={(e) => updatePreferences({ postsPerSubreddit: parseInt(e.target.value) || 15 })}
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-400">Max Total Posts</Label>
          <Input
            type="number"
            value={preferences.maxTotalPosts}
            onChange={(e) => updatePreferences({ maxTotalPosts: parseInt(e.target.value) || 80 })}
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-400">Reddit API Limit</Label>
          <Input
            type="number"
            value={preferences.redditLimit}
            onChange={(e) => updatePreferences({ redditLimit: parseInt(e.target.value) || 25 })}
            className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          />
        </div>
      </div>
    </div>
  );
};
