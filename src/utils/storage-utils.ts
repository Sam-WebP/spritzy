export const STORAGE_KEYS = {
    QUIZ_SETTINGS: 'spritzy_quiz_settings',
    READER_SETTINGS: 'spritzy_reader_settings',
    APP_SETTINGS: 'spritzy_app_settings'
  };
  
  // Save data to local storage
  export const saveToStorage = <T>(key: string, data: T): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  // Load data from local storage
  export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };