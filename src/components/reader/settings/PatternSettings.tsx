'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setHighlightPattern } from '@/redux/slices/readerSlice';
import { DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { parsePatternString } from '@/utils/color-utils';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings } from "lucide-react";

export default function PatternSettings() {
  const dispatch = useAppDispatch();
  const { highlightPattern } = useAppSelector(state => state.reader);
  
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState<boolean>(false);
  const [newPattern, setNewPattern] = useState<string>('');

  const openPatternEditor = () => {
    const formattedPattern = highlightPattern
      .map(rule => `${rule.maxLength}:${rule.highlightIndex}`)
      .join(', ');
    setNewPattern(formattedPattern);
    setIsPatternEditorOpen(true);
  };

  const handleApplyPattern = () => {
    try {
      const patternRules = parsePatternString(newPattern);
      dispatch(setHighlightPattern(patternRules));
      setIsPatternEditorOpen(false);
    } catch {
      alert('Invalid pattern format. Please use the format "maxLength:highlightIndex" separated by commas.');
    }
  };

  const handleResetPattern = () => {
    dispatch(setHighlightPattern(DEFAULT_HIGHLIGHT_PATTERN));
    setIsPatternEditorOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label className="text-base">Highlight Pattern</Label>
        <Button 
          variant="outline" 
          size="sm"
          onClick={openPatternEditor}
        >
          <Settings className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </div>
      
      {isPatternEditorOpen && (
        <Card className="border-dashed mt-2">
          <CardContent className="pt-4 space-y-3">
            <Alert variant="default" className="text-xs">
              <AlertDescription>
                Format: &ldquo;maxLength:highlightIndex&rdquo; separated by commas<br/>
                Example: &ldquo;4:0, 6:1, 8:2, 10:3&rdquo; means:
                <br/>- Words up to 4 chars: highlight 1st letter (index 0)
                <br/>- Words 5-6 chars: highlight 2nd letter (index 1)
                <br/>- etc.
              </AlertDescription>
            </Alert>
            
            <Input 
              type="text" 
              value={newPattern} 
              onChange={(e) => setNewPattern(e.target.value)}
              placeholder="4:0, 6:1, 8:2, 10:3, ..."
              aria-label="Enter highlight pattern"
            />
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleApplyPattern}>Apply Pattern</Button>
              <Button size="sm" variant="outline" onClick={handleResetPattern}>Reset</Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsPatternEditorOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}