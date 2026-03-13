import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextScramble from "@/components/TextScramble";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingTexts = [
    "Initializing Systems...",
    "Loading Neural Weights...",
    "Compiling Shaders...",
    "Ready."
  ];

  useEffect(() => {
    // Progress through the loading steps
    const timers = [
      setTimeout(() => setLoadingStep(1), 800),
      setTimeout(() => setLoadingStep(2), 1600),
      setTimeout(() => setLoadingStep(3), 2400),
      // Trigger the completion callback shortly after the final text
      setTimeout(() => onComplete(), 3200)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-auto"
      exit={{ 
        y: "-100%", 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <div className="relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-10 flex items-center justify-center"
          >
            <TextScramble 
              as="h2"
              text={loadingTexts[loadingStep]} 
              className="font-mono text-sm md:text-base text-primary/80 tracking-widest uppercase"
            />
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Progress Bar */}
        <div className="mt-8 w-48 h-[2px] bg-border overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(loadingStep / (loadingTexts.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
