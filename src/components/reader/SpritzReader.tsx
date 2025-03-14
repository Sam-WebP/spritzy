'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SpritzReaderProps } from '@/types';
import { DEFAULT_TEXT } from '@/utils/constants';
import { COLOR_THEMES } from '@/utils/constants';
import { updateTheme } from '@/redux/slices/settingsSlice';
import { setText, setWpm, processText, incrementWordIndex } from '@/redux/slices/readerSlice';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WordDisplay from './WordDisplay';
import ReaderControls from './ReaderControls';
import SpeedControl from './SpeedControl';
import ProgressBar from './ProgressBar';
import TextInput from './TextInput';
import SettingsPanel from './SettingsPanel';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInterval } from '@/hooks/useInterval';

export default function SpritzReader({
  initialWpm = 300,
  initialText = DEFAULT_TEXT,
  onThemeChange,
}: SpritzReaderProps) {
  const dispatch = useAppDispatch();
  const { isPlaying, wpm } = useAppSelector(state => state.reader);
  const { theme } = useAppSelector(state => state.settings);
  
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
          aria-expanded={isSettingsPanelOpen}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Display */}
        <WordDisplay />
        
        {/* Settings Panel (conditionally rendered) */}
        {isSettingsPanelOpen && <SettingsPanel />}
        
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