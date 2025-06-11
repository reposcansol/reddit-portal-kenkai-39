
import { useState, useEffect } from 'react';

export type SortOption = 'newest' | 'score' | 'comments';

const STORAGE_KEY = 'sort-preferences';
const DEFAULT_SORT: SortOption = 'newest';

export const useSortPreferences = () => {
  const [currentSort, setCurrentSort] = useState<SortOption>(() => {
    // Initialize from localStorage immediately
    try {
      const savedSort = localStorage.getItem(STORAGE_KEY);
      if (savedSort && ['newest', 'score', 'comments'].includes(savedSort)) {
        console.log('Loading saved sort preference:', savedSort);
        return savedSort as SortOption;
      }
    } catch (error) {
      console.error('Error loading sort preferences:', error);
    }
    console.log('Using default sort preference:', DEFAULT_SORT);
    return DEFAULT_SORT;
  });

  // Save sort preference to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('Saving sort preference to localStorage:', currentSort);
      localStorage.setItem(STORAGE_KEY, currentSort);
    } catch (error) {
      console.error('Error saving sort preferences:', error);
    }
  }, [currentSort]);

  const handleSortChange = (newSort: SortOption) => {
    console.log('Sort changing from', currentSort, 'to', newSort);
    setCurrentSort(newSort);
  };

  return {
    currentSort,
    setCurrentSort: handleSortChange
  };
};
