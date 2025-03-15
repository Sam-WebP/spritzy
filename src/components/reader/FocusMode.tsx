'use client';

import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleFocusMode } from '@/redux/slices/settingsSlice';
import { startReading, pauseReading, resetReading, setCurrentWordIndex } from '@/redux/slices/readerSlice';
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FocusMode() {
  const dispatch = useAppDispatch();
  const { currentWordIndex, words, isPlaying, currentWord } = useAppSelector((state) => state.reader);
  const { autoHideFocusControls, font, fontSize, letterSpacing, showFocusLetter, showFocusBorder } = useAppSelector(state => state.settings);
  const { resolvedTheme } = useTheme();
  
  // State to track if controls should be visible
  const [showControls, setShowControls] = useState(true);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());
  
  // Calculate progress percentage
  const percentage = words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0;
  
  // Background color based on theme
  const bgColor = resolvedTheme === 'dark' ? "bg-black" : "bg-white";
  const textColor = resolvedTheme === 'dark' ? "text-white" : "text-black";
  
  // Hide controls after a delay when playing (only if auto-hide is enabled)
  useEffect(() => {
    if (!isPlaying || !autoHideFocusControls) {
      setShowControls(true);
      return;
    }
    
    const checkMouseInactive = () => {
      const now = Date.now();
      if (now - lastMouseMove > 2000) {
        setShowControls(false);
      }
    };
    
    const interval = setInterval(checkMouseInactive, 500);
    return () => clearInterval(interval);
  }, [isPlaying, lastMouseMove, autoHideFocusControls]);
  
  // Show controls on mouse movement (only if auto-hide is enabled)
  const handleMouseMove = () => {
    if (autoHideFocusControls) {
      setLastMouseMove(Date.now());
      setShowControls(true);
    }
  };
  
  // Handle key press (ESC to exit)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(toggleFocusMode());
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [dispatch]);
  
  // Handle seek bar interaction
  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newIndex = Math.floor(position * words.length);
    dispatch(setCurrentWordIndex(Math.max(0, Math.min(newIndex, words.length - 1))));
  };
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50", 
        bgColor
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Clean, borderless word display in the center - directly rendering the word, not using Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4 h-20 flex items-center justify-center">
        <div 
          className={cn(
            font.className, 
            textColor,
            "flex items-baseline relative"
          )}
          style={{ 
            fontSize: `${fontSize}px`, 
            letterSpacing: `${letterSpacing}px` 
          }}
          aria-live="assertive"
          aria-atomic="true"
        >
          <div>{currentWord.before}</div>
          <div 
            className={cn(
              { "text-primary": showFocusLetter },
              { "border-b-2 border-primary": showFocusBorder }
            )}
          >
            {currentWord.pivot}
          </div>
          <div>{currentWord.after}</div>
        </div>
      </div>
      
      {/* Controls - positioned at the bottom, separate from word display */}
      {(showControls || !autoHideFocusControls) && (
        <>
          {/* Exit button */}
          <Button
            className="fixed top-4 right-4 z-10"
            size="sm"
            variant="ghost"
            onClick={() => dispatch(toggleFocusMode())}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 space-y-4">
            {/* Seek bar */}
            <div 
              className="relative w-full h-2 bg-secondary rounded-full overflow-hidden cursor-pointer"
              onClick={handleSeekBarClick}
            >
              <div 
                className="h-full bg-primary" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="text-xs text-center mt-1 text-muted-foreground">
              {currentWordIndex + 1}/{words.length} words
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => dispatch(resetReading())}
                variant="ghost"
                size="sm"
                aria-label="Reset reading"
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              
              {!isPlaying ? (
                <Button 
                  onClick={() => dispatch(startReading())}
                  variant="ghost"
                  size="sm"
                  aria-label="Start reading"
                >
                  <Play className="h-4 w-4 mr-2" /> Start
                </Button>
              ) : (
                <Button 
                  onClick={() => dispatch(pauseReading())}
                  variant="ghost"
                  size="sm"
                  aria-label="Pause reading"
                >
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}