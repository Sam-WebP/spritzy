'use client';

import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setText, processText } from '@/redux/slices/readerSlice';
import { toggleQuizDialog } from '@/redux/slices/quizSlice';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { debounce } from '@/utils/debounce-utils';

export default function TextInput() {
  const dispatch = useAppDispatch();
  const text = useAppSelector(state => state.reader.text);
  const [localText, setLocalText] = useState(text);
  
  // Process text change with debounce to avoid excessive processing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedProcessText = useCallback(
    debounce(() => {
      dispatch(processText());
    }, 500),
    [dispatch]
  );
  
  // Set text in Redux and trigger processing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    dispatch(setText(newText));
    debouncedProcessText();
  };
  
  // Initialize local text state from redux
  useEffect(() => {
    setLocalText(text);
  }, [text]);
  
  return (
    <div className="space-y-3">
      <Label htmlFor="text-input"><span className="text-muted-foreground whitespace-nowrap text-xs sm:text-sm">Text to Read</span></Label>
      <Textarea 
        id="text-input"
        value={localText} 
        onChange={handleTextChange}
        rows={8}
        placeholder="Enter or paste text to read..."
        className="resize-none bg-background"
      />
      <Button 
        onClick={() => dispatch(toggleQuizDialog())}
        className="w-full sm:w-auto"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate Quiz
      </Button>
    </div>
  );
}