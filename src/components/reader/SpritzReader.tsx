'use client';

import { useEffect } from 'react';
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

export default function SpritzReader({
  initialWpm = 300,
  initialText = DEFAULT_TEXT,
  onThemeChange,
}: SpritzReaderProps) {
  const dispatch = useAppDispatch();
  const { isPlaying, wpm } = useAppSelector(state => state.reader);
  const { theme } = useAppSelector(state => state.settings);
  
  // Initialize with props if provided
  useEffect(() => {
    dispatch(setText(initialText));
    dispatch(setWpm(initialWpm));
    dispatch(processText());
  }, [dispatch, initialText, initialWpm]);
  
  // Notify parent component about theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [theme, onThemeChange]);

  // Reading interval
  useInterval(() => {
    if (isPlaying) {
      dispatch(incrementWordIndex());
    }
  }, isPlaying ? 60000 / wpm : null);
  
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