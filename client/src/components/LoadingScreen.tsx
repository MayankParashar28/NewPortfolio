import { useEffect, useState } from 'react';
import { user } from '@/data';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Minimum loading time for animation to complete
    const minLoadTime = 2000;

    // Wait for both the minimum time and page load
    Promise.all([
      new Promise(resolve => setTimeout(resolve, minLoadTime)),
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', () => resolve(true));
        }
      })
    ]).then(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600); // Match fade-out duration
    });
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Name */}
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground animate-pulse-slow">
          {user.name}
        </h1>

        {/* Loading Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>

        {/* Tagline */}
        <p className="text-sm md:text-base text-muted-foreground animate-fade-in">
          {user.tagline}
        </p>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}
