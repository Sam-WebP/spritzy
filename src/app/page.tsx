'use client';

import { motion } from 'framer-motion';
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
      <motion.main
        className="min-h-screen py-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Spritzy
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SpritzReader />
          </motion.div>
        </motion.div>
      </motion.main>
    </>
  );
}
