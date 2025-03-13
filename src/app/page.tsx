'use client';

import { useState } from 'react';
import SpritzReader from '@/components/SpritzReader';

interface ColorTheme {
  name: string;
  background: string;
  containerBackground: string;
  text: string;
  highlightText: string;
  highlightBorder: string;
  wordBackground: string;
}

export default function Home() {
  const [pageTheme, setPageTheme] = useState<ColorTheme>({
    name: 'Default',
    background: '#ffffff',
    containerBackground: '#ffffff',
    text: '#374151',
    highlightText: '#dc2626',
    highlightBorder: '#dc2626',
    wordBackground: '#f9fafb',
  });

  const handleThemeChange = (newTheme: ColorTheme) => {
    setPageTheme(newTheme);
  };

  return (
    <main 
      className="min-h-screen py-10 px-4 transition-colors duration-300"
      style={{ backgroundColor: pageTheme.background }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 
          className="text-3xl font-bold text-center mb-8 transition-colors duration-300" 
          style={{ color: pageTheme.text }}
        >
          Spritz Speed Reading
        </h1>
        <SpritzReader onThemeChange={handleThemeChange} />
      </div>
    </main>
  );
}