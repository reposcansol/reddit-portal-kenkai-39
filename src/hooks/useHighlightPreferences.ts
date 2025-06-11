
import { useState, useEffect } from 'react';

interface HighlightPreferences {
  // Empty for now - simplified without categories
}

const DEFAULT_PREFERENCES: HighlightPreferences = {
  // Empty object
};

const STORAGE_KEY = 'highlight-preferences';

const loadPreferencesFromStorage = (): HighlightPreferences => {
  try {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed
      };
    }
  } catch (error) {
    // Silent fallback
  }
  return DEFAULT_PREFERENCES;
};

export const useHighlightPreferences = () => {
  const [preferences, setPreferences] = useState<HighlightPreferences>(() => {
    return loadPreferencesFromStorage();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      // Silent fallback
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<HighlightPreferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      return newPrefs;
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};
