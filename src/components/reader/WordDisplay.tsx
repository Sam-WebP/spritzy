'use client';

import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function WordDisplay() {
  const { currentWord } = useAppSelector(state => state.reader);
  const settings = useAppSelector(state => state.settings);
  
  return (
    <Card className="h-20">
      <CardContent className="h-full flex items-center justify-center p-2">
        <div 
          className={cn(
            settings.font.className, 
            "flex items-baseline relative"
          )}
          style={{ 
            fontSize: `${settings.fontSize}px`, 
            letterSpacing: `${settings.letterSpacing}px` 
          }}
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="text-foreground">{currentWord.before}</div>
          <div 
            className={cn(
              "text-primary",
              { "border-b-2 border-primary": settings.showFocusBorder }
            )}
          >
            {currentWord.pivot}
          </div>
          <div className="text-foreground">{currentWord.after}</div>
        </div>
      </CardContent>
    </Card>
  );
}