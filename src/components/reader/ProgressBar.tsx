'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setCurrentWordIndex } from '@/redux/slices/readerSlice';
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from 'react';

export default function ProgressBar({ interactive = false }) {
  const dispatch = useAppDispatch();
  const { currentWordIndex, words } = useAppSelector((state) => state.reader);
  const [isDragging, setIsDragging] = useState(false);
  
  const current = currentWordIndex;
  const total = words.length;
  
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  
  // Handle click/drag on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newIndex = Math.floor(position * total);
    dispatch(setCurrentWordIndex(Math.max(0, Math.min(newIndex, total - 1))));
  };
  
  // Mouse event handlers for scrubbing functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setIsDragging(true);
    handleProgressClick(e);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) return;
    handleProgressClick(e);
  };
  
  const handleMouseUp = () => {
    if (!interactive) return;
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (interactive) {
      const globalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', globalMouseUp);
      return () => window.removeEventListener('mouseup', globalMouseUp);
    }
  }, [interactive]);
  
  return (
    <div className="mb-4 space-y-2">
      <div
        className={`${interactive ? "cursor-pointer hover:opacity-80" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleProgressClick}
      >
        <Progress value={percentage} className="w-full" />
      </div>
      <div className="text-xs text-right mt-1 text-muted-foreground">
        {current + 1}/{total} words
      </div>
    </div>
  );
}