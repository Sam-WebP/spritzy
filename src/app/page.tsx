'use client';

import SpritzReader from '@/components/reader/SpritzReader';

export default function Home() {
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