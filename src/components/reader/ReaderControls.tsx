'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { startReading, pauseReading, resetReading } from '@/redux/slices/readerSlice';

export default function ReaderControls() {
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector(state => state.reader.isPlaying);
  
  return (
    <div className="flex justify-center gap-2 mb-4">
      <button 
        onClick={() => dispatch(resetReading())}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        aria-label="Reset reading"
      >
        Reset
      </button>
      {!isPlaying ? (
        <button 
          onClick={() => dispatch(startReading())}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          aria-label="Start reading"
        >
          Start
        </button>
      ) : (
        <button 
          onClick={() => dispatch(pauseReading())}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          aria-label="Pause reading"
        >
          Pause
        </button>
      )}
    </div>
  );
}