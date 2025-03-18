'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleFocusMode, updateNumericSetting } from '@/redux/slices/settingsSlice';
import { startReading, pauseReading, setCurrentWordIndex, setWpm, setWordsAtTime } from '@/redux/slices/readerSlice';
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import NumberControl from "@/components/controls/NumberControl";

export default function FocusMode() {
  const dispatch = useAppDispatch();
  const { currentWordIndex, words, isPlaying, currentWord, wordsAtTime, wpm } = useAppSelector((state) => state.reader);
  const { autoHideFocusControls, focusModeFont, focusModeFontSize, focusModeLetterSpacing, showFocusLetter, showFocusBorder } = useAppSelector(state => state.settings);
  const { resolvedTheme } = useTheme();
  
  // Container ref to check click targets
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State to track if controls should be visible
  const [showControls, setShowControls] = useState(true);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());
  const [cooldownActive, setCooldownActive] = useState(false);
  
  // Calculate progress percentage - fix to reach 100% at the end
  const percentage = words.length <= 1 
    ? (currentWordIndex > 0 ? 100 : 0) 
    : (currentWordIndex / (words.length - 1)) * 100;
  
  // Background color based on theme
  const bgColor = resolvedTheme === 'dark' ? "bg-black" : "bg-white";
  const textColor = resolvedTheme === 'dark' ? "text-white" : "text-black";
  
  const [dynamicFontSize, setDynamicFontSize] = useState(focusModeFontSize);

  // Function to estimate how many characters can fit on each side
  const calculateMaxCharacters = (fontSize: number, letterSpacing: number, screenWidth: number): number => {
    // For most fonts, average character width is roughly 0.6× font size plus letter spacing
    const avgCharWidth = fontSize * 0.6 + letterSpacing;
    
    // Calculate available width on each side (half screen minus some margin)
    const availableWidth = (screenWidth / 2) - 30; // 30px margin for safety
    
    // Calculate how many characters can fit
    return Math.floor(availableWidth / avgCharWidth);
  };

  // Function to calculate optimal font size to fit the word
  const calculateOptimalFontSize = (
    beforeLength: number,
    afterLength: number,
    maxChars: number,
    currentFontSize: number
  ): number => {
    // If everything fits, keep current size
    if (beforeLength <= maxChars && afterLength <= maxChars) {
      return currentFontSize;
    }
    
    // Calculate the ratio adjustment needed based on whichever side needs more reduction
    const ratioNeeded = Math.max(
      beforeLength > 0 ? beforeLength / maxChars : 0,
      afterLength > 0 ? afterLength / maxChars : 0
    );
    
    // Adjust font size accordingly (with a small extra margin)
    return Math.floor(currentFontSize / (ratioNeeded * 1.05));
  };

  // Add this effect to recalculate font size when word changes
