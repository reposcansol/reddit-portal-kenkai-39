
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlacklistInputProps {
  title: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  maxHeight?: string;
}

export const BlacklistInput: React.FC<BlacklistInputProps> = ({
  title,
  placeholder,
  items,
  onAdd,
  onRemove,
  maxHeight = "auto"
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem('');
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-green-400 font-mono">[{title}]</Label>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="bg-black border-green-400/30 text-green-400 font-mono rounded-none"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          onClick={handleAdd}
          size="sm"
          className="bg-green-900/30 border-green-400/50 text-green-400 rounded-none"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className={`flex flex-wrap gap-1 ${maxHeight !== "auto" ? `${maxHeight} overflow-y-auto` : ""}`}>
        {items.map((item, index) => (
          <Badge
            key={index}
            className="bg-red-900/30 text-red-400 border-red-400/30 font-mono text-xs"
          >
            {title === "CHARACTER_BLACKLIST" ? `"${item}"` : item}
            <X
              className="w-3 h-3 ml-1 cursor-pointer"
              onClick={() => onRemove(item)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
