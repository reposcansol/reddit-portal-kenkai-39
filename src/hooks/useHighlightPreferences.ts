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

// Function to load preferences synchronously
const loadPreferencesFromStorage = (): HighlightPreferences => {
  try {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      console.log('Highlight: Loading saved preferences from localStorage:', parsed);
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        // Merge saved categories with defaults, keeping custom keywords if they exist
        categories: parsed.categories?.length > 0 ? parsed.categories : DEFAULT_CATEGORIES
      };
    }
  } catch (error) {
    console.error('Highlight: Error loading preferences from localStorage:', error);
  }
  console.log('Highlight: Using default preferences');
  return DEFAULT_PREFERENCES;
};

export const useHighlightPreferences = () => {
  // Initialize state synchronously from localStorage
  const [preferences, setPreferences] = useState<HighlightPreferences>(() => {
    return loadPreferencesFromStorage();
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      console.log('Highlight: Saving preferences to localStorage:', preferences);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Highlight: Error saving preferences to localStorage:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<HighlightPreferences>) => {
    console.log('Highlight: Updating preferences with:', updates);
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      console.log('Highlight: New preferences state:', newPrefs);
      return newPrefs;
    });
  };

  const toggleCategory = (categoryId: string) => {
    console.log('Highlight: Toggling category:', categoryId);
    setPreferences(prev => {
      const newEnabledCategories = prev.enabledCategories.includes(categoryId)
        ? prev.enabledCategories.filter(id => id !== categoryId)
        : [...prev.enabledCategories, categoryId];
      
      console.log('Highlight: New enabled categories:', newEnabledCategories);
      return {
        ...prev,
        enabledCategories: newEnabledCategories
      };
    });
  };

  const addPrimaryKeyword = (keyword: string) => {
    if (keyword.trim() && !preferences.primaryKeywords.includes(keyword.trim())) {
      console.log('Highlight: Adding primary keyword:', keyword.trim());
      setPreferences(prev => ({
        ...prev,
        primaryKeywords: [...prev.primaryKeywords, keyword.trim()]
      }));
    }
  };

  const addSecondaryKeyword = (keyword: string) => {
    if (keyword.trim() && !preferences.secondaryKeywords.includes(keyword.trim())) {
      console.log('Highlight: Adding secondary keyword:', keyword.trim());
      setPreferences(prev => ({
        ...prev,
        secondaryKeywords: [...prev.secondaryKeywords, keyword.trim()]
      }));
    }
  };

  const removePrimaryKeyword = (keyword: string) => {
    console.log('Highlight: Removing primary keyword:', keyword);
    setPreferences(prev => ({
      ...prev,
      primaryKeywords: prev.primaryKeywords.filter(k => k !== keyword)
    }));
  };

  const removeSecondaryKeyword = (keyword: string) => {
    console.log('Highlight: Removing secondary keyword:', keyword);
    setPreferences(prev => ({
      ...prev,
      secondaryKeywords: prev.secondaryKeywords.filter(k => k !== keyword)
    }));
  };

  const resetPreferences = () => {
    console.log('Highlight: Resetting preferences to defaults');
    setPreferences(DEFAULT_PREFERENCES);
  };

  // Log current state for debugging
  console.log('Highlight: Current preferences state:', preferences);

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
