'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { startReading, pauseReading, resetReading } from '@/redux/slices/readerSlice';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function ReaderControls() {
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector(state => state.reader.isPlaying);

  return (
    <div className="flex justify-center gap-2 mb-4">
      {!isPlaying ? (
        <Button
          onClick={() => dispatch(startReading())}
          variant="default"
          size="sm"
          aria-label="Start reading"
          data-testid="play-button"
        >
          <Play className="h-4 w-4 mr-2" /> Start
        </Button>
      ) : (
        <Button
          onClick={() => dispatch(pauseReading())}
          variant="secondary"
          size="sm"
          aria-label="Pause reading"
          data-testid="pause-button"
        >
          <Pause className="h-4 w-4 mr-2" /> Pause
        </Button>
      )}

      <Button
        onClick={() => dispatch(resetReading())}
        variant="outline"
        size="sm"
        aria-label="Reset reading"
        data-testid="reset-button"
      >
        <RotateCcw className="h-4 w-4 mr-2" /> Reset
      </Button>
    </div>
  );
}
