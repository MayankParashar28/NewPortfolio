import { useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export default function GlitchText({ text, className = "", as: Component = "span" }: GlitchTextProps) {
  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>

      {/* Glitch Layers */}
      <span
        className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 glitch-layer-1"
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 glitch-layer-2"
        aria-hidden="true"
      >
        {text}
      </span>

      <style>{`
        @keyframes glitch-1 {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-2 {
          0% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
          100% { transform: translate(0); }
        }
        .group:hover .glitch-layer-1 {
          animation: glitch-1 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        .group:hover .glitch-layer-2 {
          animation: glitch-2 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite reverse;
        }
      `}</style>
    </Component>
  );
}
