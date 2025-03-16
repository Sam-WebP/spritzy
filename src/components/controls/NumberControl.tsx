'use client';

import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumberControlProps {
  label: React.ReactNode;
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
    <div className={cn("flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-md", className)}>
      <span className="text-muted-foreground whitespace-nowrap text-xs sm:text-sm">{label}</span>
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onIncrement}
          disabled={value >= max}
        >
          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <span className="font-mono text-xs sm:text-sm font-semibold">{value}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onDecrement}
          disabled={value <= min}
        >
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}