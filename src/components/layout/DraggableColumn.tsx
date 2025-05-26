
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';

interface DraggableColumnProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const DraggableColumn: React.FC<DraggableColumnProps> = ({
  id,
  children,
  className = ''
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'z-50' : ''} relative group`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 
                   bg-black border border-green-400/50 rounded-none p-1 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   cursor-grab active:cursor-grabbing
                   hover:border-green-400 hover:bg-green-400/10"
        aria-label={`Drag to reorder column ${id}`}
      >
        <GripHorizontal className="w-4 h-4 text-green-400" />
      </div>
      
      {children}
    </div>
  );
};
