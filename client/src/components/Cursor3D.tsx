import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useSound } from "@/hooks/useSound";

export default function Cursor3D() {
    const cursorLensRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const trailsRef = useRef<HTMLDivElement[]>([]);

    // State for rendering classes
    const [isHoveringState, setIsHoveringState] = useState(false);
    const [isClickingState, setIsClickingState] = useState(false);
    const [isHiddenState, setIsHiddenState] = useState(false);

    // Refs for logic (to avoid stale closures in event listeners/loops)
    const isHoveringRef = useRef(false);
    const isHiddenRef = useRef(false);
    const isClickingRef = useRef(false);

    const { theme } = useTheme();
    const { playHover, playClick } = useSound();

    // Refs for physics
    const mouseRef = useRef({ x: -100, y: -100 });
    const lensPosRef = useRef({ x: -100, y: -100 });
    // Trail history
    const trailHistoryRef = useRef<{ x: number, y: number }[]>([]);
    const requestRef = useRef<number>();

    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const handleScroll = () => {
            isScrollingRef.current = true;
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 150);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            // Update dot immediately
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                // Hide dot if hidden
                cursorDotRef.current.style.opacity = isHiddenRef.current ? '0' : '1';
            }
        };

        const handleMouseDown = () => {
            isClickingRef.current = true;
            setIsClickingState(true);
            playClick();
        };
        const handleMouseUp = () => {
            isClickingRef.current = false;
            setIsClickingState(false);
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (isScrollingRef.current) return;

            const target = e.target as HTMLElement;

            // Check for hidden cursor
            const shouldHide = !!target.closest('[data-cursor-hidden="true"]');

            if (shouldHide !== isHiddenRef.current) {
                isHiddenRef.current = shouldHide;
                setIsHiddenState(shouldHide);
            }

            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('hover-elevate') ||
                window.getComputedStyle(target).cursor === 'pointer';

            if (isClickable && !isHoveringRef.current) {
                playHover();
            }

            if (!!isClickable !== isHoveringRef.current) {
                isHoveringRef.current = !!isClickable;
                setIsHoveringState(!!isClickable);
            }
        };

        const handleMouseOut = () => {
            isHoveringRef.current = false;
            setIsHoveringState(false);
            // Don't reset hidden state on mouseout immediately, let mouseover handle it
            // or reset if leaving window? 
            // Actually, if we leave the element, mouseover on new element will fire.
            // But if we leave the window, we might want to reset.
            // For now, let's keep it simple.
            isHiddenRef.current = false;
            setIsHiddenState(false);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                mouseRef.current = { x: touch.clientX, y: touch.clientY };

                if (cursorDotRef.current) {
                    cursorDotRef.current.style.transform = `translate(${touch.clientX}px, ${touch.clientY}px) translate(-50%, -50%)`;
                }
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            isClickingRef.current = true;
            setIsClickingState(true);
            playClick();
            handleTouchMove(e);
        };

        const handleTouchEnd = () => {
            isClickingRef.current = false;
            setIsClickingState(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        const animate = () => {
            // 1. Lens Physics
            const ease = 0.12;
            lensPosRef.current.x += (mouseRef.current.x - lensPosRef.current.x) * ease;
            lensPosRef.current.y += (mouseRef.current.y - lensPosRef.current.y) * ease;

            if (cursorLensRef.current) {
                cursorLensRef.current.style.transform = `translate(${lensPosRef.current.x}px, ${lensPosRef.current.y}px) translate(-50%, -50%)`;
                // Apply hidden opacity here too to ensure sync
                cursorLensRef.current.style.opacity = isHiddenRef.current ? '0' : '1';
            }

            // 2. Trail Logic
            // Add current mouse pos to history
            trailHistoryRef.current.push({ ...mouseRef.current });
            if (trailHistoryRef.current.length > 12) { // Trail length
                trailHistoryRef.current.shift();
            }

            // Update trail elements
            trailHistoryRef.current.forEach((pos, index) => {
                // Create element if needed (lazy init for performance)
                if (!trailsRef.current[index]) {
                    const el = document.createElement('div');
                    el.className = 'cursor-trail-dot';
                    document.body.appendChild(el);
                    trailsRef.current[index] = el;
                }

                const el = trailsRef.current[index];
                const ratio = index / trailHistoryRef.current.length; // 0 to 1

                el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${ratio})`;

                // Hide trails if cursor is hidden
                if (isHiddenRef.current) {
                    el.style.opacity = '0';
                } else {
                    el.style.opacity = `${ratio * 0.5}`;
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            // Cleanup trails
            trailsRef.current.forEach(el => el.remove());
        };
    }, []);

    if (!document.body) return null;

    return createPortal(
        <>
            <style>{`
        * {
          cursor: none !important;
        }

        html, body, a, button, input, select, textarea {
          cursor: none !important;
        }

        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 100000;
          mix-blend-mode: difference;
          transition: opacity 0.2s ease;
        }

        .cursor-trail-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%; /* Should be circular */
          pointer-events: none;
          z-index: 99998;
          mix-blend-mode: difference;
          will-change: transform, opacity;
          /* Ensure no border or other styles interfere */
          border: none;
          outline: none;
          transition: opacity 0.2s ease;
        }

        .cursor-lens {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99990; /* Behind dot and trail */
          
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: invert(1) blur(1px);
          -webkit-backdrop-filter: invert(1) blur(1px);
          
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 15px rgba(0, 0, 0, 0.1),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
            
          transition: width 0.3s, height 0.3s, border-radius 0.3s, opacity 0.15s ease-out;
        }

        .cursor-lens.hovering {
          width: 80px;
          height: 80px;
          backdrop-filter: invert(1) blur(0px);
          -webkit-backdrop-filter: invert(1) blur(0px);
        }

        .cursor-lens.clicking {
          width: 30px;
          height: 30px;
          backdrop-filter: invert(1) blur(2px);
        }

        .cursor-hidden {
            opacity: 0 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }
      `}</style>
            <div ref={cursorDotRef} className={`cursor-dot ${isHiddenState ? 'cursor-hidden' : ''}`} />
            <div ref={cursorLensRef} className={`cursor-lens ${isHoveringState ? 'hovering' : ''} ${isClickingState ? 'clicking' : ''} ${isHiddenState ? 'cursor-hidden' : ''}`} />
        </>,
        document.body
    );
}
