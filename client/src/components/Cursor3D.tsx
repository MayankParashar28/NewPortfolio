import { useEffect, useRef } from "react";

export default function Cursor3D() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      if (glow1Ref.current) glow1Ref.current.style.opacity = "1";
      if (glow2Ref.current) glow2Ref.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (glow1Ref.current) glow1Ref.current.style.opacity = "0";
      if (glow2Ref.current) glow2Ref.current.style.opacity = "0";
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      const pulse1 = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
      const pulse2 = 0.6 + Math.sin(Date.now() * 0.003 + Math.PI) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX - 6}px`;
        cursorRef.current.style.top = `${cursorY - 6}px`;
      }

      if (glow1Ref.current) {
        glow1Ref.current.style.left = `${cursorX - 20}px`;
        glow1Ref.current.style.top = `${cursorY - 20}px`;
        glow1Ref.current.style.transform = `scale(${pulse1})`;
      }

      if (glow2Ref.current) {
        glow2Ref.current.style.left = `${cursorX - 35}px`;
        glow2Ref.current.style.top = `${cursorY - 35}px`;
        glow2Ref.current.style.transform = `scale(${pulse2})`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }

        .cursor-3d {
          position: fixed;
          width: 12px;
          height: 12px;
          border: 2px solid currentColor;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: multiply;
          color: rgb(0, 0, 0);
          will-change: left, top;
          opacity: 1;
          transition: opacity 0.2s ease;
        }

        .dark .cursor-3d {
          color: rgb(255, 255, 255);
        }

        .cursor-glow-1 {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          will-change: left, top, transform;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.08) inset;
          opacity: 1;
          transition: opacity 0.2s ease;
        }

        .dark .cursor-glow-1 {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.08) inset;
        }

        .cursor-glow-2 {
          position: fixed;
          width: 70px;
          height: 70px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9997;
          will-change: left, top, transform;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.05) inset;
          opacity: 1;
          transition: opacity 0.2s ease;
        }

        .dark .cursor-glow-2 {
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.05) inset;
        }
      `}</style>

      <div ref={cursorRef} className="cursor-3d"></div>
      <div ref={glow1Ref} className="cursor-glow-1"></div>
      <div ref={glow2Ref} className="cursor-glow-2"></div>
    </>
  );
}
