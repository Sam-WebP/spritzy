'use client';

import { useAppSelector } from '@/redux/hooks';
import SpritzReader from '@/components/reader/SpritzReader';
import FocusMode from '@/components/reader/FocusMode';
import BackgroundGradient from '@/components/BackgroundGradient';

export default function Home() {
  const { focusModeActive } = useAppSelector(state => state.settings);
  
  return (
    <>
      {focusModeActive && <FocusMode />}
      <BackgroundGradient />
      <main className="min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Spritzy
          </h1>
          <SpritzReader />
        </div>
      </main>
    </>
  );
}