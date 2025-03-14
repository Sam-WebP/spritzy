'use client';

import { useEffect } from 'react';
import SpritzReader from '@/components/reader/SpritzReader';
import { useAppSelector } from '@/redux/hooks';

export default function Home() {
  const storeTheme = useAppSelector(state => state.settings.theme);
  
  useEffect(() => {
    // Apply any custom theme properties if needed
    document.documentElement.style.setProperty('--custom-text', storeTheme.text);
    document.documentElement.style.setProperty('--custom-highlight', storeTheme.highlightText);
  }, [storeTheme]);

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Spritz Speed Reading
        </h1>
        <SpritzReader />
      </div>
    </main>
  );
}