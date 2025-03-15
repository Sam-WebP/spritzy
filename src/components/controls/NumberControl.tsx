'use client';

import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumberControlProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function NumberControl({
  label,
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = Infinity,
  className
}: NumberControlProps) {
  return (
    <div className={cn("flex items-center space-x-2 bg-muted px-3 py-1 rounded-md", className)}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onIncrement}
          disabled={value >= max}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="font-mono text-sm font-semibold">{value}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onDecrement}
          disabled={value <= min}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}