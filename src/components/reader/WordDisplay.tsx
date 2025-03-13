import { WordParts, ReaderSettings } from '@/types';

interface WordDisplayProps {
  currentWord: WordParts;
  settings: ReaderSettings;
}

export default function WordDisplay({ currentWord, settings }: WordDisplayProps) {
  return (
    <div 
      className="h-20 flex items-center justify-center border-2 border-gray-300 rounded-lg mb-4"
      style={{ backgroundColor: settings.theme.wordBackground }}
      aria-live="assertive"
      aria-atomic="true"
    >
      <div 
        className={`${settings.font.className} flex items-baseline relative`}
        style={{ 
          fontSize: `${settings.fontSize}px`, 
          letterSpacing: `${settings.letterSpacing}px` 
        }}
      >
        <div style={{ color: settings.theme.text }}>{currentWord.before}</div>
        {settings.showFocusLetter ? (
          <div 
            style={{ 
              color: settings.theme.highlightText,
              borderBottom: settings.showFocusBorder ? `2px solid ${settings.theme.highlightBorder}` : 'none',
              display: 'inline-block', // Fix extra padding issue
              lineHeight: '1',
            }}
          >
            {currentWord.pivot}
          </div>
        ) : (
          <div style={{ color: settings.theme.text }}>{currentWord.pivot}</div>
        )}
        <div style={{ color: settings.theme.text }}>{currentWord.after}</div>
      </div>
    </div>
  );
}