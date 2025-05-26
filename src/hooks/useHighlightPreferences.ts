
import { useState, useEffect } from 'react';
import { KeywordCategory, DEFAULT_CATEGORIES } from './useEnhancedFilter';

interface HighlightPreferences {
  enableHighlighting: boolean;
  enabledCategories: string[];
  highlightThreshold: number;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  categories: KeywordCategory[];
}

const DEFAULT_PREFERENCES: HighlightPreferences = {
  enableHighlighting: true,
  enabledCategories: ['ai', 'development'],
  highlightThreshold: 1.0,
  primaryKeywords: [],
  secondaryKeywords: [],
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

  const addPrimaryKeyword = (keyword: string) => {
    if (keyword.trim() && !preferences.primaryKeywords.includes(keyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        primaryKeywords: [...prev.primaryKeywords, keyword.trim()]
      }));
    }
  };

  const addSecondaryKeyword = (keyword: string) => {
    if (keyword.trim() && !preferences.secondaryKeywords.includes(keyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        secondaryKeywords: [...prev.secondaryKeywords, keyword.trim()]
      }));
    }
  };

  const removePrimaryKeyword = (keyword: string) => {
    setPreferences(prev => ({
      ...prev,
      primaryKeywords: prev.primaryKeywords.filter(k => k !== keyword)
    }));
  };

  const removeSecondaryKeyword = (keyword: string) => {
    setPreferences(prev => ({
      ...prev,
      secondaryKeywords: prev.secondaryKeywords.filter(k => k !== keyword)
    }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    updatePreferences,
    toggleCategory,
    addPrimaryKeyword,
    addSecondaryKeyword,
    removePrimaryKeyword,
    removeSecondaryKeyword,
    resetPreferences
  };
};
