import { ColorTheme } from "@/types";

// Define valid system themes
export type SystemTheme = 'light' | 'dark' | 'system';

// Apply a custom color theme to CSS variables
export function applyCustomThemeToCssVars(theme: ColorTheme) {
  // Primary color (highlighted text)
  document.documentElement.style.setProperty('--primary', theme.highlightText);
  document.documentElement.style.setProperty('--primary-foreground', getContrastColor(theme.highlightText));
  
  // Background
  document.documentElement.style.setProperty('--background-custom', theme.background);
  document.documentElement.style.setProperty('--foreground-custom', theme.text);
  
  // Card (for the reader display)
  document.documentElement.style.setProperty('--card-custom', theme.wordBackground);
  document.documentElement.style.setProperty('--card-foreground-custom', theme.text);
  
  // Border
  document.documentElement.style.setProperty('--border-custom', theme.highlightBorder);
  document.documentElement.style.setProperty('--ring-custom', theme.highlightBorder);
  
  // Enable custom theme
  document.documentElement.classList.add('using-custom-theme');
}

// Remove custom theme and revert to system theme
export function removeCustomTheme() {
  document.documentElement.classList.remove('using-custom-theme');
}

// Get a contrasting color (black or white) for text on a given background
function getContrastColor(hexColor: string): string {
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
  } catch (e) {
    console.error('Error calculating contrast color for', hexColor);
    return '#ffffff'; // Default to white on error
  }
}