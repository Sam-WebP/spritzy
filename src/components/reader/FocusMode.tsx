'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleFocusMode, updateNumericSetting } from '@/redux/slices/settingsSlice';
import { startReading, pauseReading, setCurrentWordIndex, setWpm, setWordsAtTime } from '@/redux/slices/readerSlice';
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import NumberControl from "@/components/controls/NumberControl";
import { useWindowSize } from '@/hooks/useWindowSize';

export default function FocusMode() {
  const dispatch = useAppDispatch();
  const { currentWordIndex, words, isPlaying, currentWord, wordsAtTime, wpm } = useAppSelector((state) => state.reader);
  const { autoHideFocusControls, focusModeFont, focusModeFontSize, focusModeLetterSpacing, showFocusLetter, showFocusBorder } = useAppSelector(state => state.settings);
  const { resolvedTheme } = useTheme();
  
  const { showFocusContext } = useAppSelector(state => state.settings);
  const { width: windowWidth } = useWindowSize();

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
  

  // Calculate context display
  const contextDisplay = useMemo(() => {
    if (!showFocusContext) return null;
    
    // Determine reasonable context size based on screen size and font size
    const maxContextWords = Math.max(2, Math.floor((windowWidth / focusModeFontSize) / 8));
    
    // Get previous words (already read)
    const startIdx = Math.max(0, currentWordIndex - maxContextWords);
    const previousWords = words.slice(startIdx, currentWordIndex).join(' ');
    
    // Get upcoming words (not yet read)
    const endIdx = Math.min(words.length, currentWordIndex + wordsAtTime + maxContextWords);
    const upcomingWords = words.slice(currentWordIndex + wordsAtTime, endIdx).join(' ');
    
    return { previousWords, upcomingWords };
  }, [showFocusContext, words, currentWordIndex, wordsAtTime, windowWidth, focusModeFontSize]);

  // Determine if we should use vertical layout
  const useVerticalLayout = useMemo(() => {
    if (!contextDisplay) return false;
    
    // Use vertical layout on narrower screens or when context is long
    return windowWidth < 768 || 
          (contextDisplay.previousWords.length + contextDisplay.upcomingWords.length) > windowWidth / 8;
  }, [contextDisplay, windowWidth]);

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
      {/* Restored header controls with WPM controls */}
      {(showControls || !autoHideFocusControls) && (
        <div className="fixed top-0 left-0 w-full p-4 bg-background/80 backdrop-blur-sm transition-opacity z-10">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <NumberControl
                label="WPM"
                value={wpm}
                onIncrement={() => dispatch(setWpm(Math.min(wpm + 10, 1000)))}
                onDecrement={() => dispatch(setWpm(Math.max(wpm - 10, 100)))}
                min={100}
                max={1000}
              />
              
              <NumberControl
                label="Words at a time"
                value={wordsAtTime}
                onIncrement={() => dispatch(setWordsAtTime(Math.min(wordsAtTime + 1, 5)))}
                onDecrement={() => dispatch(setWordsAtTime(Math.max(wordsAtTime - 1, 1)))}
                min={1}
                max={5}
              />
              
              <NumberControl
                label="Font size"
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
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFocusMode());
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Exit Focus Mode
            </Button>
          </div>
        </div>
      )}

      {/* Word display in the center */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
        <div className={cn(focusModeFont.className, textColor, "relative flex justify-center")}>
          {/* Main word always in center */}
          <div 
            className="relative z-10"
            style={{ 
              fontSize: `${focusModeFontSize}px`, 
              letterSpacing: `${focusModeLetterSpacing}px` 
            }}
          >
            <div className="flex items-baseline">
              <span>{currentWord.before}</span>
              <span 
                className={cn(
                  { "text-primary": showFocusLetter },
                  { "border-b-2 border-primary": showFocusBorder }
                )}
              >
                {currentWord.pivot}
              </span>
              <span>{currentWord.after}</span>
            </div>
          </div>
          
          {/* Context text */}
          {showFocusContext && contextDisplay && (
            <div className="absolute inset-0 flex items-baseline justify-center pointer-events-none">
              {/* This gives us a container spanning the full width */}
              <div className="w-full flex justify-center items-baseline">
                {useVerticalLayout ? (
                  <div className="flex flex-col items-center">
                    {/* Previous text above */}
                    <div 
                      className="text-muted-foreground opacity-60 text-center mb-8"
                      style={{ 
                        fontSize: `${focusModeFontSize * 0.6}px`, 
                        letterSpacing: `${focusModeLetterSpacing}px`,
                        position: "absolute",
                        top: `-${focusModeFontSize * 2}px`,
                        maxWidth: "80%"
                      }}
                    >
                      {contextDisplay.previousWords}
                    </div>
                    
                    {/* Invisible placeholder for main word */}
                    <div style={{ height: `${focusModeFontSize}px` }} className="invisible">
                      {currentWord.before}{currentWord.pivot}{currentWord.after}
                    </div>
                    
                    {/* Upcoming text below */}
                    <div 
                      className="text-muted-foreground opacity-60 text-center mt-8"
                      style={{ 
                        fontSize: `${focusModeFontSize * 0.6}px`, 
                        letterSpacing: `${focusModeLetterSpacing}px`,
                        position: "absolute",
                        bottom: `-${focusModeFontSize * 2}px`,
                        maxWidth: "80%"
                      }}
                    >
                      {contextDisplay.upcomingWords}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline px-4 max-w-full">
                    {/* Previous text with fixed gap */}
                    <div 
                      className="text-muted-foreground opacity-60 text-right mr-6 overflow-hidden"
                      style={{ 
                        fontSize: `${focusModeFontSize * 0.6}px`, 
                        letterSpacing: `${focusModeLetterSpacing}px`,
                        flex: 1
                      }}
                    >
                      {contextDisplay.previousWords}
                    </div>
                    
                    {/* Invisible placeholder for main word */}
                    <div className="invisible whitespace-nowrap flex-shrink-0" style={{ 
                      fontSize: `${focusModeFontSize}px`, 
                      letterSpacing: `${focusModeLetterSpacing}px` 
                    }}>
                      {currentWord.before}{currentWord.pivot}{currentWord.after}
                    </div>
                    
                    {/* Upcoming text with fixed gap */}
                    <div 
                      className="text-muted-foreground opacity-60 text-left ml-6 overflow-hidden"
                      style={{ 
                        fontSize: `${focusModeFontSize * 0.6}px`, 
                        letterSpacing: `${focusModeLetterSpacing}px`,
                        flex: 1
                      }}
                    >
                      {contextDisplay.upcomingWords}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
          </div>
        </div>
      )}
    </div>
  );
}