'use client';

import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function WordDisplay() {
  const { currentWord } = useAppSelector(state => state.reader);
  const settings = useAppSelector(state => state.settings);
  
  return (
    <Card className="h-20 bg-background">
      <CardContent className="h-full flex items-center justify-center p-2">
        <div 
          className={cn(
            settings.font.className, 
            "grid grid-cols-[1fr_auto_1fr] items-baseline w-full"
          )}
          style={{ 
            fontSize: `${settings.fontSize}px`, 
            letterSpacing: `${settings.letterSpacing}px` 
          }}
          aria-live="assertive"
          aria-atomic="true"
        >
          {/* Before text - right aligned */}
          <div className="text-right pr-0.5">
            {currentWord.before}
          </div>
          
          {/* Pivot letter - centered */}
          <div 
            className={cn(
              "text-center",
              { "text-primary": settings.showFocusLetter },
              { "border-b-2 border-primary": settings.showFocusBorder }
            )}
          >
            {currentWord.pivot}
          </div>
          
          {/* After text - left aligned */}
          <div className="text-left pl-0.5">
            {currentWord.after}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}