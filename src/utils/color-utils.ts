/**
 * Get contrasting text color (black or white) for a given background color
 */
export function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance using the perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Parse pattern format - expects a format like: "4:0, 6:1, 8:2, ..."
 */
export function parsePatternString(patternString: string) {
  return patternString
    .split(',')
    .map(rule => rule.trim())
    .filter(rule => rule.length > 0)
    .map(rule => {
      const [maxLength, highlightIndex] = rule.split(':').map(num => parseInt(num.trim()));
      
      if (isNaN(maxLength) || isNaN(highlightIndex)) {
        throw new Error('Invalid pattern format');
      }
      
      return { maxLength, highlightIndex };
    })
    .sort((a, b) => a.maxLength - b.maxLength);
}