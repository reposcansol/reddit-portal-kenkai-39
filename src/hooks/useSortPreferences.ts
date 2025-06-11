
import { useState, useEffect } from 'react';

export type SortOption = 'newest' | 'score' | 'comments';

const STORAGE_KEY = 'sort-preferences';
const DEFAULT_SORT: SortOption = 'newest';

export const useSortPreferences = () => {
  const [currentSort, setCurrentSort] = useState<SortOption>(() => {
    try {
      const savedSort = localStorage.getItem(STORAGE_KEY);
      if (savedSort && ['newest', 'score', 'comments'].includes(savedSort)) {
        return savedSort as SortOption;
      }
    } catch (error) {
      // Silent fallback
    }
    return DEFAULT_SORT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentSort);
    } catch (error) {
      // Silent fallback
    }
  }, [currentSort]);

  const handleSortChange = (newSort: SortOption) => {
    setCurrentSort(newSort);
  };

  return {
    currentSort,
    setCurrentSort: handleSortChange
  };
};
