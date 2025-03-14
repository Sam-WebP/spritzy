"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { removeCustomTheme } from "@/utils/theme-utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => {
        // Remove custom theme and switch between light/dark
        removeCustomTheme();
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? 
        <Sun className="h-[1.2rem] w-[1.2rem]" /> : 
        <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
}