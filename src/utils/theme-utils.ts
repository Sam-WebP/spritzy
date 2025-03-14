import { ColorTheme } from "@/types";

// This function applies custom theme colors to CSS variables
export function applyCustomThemeToDOM(theme: ColorTheme): void {
  // Apply primary theme colors to CSS variables
  document.documentElement.style.setProperty('--primary', theme.highlightText);
  document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
  
  // Apply background and text
  document.documentElement.style.setProperty('--background', theme.background);
  document.documentElement.style.setProperty('--foreground', theme.text);
  
  // Apply card styles
  document.documentElement.style.setProperty('--card', theme.wordBackground);
  document.documentElement.style.setProperty('--card-foreground', theme.text);
  
  // Apply accent styles (for buttons, etc)
  document.documentElement.style.setProperty('--accent', theme.highlightBorder);
  document.documentElement.style.setProperty('--accent-foreground', theme.text);
}