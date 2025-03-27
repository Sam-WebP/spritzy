export const STORAGE_KEYS = {
  QUIZ_SETTINGS: 'spritzy_quiz_settings', // Added/Ensured this key exists
  READER_SETTINGS: 'spritzy_reader_settings', // Kept for potential separate reader state?
  APP_SETTINGS: 'spritzy_app_settings' // General app settings (like theme, font etc from settingsSlice)
};

// Save data to local storage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

// Load data from local storage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
          return defaultValue;
      }
      // Add a check for empty string or "undefined" which might cause parse errors
      if (storedValue === "" || storedValue === "undefined") {
          console.warn(`Stored value for key "${key}" was empty or undefined, returning default.`);
          return defaultValue;
      }
      return JSON.parse(storedValue);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    // Attempt to remove corrupted data?
    // try { localStorage.removeItem(key); } catch {}
    return defaultValue;
  }
};

// Optional: Function to clear specific storage
export const removeFromStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
};