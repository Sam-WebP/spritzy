'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setText, processText } from '@/redux/slices/readerSlice';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function TextInput() {
  const dispatch = useAppDispatch();
  const text = useAppSelector(state => state.reader.text);
  
  return (
    <div className="space-y-3">
      <Label htmlFor="text-input">Text to Read</Label>
      <Textarea 
        id="text-input"
        value={text} 
        onChange={(e) => dispatch(setText(e.target.value))}
        rows={5} 
        placeholder="Enter or paste text to read..."
        className="resize-none bg-background"
      />
      <Button 
        onClick={() => dispatch(processText())}
        className="w-full sm:w-auto"
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Update Text
      </Button>
    </div>
  );
}