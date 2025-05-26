
import { useState, useEffect } from 'react';

interface UseColumnOrderProps {
  storageKey: string;
  defaultOrder: string[];
}

export const useColumnOrder = ({ storageKey, defaultOrder }: UseColumnOrderProps) => {
  const [columnOrder, setColumnOrder] = useState<string[]>(defaultOrder);

  // Load order from localStorage on mount
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(storageKey);
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        // Validate that the saved order contains all expected items
        if (Array.isArray(parsedOrder) && parsedOrder.length === defaultOrder.length) {
          const hasAllItems = defaultOrder.every(item => parsedOrder.includes(item));
          if (hasAllItems) {
            setColumnOrder(parsedOrder);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error loading column order from localStorage:', error);
    }
    // Fallback to default order
    setColumnOrder(defaultOrder);
  }, [storageKey, defaultOrder]);

  // Save order to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(columnOrder));
    } catch (error) {
      console.error('Error saving column order to localStorage:', error);
    }
  }, [storageKey, columnOrder]);

  const resetOrder = () => {
    setColumnOrder(defaultOrder);
  };

  return {
    columnOrder,
    setColumnOrder,
    resetOrder
  };
};
