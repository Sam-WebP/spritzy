export const calculateMaxCharacters = (
  fontSize: number,
  letterSpacing: number,
  screenWidth: number
): number => {
  if (fontSize <= 0 || screenWidth <= 0) {
    return 0;
  }
  const avgCharWidth = fontSize * 0.6 + letterSpacing;
  const availableWidth = (screenWidth / 2) - 30;
  return Math.max(0, Math.floor(availableWidth / avgCharWidth));
};

export const calculateOptimalFontSize = (
  beforeLength: number,
  afterLength: number,
  maxChars: number,
  currentFontSize: number
): number => {
  if (beforeLength <= maxChars && afterLength <= maxChars) {
    return currentFontSize;
  }

  const ratioNeeded = Math.max(
    beforeLength > 0 ? beforeLength / maxChars : 0,
    afterLength > 0 ? afterLength / maxChars : 0
  );

  return Math.floor(currentFontSize / (ratioNeeded * 1.05));
};
