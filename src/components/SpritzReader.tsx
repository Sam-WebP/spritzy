'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface HighlightRule {
  maxLength: number;
  highlightIndex: number;
}

type HighlightPattern = HighlightRule[];

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
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <div className="text-center text-2xl font-semibold mb-2">Spritz Reader</div>
        
        {/* Word display area */}
        <div className="h-20 flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-50 mb-4">
          <div className="font-mono text-2xl flex items-baseline relative">
            <div className="text-gray-700">{currentWord.before}</div>
            <div className="text-red-600 mx-[2px] border-b-2 border-red-600">{currentWord.pivot}</div>
            <div className="text-gray-700">{currentWord.after}</div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button 
            onClick={resetReading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
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
            <label htmlFor="wpm-slider" className="block text-sm font-medium text-gray-700">
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
          <div className="text-xs text-gray-500 text-right mt-1">
            {currentWordIndex + 1}/{words.length} words
          </div>
        </div>
        
        {/* Highlight Pattern Settings */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Highlight Pattern</span>
            <button 
              onClick={openPatternEditor}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Customize
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
              <div className="flex gap-2">
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
      
      {/* Text input */}
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
          Text to Read
        </label>
        <textarea 
          id="text-input"
          value={text} 
          onChange={handleTextChange}
          rows={5} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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