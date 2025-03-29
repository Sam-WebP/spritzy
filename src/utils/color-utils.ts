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

export function hexToRgba(hex: string | undefined, opacity: number): string {
  // Handle undefined/empty values
  if (!hex || typeof hex !== 'string') {
    return `rgba(0, 0, 0, ${opacity})`;
  }

  try {
    // Normalize hex value
    let normalizedHex = hex.replace('#', '');
    if (normalizedHex.length === 3) {
      normalizedHex = normalizedHex.split('').map(c => c + c).join('');
    }

    // Parse values
    const r = parseInt(normalizedHex.slice(0, 2), 16);
    const g = parseInt(normalizedHex.slice(2, 4), 16);
    const b = parseInt(normalizedHex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return `rgba(0, 0, 0, ${opacity})`;
  }
}
