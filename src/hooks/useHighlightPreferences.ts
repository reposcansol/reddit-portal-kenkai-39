
import { useState, useEffect } from 'react';

interface HighlightPreferences {
  // Empty for now - simplified without categories
}

const DEFAULT_PREFERENCES: HighlightPreferences = {
  // Empty object
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
        ...parsed
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

  const resetPreferences = () => {
    console.log('Highlight: Resetting preferences to defaults');
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};
