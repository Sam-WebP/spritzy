'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface HighlightRule {
  maxLength: number;
  highlightIndex: number;
}

type HighlightPattern = HighlightRule[];

// Color themes
interface ColorTheme {
  name: string;
  background: string;
  text: string;
  highlightText: string;
  highlightBorder: string;
  wordBackground: string;
}

// Font options
type FontOption = {
  name: string;
  className: string;
};

interface SpritzReaderProps {
  initialWpm?: number;
  initialText?: string;
  initialHighlightPattern?: HighlightPattern;
}

interface WordParts {
  before: string;
  pivot: string;
  after: string;
}

interface ReaderSettings {
  theme: ColorTheme;
  font: FontOption;
  showFocusLetter: boolean;
  letterSpacing: number;
  fontSize: number;
  showFocusBorder: boolean;
}

// Default color themes
const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Default',
    background: 'bg-white',
    text: 'text-gray-700',
    highlightText: 'text-red-600',
    highlightBorder: 'border-red-600',
    wordBackground: 'bg-gray-50',
  },
  {
    name: 'Dark',
    background: 'bg-gray-800',
    text: 'text-gray-200',
    highlightText: 'text-yellow-400',
    highlightBorder: 'border-yellow-400',
    wordBackground: 'bg-gray-700',
  },
  {
    name: 'Sepia',
    background: 'bg-amber-50',
    text: 'text-amber-900',
    highlightText: 'text-red-800',
    highlightBorder: 'border-red-800',
    wordBackground: 'bg-amber-100',
  },
  {
    name: 'Blue',
    background: 'bg-blue-50',
    text: 'text-blue-900',
    highlightText: 'text-blue-600',
    highlightBorder: 'border-blue-600',
    wordBackground: 'bg-blue-100',
  },
  {
    name: 'Green',
    background: 'bg-green-50',
    text: 'text-green-900',
    highlightText: 'text-green-600',
    highlightBorder: 'border-green-600',
    wordBackground: 'bg-green-100',
  },
];

// Font options
const FONT_OPTIONS: FontOption[] = [
  { name: 'Mono', className: 'font-mono' },
  { name: 'Sans', className: 'font-sans' },
  { name: 'Serif', className: 'font-serif' },
];

const DEFAULT_HIGHLIGHT_PATTERN: HighlightPattern = [
  { maxLength: 4, highlightIndex: 0 },
  { maxLength: 6, highlightIndex: 1 },
  { maxLength: 8, highlightIndex: 2 },
  { maxLength: 10, highlightIndex: 3 },
  { maxLength: 12, highlightIndex: 4 },
  { maxLength: 14, highlightIndex: 5 },
  { maxLength: 16, highlightIndex: 6 },
  { maxLength: 18, highlightIndex: 7 },
  { maxLength: 20, highlightIndex: 8 },
];

// Default settings
const DEFAULT_SETTINGS: ReaderSettings = {
  theme: COLOR_THEMES[0],
  font: FONT_OPTIONS[0],
  showFocusLetter: true,
  letterSpacing: 0,
  fontSize: 24,
  showFocusBorder: true,
};

