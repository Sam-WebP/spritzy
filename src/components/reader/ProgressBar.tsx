'use client';

import { useAppSelector } from '@/redux/hooks';
import { Progress } from "@/components/ui/progress";

export default function ProgressBar() {
  const { currentWordIndex, words } = useAppSelector((state) => state.reader);
  
  const current = currentWordIndex;
  const total = words.length;
  
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  
  return (
    <div className="mb-4 space-y-2">
      <Progress value={percentage} className="w-full" />
      <div className="text-xs text-right mt-1 text-muted-foreground">
        {current + 1}/{total} words
      </div>
    </div>
  );
}