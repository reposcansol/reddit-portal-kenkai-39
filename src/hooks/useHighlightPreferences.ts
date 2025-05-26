
import { useState, useEffect } from 'react';
import { KeywordCategory, DEFAULT_CATEGORIES } from './useEnhancedFilter';

interface HighlightPreferences {
  enableHighlighting: boolean;
  enabledCategories: string[];
  highlightThreshold: number;
  customKeywords: string[];
  categories: KeywordCategory[];
}

const DEFAULT_PREFERENCES: HighlightPreferences = {
  enableHighlighting: true,
  enabledCategories: ['ai', 'development'],
  highlightThreshold: 1.0,
  customKeywords: [],
  categories: DEFAULT_CATEGORIES
};

const STORAGE_KEY = 'highlight-preferences';

export const useHighlightPreferences = () => {
  const [preferences, setPreferences] = useState<HighlightPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...parsed,
          categories: DEFAULT_CATEGORIES // Always use latest categories
        });
      }
    } catch (error) {
      console.error('Error loading highlight preferences:', error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving highlight preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<HighlightPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const toggleCategory = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      enabledCategories: prev.enabledCategories.includes(categoryId)
        ? prev.enabledCategories.filter(id => id !== categoryId)
        : [...prev.enabledCategories, categoryId]
    }));
  };

  const addCustomKeyword = (keyword: string) => {
    if (keyword.trim() && !preferences.customKeywords.includes(keyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        customKeywords: [...prev.customKeywords, keyword.trim()]
      }));
    }
  };

  const removeCustomKeyword = (keyword: string) => {
    setPreferences(prev => ({
      ...prev,
      customKeywords: prev.customKeywords.filter(k => k !== keyword)
    }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    updatePreferences,
    toggleCategory,
    addCustomKeyword,
    removeCustomKeyword,
    resetPreferences
  };
};
