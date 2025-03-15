'use client';

import { useAppSelector } from '@/redux/hooks';
import SpritzReader from '@/components/reader/SpritzReader';
import FocusMode from '@/components/reader/FocusMode';

export default function Home() {
  const { focusModeActive } = useAppSelector(state => state.settings);
  
  return (
    <>
      {focusModeActive && <FocusMode />}
      <main className="min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Spritz Speed Reading
          </h1>
          <SpritzReader />
        </div>
      </main>
    </>
  );
}