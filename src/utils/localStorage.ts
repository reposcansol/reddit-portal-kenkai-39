
// Test localStorage availability
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    console.log('✅ localStorage is available');
    return true;
  } catch (e) {
    console.error('❌ localStorage is not available:', e);
    return false;
  }
};

// Generic localStorage operations with error handling
export const getStorageItem = (key: string): string | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`❌ Error reading from localStorage (${key}):`, error);
    return null;
  }
};

export const setStorageItem = (key: string, value: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.setItem(key, value);
    
    // Verify the save was successful
    const verification = localStorage.getItem(key);
    return verification === value;
  } catch (error) {
    console.error(`❌ Error writing to localStorage (${key}):`, error);
    return false;
  }
};

export const removeStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`❌ Error removing from localStorage (${key}):`, error);
    return false;
  }
};
