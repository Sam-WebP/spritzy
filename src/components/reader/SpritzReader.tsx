'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SpritzReaderProps } from '@/types';
import { DEFAULT_TEXT } from '@/utils/constants';
import { setText, setWpm, processText, incrementWordIndex } from '@/redux/slices/readerSlice';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WordDisplay from './WordDisplay';
import ReaderControls from './ReaderControls';
import SpeedControl from './SpeedControl';
import ProgressBar from './ProgressBar';
import TextInput from './TextInput';
import SettingsDialog from './settings/SettingsDialog';
import { useInterval } from '@/hooks/useInterval';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { calculateMicroPauseFactor } from '@/utils/micro-pause-utils';

export default function SpritzReader({
  initialWpm = 300,
  initialText = DEFAULT_TEXT,
  onThemeChange,
}: SpritzReaderProps) {
  const dispatch = useAppDispatch();
  const { isPlaying, wpm, words, text, currentWordIndex } = useAppSelector(state => state.reader);
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

  // Use the interval with the dynamic delay
  useInterval(() => {
    if (isPlaying) {
      dispatch(incrementWordIndex());
    }
  }, isPlaying ? currentDelay : null);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl font-semibold">Spritz Reader</CardTitle>
        <div className="flex space-x-2">
          <ThemeToggle />
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Display */}
        <WordDisplay />
        
        {/* Controls */}
        <ReaderControls />
        
        {/* WPM Slider */}
        <SpeedControl />
        
        {/* Progress indicator */}
        <ProgressBar />
        
        <Separator className="my-4" />
        
        {/* Text input */}
        <TextInput />
      </CardContent>
    </Card>
  );
}