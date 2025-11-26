import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/ThemeProvider";
import { user } from "@/data";
import { useSound } from "@/hooks/useSound"; // Import hook

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
}

export default function InteractiveSelection() {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
    const isSelecting = useRef(false);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { theme } = useTheme();
    const { playShockwave } = useSound(); // Destructure function

    useEffect(() => {
        const handleMouseDown = () => {
            isSelecting.current = true;
        };

        const handleMouseUp = () => {
            isSelecting.current = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            if (isSelecting.current) {
                // Increased probability for visibility
                if (Math.random() > 0.5) {
                    const id = Date.now() + Math.random();

                    // Theme-based colors
                    const lightColors = ["#2563eb", "#9333ea", "#06b6d4"]; // Blue, Purple, Cyan
                    const darkColors = ["#ff0080", "#00ffff", "#ffffff"]; // Pink, Cyan, White
                    const colors = theme === "dark" ? darkColors : lightColors;

                    const color = colors[Math.floor(Math.random() * colors.length)];

                    setSparkles(prev => [...prev, {
                        id,
                        x: e.clientX + (Math.random() - 0.5) * 20,
                        y: e.clientY + (Math.random() - 0.5) * 20,
                        size: Math.random() * 4 + 2,
                        color
                    }]);

                    setTimeout(() => {
                        setSparkles(prev => prev.filter(s => s.id !== id));
                    }, 500);
                }
            }
        };

        // Use document with capture to ensure we catch events even if propagation is stopped
        document.addEventListener("mousedown", handleMouseDown, true);
        document.addEventListener("mouseup", handleMouseUp, true);
        document.addEventListener("mousemove", handleMouseMove, true);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown, true);
            document.removeEventListener("mouseup", handleMouseUp, true);
            document.removeEventListener("mousemove", handleMouseMove, true);
        };
    }, [theme]);

    useEffect(() => {
        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', 'Mayank Parashar');
            }

            playShockwave();

            // Trigger 3D shockwave
            // Calculate center of selection
            let x = mouseRef.current.x;
            let y = mouseRef.current.y;

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }

            // Dispatch event with coordinates (normalized for 3D, pixels for CSS)
            window.dispatchEvent(new CustomEvent("trigger-shockwave", {
                detail: {
                    x: (x / window.innerWidth) * 2 - 1,
                    y: -(y / window.innerHeight) * 2 + 1
                }
            }));

            // Trigger CSS ripple
            const id = Date.now();
            setRipples(prev => [...prev, { id, x, y }]);
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== id));
            }, 1000);
        };

        document.addEventListener("copy", handleCopy);
        return () => document.removeEventListener("copy", handleCopy);
    }, []);

    // Ensure we have a body to portal to
    if (!document.body) return null;

    return createPortal(
        <>
            {sparkles.map(sparkle => (
                <div
                    key={sparkle.id}
                    style={{
                        position: "fixed",
                        left: sparkle.x,
                        top: sparkle.y,
                        width: sparkle.size,
                        height: sparkle.size,
                        backgroundColor: sparkle.color,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        zIndex: 99999, // Super high z-index
                        boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
                        animation: "fade-out 0.5s forwards"
                    }}
                />
            ))}
            {ripples.map(ripple => (
                <div
                    key={ripple.id}
                    className="copy-ripple-effect"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: "100vmax",
                        height: "100vmax",
                        transform: "translate(-50%, -50%) scale(0)",
                    }}
                />
            ))}
            <style>{`
        @keyframes fade-out {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
        </>,
        document.body
    );
}
