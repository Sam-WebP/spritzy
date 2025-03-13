'use client';

import { useState, useEffect } from 'react';
import SpritzReader from '@/components/reader/SpritzReader';
import { ColorTheme } from '@/types';
import { COLOR_THEMES } from '@/utils/constants';
import { useAppSelector } from '@/redux/hooks';

export default function Home() {
  const [pageTheme, setPageTheme] = useState<ColorTheme>(COLOR_THEMES[0]);
  const storeTheme = useAppSelector(state => state.settings.theme);
  
  // Sync page theme with store theme
  useEffect(() => {
    setPageTheme(storeTheme);
  }, [storeTheme]);

  return (
    <main 
      className="min-h-screen py-10 px-4 transition-colors duration-300"
      style={{ backgroundColor: pageTheme?.background || '#ffffff' }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 
          className="text-3xl font-bold text-center mb-8 transition-colors duration-300" 
          style={{ color: pageTheme?.text || '#374151' }}
        >
          Spritz Speed Reading
        </h1>
        <SpritzReader onThemeChange={setPageTheme} />
      </div>
    </main>
  );
}