useEffect(() => {
  // Get current screen width
  const screenWidth = window.innerWidth;
  
  // Calculate max characters that can fit
  const maxChars = calculateMaxCharacters(
    focusModeFontSize,
    focusModeLetterSpacing,
    screenWidth
  );
  
  // Calculate optimal font size for current word
  const newFontSize = calculateOptimalFontSize(
    currentWord.before.length,
    currentWord.after.length,
    maxChars,
    focusModeFontSize
  );
  
  // Update dynamic font size
  setDynamicFontSize(newFontSize);
  
  // Also recalculate on window resize
  const handleResize = () => {
    const width = window.innerWidth;
    const chars = calculateMaxCharacters(focusModeFontSize, focusModeLetterSpacing, width);
    setDynamicFontSize(calculateOptimalFontSize(
      currentWord.before.length, 
      currentWord.after.length, 
      chars, 
      focusModeFontSize
    ));
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
  
}, [currentWord, focusModeFontSize, focusModeLetterSpacing]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      dispatch(pauseReading());
    } else {
      dispatch(startReading());
      
      // When starting to play, activate cooldown and show controls briefly
      if (autoHideFocusControls) {
        setShowControls(true);
        setCooldownActive(true);
        
        // Hide controls after 1 second
        setTimeout(() => {
          setShowControls(false);
          // End cooldown after hiding
          setTimeout(() => setCooldownActive(false), 100);
        }, 1000);
      }
    }
  };
  
  // Handle clicks on the container
  const handleContainerClick = (e: React.MouseEvent) => {
    // Skip if clicking on a button or other interactive element
    const target = e.target as HTMLElement;
    const isButton = target.tagName === 'BUTTON' || 
                    target.closest('button') || 
                    target.closest('[role="button"]') ||
                    target.closest('.relative'); // Skip seek bar

    if (!isButton) {
      togglePlayPause();
    }
  };
  
  // Auto-hide controls effect - separate from initial playback
  useEffect(() => {
    // If not playing, not using auto-hide, or in cooldown, do nothing
    if (!isPlaying || !autoHideFocusControls || cooldownActive) {
      return;
    }
    
    // Only check for inactivity if controls are showing
    if (showControls) {
      const checkMouseInactive = () => {
        const now = Date.now();
        if (now - lastMouseMove > 2000) {
          setShowControls(false);
        }
      };
      
      const interval = setInterval(checkMouseInactive, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, showControls, lastMouseMove, autoHideFocusControls, cooldownActive]);
  
  // When play state changes, handle visibility
  useEffect(() => {
    // When stopping, always show controls
    if (!isPlaying) {
      setShowControls(true);
      setCooldownActive(false);
    }
  }, [isPlaying]);
  
  // Show controls on mouse movement (only if auto-hide is enabled and not in cooldown)
  const handleMouseMove = () => {
    if (autoHideFocusControls && !cooldownActive) {
      setLastMouseMove(Date.now());
      if (!showControls) {
        setShowControls(true);
      }
    }
  };
  
  // Handle key press (ESC to exit, Space to toggle play/pause)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(toggleFocusMode());
      } else if (e.key === ' ' || e.code === 'Space') {
        // Prevent page scroll when pressing space
        e.preventDefault();
        if (isPlaying) {
          dispatch(pauseReading());
        } else {
          dispatch(startReading());
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [dispatch, isPlaying]);
  
  // Handle seek bar interaction
  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newIndex = Math.floor(position * words.length);
    dispatch(setCurrentWordIndex(Math.max(0, Math.min(newIndex, words.length - 1))));
    
    // Prevent the click from bubbling to the container
    e.stopPropagation();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50", 
        bgColor
      )}
      onMouseMove={handleMouseMove}
      onClick={handleContainerClick}
    >
      {/* Header controls with editable settings */}
      {(showControls || !autoHideFocusControls) && (
        <div className="fixed top-0 left-0 w-full p-4 bg-background/80 backdrop-blur-sm transition-opacity z-10">
          <div className="max-w-3xl mx-auto flex flex-row justify-between items-center">
            <div className="flex flex-wrap justify-start gap-2 sm:gap-3">
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
                value={focusModeFontSize}
                onIncrement={() => dispatch(updateNumericSetting({
                  setting: 'focusModeFontSize',
                  value: Math.min(focusModeFontSize + 2, 72)
                }))}
                onDecrement={() => dispatch(updateNumericSetting({
                  setting: 'focusModeFontSize',
                  value: Math.max(focusModeFontSize - 2, 16)
                }))}
                min={16}
                max={72}
                className="text-xs sm:text-sm"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFocusMode());
              }}
              aria-label="Exit Focus Mode"
            >
              <X className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Exit Focus Mode</span>
            </Button>
          </div>
        </div>
      )}

      {/* Word display in the center */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
        <div className="relative flex justify-center items-center h-20">
          <div 
            className={cn(
              focusModeFont.className, 
              textColor,
              "grid grid-cols-[1fr_auto_1fr] w-full items-baseline"
            )}
            style={{ 
              fontSize: `${dynamicFontSize}px`, 
              letterSpacing: `${focusModeLetterSpacing}px`,
            }}
          >
            <div className="text-right pr-1">{currentWord.before}</div>
            <div 
              className={cn(
                "text-center",
                { "text-primary": showFocusLetter },
                { "border-b-2 border-primary": showFocusBorder }
              )}
            >
              {currentWord.pivot}
            </div>
            <div className="text-left pl-1">{currentWord.after}</div>
          </div>
        </div>
      </div>
      
      {/* Bottom controls with thinner progress bar */}
      {(showControls || !autoHideFocusControls) && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 space-y-4">
          {/* Thinner seek bar */}
          <div 
            className="relative w-full h-1.5 bg-secondary rounded-full overflow-hidden cursor-pointer"
            onClick={handleSeekBarClick}
          >
            <div 
              className="h-full bg-primary" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="text-xs text-center mt-1 text-muted-foreground">
            Word {currentWordIndex + 1}-{Math.min(currentWordIndex + wordsAtTime, words.length)}/{words.length}
          </div>
          
          <div className="flex justify-center gap-4">
            {!isPlaying ? (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(startReading());
                }}
                variant="ghost"
                size="sm"
                aria-label="Start reading"
              >
                <Play className="h-4 w-4 mr-2" /> Start
              </Button>
            ) : (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(pauseReading());
                }}
                variant="ghost"
                size="sm"
                aria-label="Pause reading"
              >
                <Pause className="h-4 w-4 mr-2" /> Pause
              </Button>
            )}

            <Button 
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setCurrentWordIndex(0));
              }}
              variant="ghost"
              size="sm"
              aria-label="Reset reading"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
