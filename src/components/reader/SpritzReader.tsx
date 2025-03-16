'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SpritzReaderProps } from '@/types';
import { DEFAULT_TEXT } from '@/utils/constants';
import { setText, setWpm, processText, incrementWordIndex, startReading, pauseReading, setWordsAtTime } from '@/redux/slices/readerSlice';
import { toggleFocusMode, updateNumericSetting } from '@/redux/slices/settingsSlice';
import { Maximize } from "lucide-react";
import QuizDialog from '@/components/quiz/QuizDialog';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WordDisplay from './WordDisplay';
import ReaderControls from './ReaderControls';
import ProgressBar from './ProgressBar';
import TextInput from './TextInput';
import SettingsDialog from './settings/SettingsDialog';
import { useInterval } from '@/hooks/useInterval';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { calculateMicroPauseFactor } from '@/utils/micro-pause-utils';
import NumberControl from "@/components/controls/NumberControl";

export default function SpritzReader({
  initialWpm = 300,
  initialText = DEFAULT_TEXT,
  onThemeChange,
}: SpritzReaderProps) {
  const dispatch = useAppDispatch();
  const { isPlaying, wpm, words, text, currentWordIndex, wordsAtTime } = useAppSelector(state => state.reader);
  const settings = useAppSelector(state => state.settings);
  
  // Add state for the current word delay
  const [currentDelay, setCurrentDelay] = useState<number>(60000 / wpm);
  
  // Initialize with props if provided
  useEffect(() => {
    dispatch(setText(initialText));
    dispatch(setWpm(initialWpm));
    dispatch(processText());
  }, [dispatch, initialText, initialWpm]);
  
  // Notify parent component about theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(settings.theme);
    }
  }, [settings.theme, onThemeChange]);
  
  // Calculate micro-pause-adjusted delay
  useEffect(() => {
    if (words.length === 0) return;
    
    const baseDelay = 60000 / wpm;
    const currentWord = words[currentWordIndex];
    const nextWord = currentWordIndex < words.length - 1 ? words[currentWordIndex + 1] : null;
    
    const factor = calculateMicroPauseFactor(
      currentWord,
      nextWord || '',
      text,
      currentWordIndex,
      words,
      settings.microPauses
    );
    
    setCurrentDelay(baseDelay * factor);
  }, [currentWordIndex, wpm, words, text, settings.microPauses]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.code === 'Space') && !e.repeat) {
        // Prevent default only when we handle it (avoid interfering with input fields)
        const activeElement = document.activeElement;
        const isTextField = activeElement instanceof HTMLInputElement || 
                            activeElement instanceof HTMLTextAreaElement;
        
        if (!isTextField) {
          e.preventDefault();
          if (isPlaying) {
            dispatch(pauseReading());
          } else {
            dispatch(startReading());
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [dispatch, isPlaying]);

  // Use the interval with the dynamic delay
  useInterval(() => {
    if (isPlaying) {
      dispatch(incrementWordIndex());
    }
  }, isPlaying ? currentDelay : null);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-3 sm:p-6">
        <div className="flex space-x-1 sm:space-x-4">
          <NumberControl
            label="WPM"
            value={wpm}
            onIncrement={() => dispatch(setWpm(Math.min(wpm + 10, 1000)))}
            onDecrement={() => dispatch(setWpm(Math.max(wpm - 10, 100)))}
            min={100}
            max={1000}
            className="text-xs sm:text-sm"
          />
          
          <NumberControl
            label={<>
              <span className="hidden sm:inline">Words at a time</span>
              <span className="inline sm:hidden">Words</span>
            </>}
            value={wordsAtTime}
            onIncrement={() => dispatch(setWordsAtTime(Math.min(wordsAtTime + 1, 5)))}
            onDecrement={() => dispatch(setWordsAtTime(Math.max(wordsAtTime - 1, 1)))}
            min={1}
            max={5}
            className="text-xs sm:text-sm"
          />
          
          <NumberControl
            label={<>
              <span className="hidden sm:inline">Font Size</span>
              <span className="inline sm:hidden">Size</span>
            </>}
            value={settings.fontSize}
            onIncrement={() => dispatch(updateNumericSetting({
              setting: 'fontSize',
              value: Math.min(settings.fontSize + 1, 48)
            }))}
            onDecrement={() => dispatch(updateNumericSetting({
              setting: 'fontSize',
              value: Math.max(settings.fontSize - 1, 12)
            }))}
            min={12}
            max={48}
            className="text-xs sm:text-sm"
          />
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(toggleFocusMode())}
            aria-label="Focus Mode"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Display */}
        <WordDisplay />
        
        {/* Progress indicator - moved up and made interactive */}
        <ProgressBar interactive={true} />
        
        {/* Controls */}
        <ReaderControls />
        
        <Separator className="my-4" />
        
        {/* Text input - now with more rows */}
        <TextInput />
      </CardContent>
      <QuizDialog />
    </Card>
  );
}