
import { useState, useEffect } from 'react';

export type SortOption = 'relevance' | 'newest' | 'score' | 'comments';

const STORAGE_KEY = 'sort-preferences';
const DEFAULT_SORT: SortOption = 'relevance';

export const useSortPreferences = () => {
  const [currentSort, setCurrentSort] = useState<SortOption>(DEFAULT_SORT);

  // Load sort preference from localStorage on mount
  useEffect(() => {
    try {
      const savedSort = localStorage.getItem(STORAGE_KEY);
      if (savedSort && ['relevance', 'newest', 'score', 'comments'].includes(savedSort)) {
        setCurrentSort(savedSort as SortOption);
      }
    } catch (error) {
      console.error('Error loading sort preferences:', error);
    }
  }, []);

  // Save sort preference to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentSort);
    } catch (error) {
      console.error('Error saving sort preferences:', error);
    }
  }, [currentSort]);

  return {
    currentSort,
    setCurrentSort
  };
};
