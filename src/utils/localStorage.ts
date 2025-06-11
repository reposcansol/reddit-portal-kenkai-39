
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
  console.log('🔍 [STORAGE] getStorageItem called with key:', key);
  
  if (!isLocalStorageAvailable()) {
    console.log('🔍 [STORAGE] localStorage not available, returning null');
    return null;
  }
  
  try {
    const value = localStorage.getItem(key);
    console.log('🔍 [STORAGE] Retrieved value for key', key, ':', value);
    console.log('🔍 [STORAGE] Value type:', typeof value);
    console.log('🔍 [STORAGE] Value === null:', value === null);
    return value;
  } catch (error) {
    console.error(`❌ Error reading from localStorage (${key}):`, error);
    return null;
  }
};

export const setStorageItem = (key: string, value: string): boolean => {
  console.log('💾 [STORAGE] setStorageItem called with key:', key, 'value:', value);
  
  if (!isLocalStorageAvailable()) {
    console.log('💾 [STORAGE] localStorage not available, returning false');
    return false;
  }
  
  try {
    localStorage.setItem(key, value);
    console.log('💾 [STORAGE] Successfully set item in localStorage');
    
    // Verify the save was successful
    const verification = localStorage.getItem(key);
    console.log('💾 [STORAGE] Verification read:', verification);
    const success = verification === value;
    console.log('💾 [STORAGE] Verification success:', success);
    return success;
  } catch (error) {
    console.error(`❌ Error writing to localStorage (${key}):`, error);
    return false;
  }
};

export const removeStorageItem = (key: string): boolean => {
  console.log('🗑️ [STORAGE] removeStorageItem called with key:', key);
  
  if (!isLocalStorageAvailable()) {
    console.log('🗑️ [STORAGE] localStorage not available, returning false');
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    console.log('🗑️ [STORAGE] Successfully removed item from localStorage');
    return true;
  } catch (error) {
    console.error(`❌ Error removing from localStorage (${key}):`, error);
    return false;
  }
};
