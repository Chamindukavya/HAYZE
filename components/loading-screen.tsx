'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import darkLogo from '@/app/public/images/HAYZE LOGO Dark mode.png';
import lightLogo from '@/app/public/images/HAYZ LOGO Light mode.png';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo = mounted && theme === 'dark' ? darkLogo : lightLogo;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative h-20 w-52 sm:h-24 sm:w-64"
          >
            <Image
              src={logo}
              alt="HAYZE"
              fill
              priority
              sizes="(max-width: 640px) 208px, 256px"
              className="object-contain scale-140"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
