"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({ 
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute={props.attribute || "class"}
      defaultTheme={props.defaultTheme || "system"}
      enableSystem={props.enableSystem !== false}
    >
      {children}
    </NextThemesProvider>
  );
}