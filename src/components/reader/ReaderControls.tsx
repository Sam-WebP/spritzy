interface ReaderControlsProps {
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function ReaderControls({
  isPlaying,
  onStart,
  onPause,
  onReset
}: ReaderControlsProps) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      <button 
        onClick={onReset}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        aria-label="Reset reading"
      >
        Reset
      </button>
      {!isPlaying ? (
        <button 
          onClick={onStart}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          aria-label="Start reading"
        >
          Start
        </button>
      ) : (
        <button 
          onClick={onPause}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          aria-label="Pause reading"
        >
          Pause
        </button>
      )}
    </div>
  );
}