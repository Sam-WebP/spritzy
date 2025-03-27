/**
 * Utility functions for interacting with the browser's Local Storage.
 * Provides typed saving and loading mechanisms with error handling.
 */

/**
 * Defines the keys used for storing different parts of the application state
 * in local storage. Using constants helps prevent typos.
 */
export const STORAGE_KEYS = {
  /** Key for storing default quiz generation settings. */
  QUIZ_SETTINGS: 'spritzy_quiz_settings',
  /** @deprecated Key originally for reader settings, potentially merged into APP_SETTINGS. */
  READER_SETTINGS: 'spritzy_reader_settings',
  /** Key for storing general application settings (theme, font, display options, etc.). */
  APP_SETTINGS: 'spritzy_app_settings'
};

/**
 * Saves data to local storage under the specified key.
 * Data is serialized to JSON before saving.
 * Includes basic error handling.
 * @template T The type of data being saved.
 * @param key The key under which to store the data (should be one of STORAGE_KEYS).
 * @param data The data to save.
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    // Ensure localStorage is available (avoid errors in SSR or non-browser environments)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      console.warn(`localStorage not available, cannot save key "${key}".`);
    }
  } catch (error) {
    // Log errors that might occur during serialization or saving (e.g., storage full)
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

/**
 * Loads data from local storage for the specified key.
 * Data is deserialized from JSON.
 * Returns a default value if the key is not found or if an error occurs during loading/parsing.
 * @template T The expected type of the data being loaded.
 * @param key The key from which to load the data (should be one of STORAGE_KEYS).
 * @param defaultValue The value to return if loading fails or the key doesn't exist.
 * @returns The loaded data (type T) or the defaultValue.
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    // Ensure localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedValue = localStorage.getItem(key);

      // If no value is found for the key, return the default
      if (storedValue === null) {
          return defaultValue;
      }

      // Handle cases where stored value might be an empty string or the literal string "undefined",
      // which could cause JSON.parse errors or lead to unexpected states.
      if (storedValue === "" || storedValue === "undefined") {
          console.warn(`Stored value for key "${key}" was empty or "undefined", returning default.`);
          // Optionally remove the invalid item
          // localStorage.removeItem(key);
          return defaultValue;
      }

      // Parse the stored JSON string back into an object
      return JSON.parse(storedValue);
    }
    // If localStorage is unavailable, return the default
    return defaultValue;
  } catch (error) {
    // Log errors that might occur during loading or parsing (e.g., corrupted data)
    console.error(`Error loading key "${key}" from localStorage:`, error);
    // Optionally try to remove the corrupted item to prevent future errors
    // try { if (typeof window !== 'undefined') localStorage.removeItem(key); } catch {}
    // Return the default value in case of any error
    return defaultValue;
  }
};

/**
 * Removes a specific item from local storage.
 * Includes basic error handling.
 * @param key The key of the item to remove (should be one of STORAGE_KEYS).
 */
export const removeFromStorage = (key: string): void => {
  try {
    // Ensure localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    // Log errors that might occur during removal
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
};