const SpritzReader: React.FC<SpritzReaderProps> = ({
  initialWpm = 300,
  initialText = "Welcome to the Spritz reader. This text will be displayed one word at a time with the focus point highlighted to help you read faster. Adjust the speed using the slider below.",
  initialHighlightPattern = DEFAULT_HIGHLIGHT_PATTERN,
}) => {
  const [wpm, setWpm] = useState<number>(initialWpm);
  const [text, setText] = useState<string>(initialText);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<WordParts>({ before: '', pivot: '', after: '' });
  const [highlightPattern, setHighlightPattern] = useState<HighlightPattern>(initialHighlightPattern);
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState<boolean>(false);
  const [newPattern, setNewPattern] = useState<string>('');
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Process text into words
  const processText = () => {
    const processedWords = text
      .trim()
      .replace(/\s{2,}/g, ' ')
      .split(' ')
      .filter(word => word.length > 0);
    
    setWords(processedWords);
    setCurrentWordIndex(0);
    
    if (processedWords.length > 0) {
      displayWord(processedWords[0]);
    }
  };

  // Calculate the optimal focus point for a word using the highlight pattern
  const calculateOrp = (word: string): number => {
    const length = word.length;
    
    // Find the appropriate rule from our pattern
    for (const rule of highlightPattern) {
      if (length <= rule.maxLength) {
        return rule.highlightIndex;
      }
    }
    
    // Default for very long words
    return Math.min(
      highlightPattern[highlightPattern.length - 1]?.highlightIndex || 8,
      Math.floor(length / 2) - 1
    );
  };

  // Display a word with its focus point
  const displayWord = (word: string) => {
    if (!word) return;
    
    const pivotIndex = calculateOrp(word);
    
    setCurrentWord({
      before: word.slice(0, pivotIndex),
      pivot: word[pivotIndex] || '',
      after: word.slice(pivotIndex + 1)
    });
  };

  // Handle applying a new highlight pattern
  const handleApplyPattern = () => {
    try {
      // Parse the pattern format - expects a format like: "4:0, 6:1, 8:2, ..."
      const patternRules = newPattern
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
      
      setHighlightPattern(patternRules);
      setIsPatternEditorOpen(false);
      
      // Update current word display with new pattern
      if (words.length > 0 && currentWordIndex < words.length) {
        displayWord(words[currentWordIndex]);
      }
    } catch (error) {
      alert('Invalid pattern format. Please use the format "maxLength:highlightIndex" separated by commas.');
    }
  };

  // Reset to default pattern
  const handleResetPattern = () => {
    setHighlightPattern(DEFAULT_HIGHLIGHT_PATTERN);
    setIsPatternEditorOpen(false);
    
    // Update current word display with default pattern
    if (words.length > 0 && currentWordIndex < words.length) {
      displayWord(words[currentWordIndex]);
    }
  };

  // Open pattern editor with current pattern formatted
  const openPatternEditor = () => {
    const formattedPattern = highlightPattern
      .map(rule => `${rule.maxLength}:${rule.highlightIndex}`)
      .join(', ');
    setNewPattern(formattedPattern);
    setIsPatternEditorOpen(true);
  };

  // Handle theme change
  const handleThemeChange = (themeName: string) => {
    const theme = COLOR_THEMES.find(t => t.name === themeName) || COLOR_THEMES[0];
    setSettings(prev => ({ ...prev, theme }));
  };

  // Handle font change
  const handleFontChange = (fontName: string) => {
    const font = FONT_OPTIONS.find(f => f.name === fontName) || FONT_OPTIONS[0];
    setSettings(prev => ({ ...prev, font }));
  };

  // Handle toggle settings
  const handleToggleSetting = (setting: keyof ReaderSettings) => {
    if (typeof settings[setting] === 'boolean') {
      setSettings(prev => ({ 
        ...prev, 
        [setting]: !prev[setting] 
      }));
    }
  };

  // Handle numeric settings
  const handleNumericSetting = (setting: keyof ReaderSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Reset to default settings
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Other functions remain the same
  const startReading = () => {
    if (words.length === 0 || currentWordIndex >= words.length) {
      processText();
    }
    
    setIsPlaying(true);
  };

  const pauseReading = () => {
    setIsPlaying(false);
  };

  const resetReading = () => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
    if (words.length > 0) {
      displayWord(words[0]);
    }
  };

  const handleWpmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWpm(parseInt(e.target.value));
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    processText();
  }, [text]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && words.length > 0) {
      const interval = 60000 / wpm;
      
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          const newIndex = prev + 1;
          
          if (newIndex >= words.length) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsPlaying(false);
            return prev;
          }
          
          displayWord(words[newIndex]);
          return newIndex;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, wpm, words, highlightPattern]);

  return (
    <div className={`w-full max-w-2xl mx-auto p-4 ${settings.theme.background} rounded-lg shadow-md transition-colors duration-300`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className={`text-center text-2xl font-semibold ${settings.theme.text}`}>Spritz Reader</div>
          <button 
            onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
            className={`px-3 py-1 rounded-md transition ${settings.theme.text} hover:opacity-80`}
          >
            ⚙️ Settings
          </button>
        </div>
        
        {/* Word display area */}
        <div className={`h-20 flex items-center justify-center border-2 border-gray-300 rounded-lg ${settings.theme.wordBackground} mb-4`}>
          <div 
            className={`${settings.font.className} flex items-baseline relative`}
            style={{ 
              fontSize: `${settings.fontSize}px`, 
              letterSpacing: `${settings.letterSpacing}px` 
            }}
          >
            <div className={settings.theme.text}>{currentWord.before}</div>
            {settings.showFocusLetter ? (
              <div 
                className={`${settings.theme.highlightText} mx-[2px] ${settings.showFocusBorder ? `border-b-2 ${settings.theme.highlightBorder}` : ''}`}
              >
                {currentWord.pivot}
              </div>
            ) : (
              <div className={settings.theme.text}>{currentWord.pivot}</div>
            )}
            <div className={settings.theme.text}>{currentWord.after}</div>
          </div>
        </div>
        
        {/* Settings Panel */}
        {isSettingsPanelOpen && (
          <div className={`mb-6 p-4 border rounded-lg ${settings.theme.wordBackground}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-medium ${settings.theme.text}`}>Reader Settings</h3>
              <button 
                onClick={resetSettings}
                className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Reset to Defaults
              </button>
            </div>

            {/* Color Theme */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${settings.theme.text} mb-1`}>
                Color Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_THEMES.map(theme => (
                  <button
                    key={theme.name}
                    className={`px-3 py-1 text-sm rounded-md transition ${
                      settings.theme.name === theme.name 
                        ? 'ring-2 ring-blue-500 ' + theme.background + ' ' + theme.text
                        : theme.background + ' ' + theme.text
                    }`}
                    onClick={() => handleThemeChange(theme.name)}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${settings.theme.text} mb-1`}>
                Font Family
              </label>
              <div className="flex gap-2">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font.name}
                    className={`px-3 py-1 text-sm rounded-md transition ${
                      settings.font.name === font.name 
                        ? `ring-2 ring-blue-500 bg-opacity-20 ${settings.theme.highlightBorder}`
                        : 'bg-gray-200 text-gray-800'
                    } ${font.className}`}
                    onClick={() => handleFontChange(font.name)}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${settings.theme.text} mb-1`}>
                Font Size: {settings.fontSize}px
              </label>
              <input 
                type="range" 
                min="12" 
                max="48" 
                step="1" 
                value={settings.fontSize} 
                onChange={(e) => handleNumericSetting('fontSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Letter Spacing */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${settings.theme.text} mb-1`}>
                Letter Spacing: {settings.letterSpacing}px
              </label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5" 
                value={settings.letterSpacing} 
                onChange={(e) => handleNumericSetting('letterSpacing', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Toggle Options */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input 
                  id="show-focus"
                  type="checkbox" 
                  checked={settings.showFocusLetter} 
                  onChange={() => handleToggleSetting('showFocusLetter')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="show-focus" className={`ml-2 text-sm ${settings.theme.text}`}>
                  Highlight Focus Letter
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  id="show-border"
                  type="checkbox" 
                  checked={settings.showFocusBorder} 
                  onChange={() => handleToggleSetting('showFocusBorder')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="show-border" className={`ml-2 text-sm ${settings.theme.text}`}>
                  Show Focus Border
                </label>
              </div>
            </div>

            {/* Highlight Pattern Settings */}
            <div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${settings.theme.text}`}>Highlight Pattern</span>
                <button 
                  onClick={openPatternEditor}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Customize Pattern
                </button>
              </div>
              
              {isPatternEditorOpen && (
                <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">
                    Format: "maxLength:highlightIndex" separated by commas<br/>
                    Example: "4:0, 6:1, 8:2, 10:3" means:
                    <br/>- Words up to 4 chars: highlight 1st letter (index 0)
                    <br/>- Words 5-6 chars: highlight 2nd letter (index 1)
                    <br/>- etc.
                  </p>
                  <input 
                    type="text" 
                    value={newPattern} 
                    onChange={(e) => setNewPattern(e.target.value)}
                    placeholder="4:0, 6:1, 8:2, 10:3, ..."
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={handleApplyPattern}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Apply Pattern
                    </button>
                    <button 
                      onClick={handleResetPattern}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Reset to Default
                    </button>
                    <button 
                      onClick={() => setIsPatternEditorOpen(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button 
            onClick={resetReading}
            className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition`}
          >
            Reset
          </button>
          {!isPlaying ? (
            <button 
              onClick={startReading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Start
            </button>
          ) : (
            <button 
              onClick={pauseReading}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Pause
            </button>
          )}
        </div>
        
        {/* WPM slider */}
        <div className="mb-4">
          <div className="flex justify-between">
            <label htmlFor="wpm-slider" className={`block text-sm font-medium ${settings.theme.text}`}>
              Reading Speed: {wpm} WPM
            </label>
          </div>
          <input 
            id="wpm-slider"
            type="range" 
            min="100" 
            max="1000" 
            step="10" 
            value={wpm} 
            onChange={handleWpmChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>100</span>
            <span>1000</span>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${words.length > 0 ? (currentWordIndex / words.length) * 100 : 0}%` }}
            ></div>
          </div>
          <div className={`text-xs ${settings.theme.text} text-right mt-1`}>
            {currentWordIndex + 1}/{words.length} words
          </div>
        </div>
      </div>
      
      {/* Text input */}
      <div>
        <label htmlFor="text-input" className={`block text-sm font-medium ${settings.theme.text} mb-1`}>
          Text to Read
        </label>
        <textarea 
          id="text-input"
          value={text} 
          onChange={handleTextChange}
          rows={5} 
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${settings.theme.wordBackground} ${settings.theme.text}`}
          placeholder="Enter or paste text to read..."
        />
        <button 
          onClick={processText}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          Update Text
        </button>
      </div>
    </div>
  );
};

export default SpritzReader;