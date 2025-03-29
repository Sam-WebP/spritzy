import { ThemeColors } from '@/types';
import { COLOR_THEMES } from '@/utils/constants';

// Define valid system themes
export type SystemTheme = 'light' | 'dark' | 'system';

// Get theme colors based on color scheme and current mode
export function getThemeColors(colorSchemeName: string, isDarkMode: boolean): ThemeColors {
  const selectedTheme = COLOR_THEMES.find(theme => theme.name === colorSchemeName) || COLOR_THEMES[0];
  return isDarkMode ? selectedTheme.dark : selectedTheme.light;
}

// Apply theme colors based on theme type
export function applyThemeColors(colors: ThemeColors, isCustomTheme: boolean = false) {
  if (isCustomTheme) {
    // Apply all custom theme colors
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--foreground', colors.foreground);
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', colors.primaryForeground);

    // Add custom theme class
    document.documentElement.classList.add('theme-custom');
    document.documentElement.classList.remove('using-accent-theme');
  } else {
    // Only apply primary colors for predefined themes
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', colors.primaryForeground);

    // Add accent theme class
    document.documentElement.classList.remove('theme-custom');
    document.documentElement.classList.add('using-accent-theme');
  }
}

// Remove all theme classes and reset to system theme
export function removeCustomTheme() {
  document.documentElement.classList.remove('theme-custom');
  document.documentElement.classList.remove('using-accent-theme');

  // Reset CSS variables to defaults
  document.documentElement.style.removeProperty('--background');
  document.documentElement.style.removeProperty('--foreground');
  document.documentElement.style.removeProperty('--primary');
  document.documentElement.style.removeProperty('--primary-foreground');
}

// Export this function so it can be used in other components
export function getContrastColor(hexColor: string): string {
  try {
    // Handle incomplete hex codes
    if (hexColor.startsWith('#') && hexColor.length < 7) {
      return '#ffffff';
    }

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance using perceived brightness formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  } catch {
    console.error('Error calculating contrast color for', hexColor);
    return '#ffffff'; // Default to white on error
  }
}
