import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function EasterEgg() {
    const [input, setInput] = useState<string[]>([]);
    const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
    ];

    const magicCode = ["m", "a", "g", "i", "c"];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setInput((prev) => {
                // Convert to lowercase to handle "B" vs "b"
                const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
                const newInput = [...prev, key];
                // Keep buffer long enough for the longest code (Konami = 10)
                if (newInput.length > konamiCode.length) {
                    newInput.shift();
                }

                return newInput;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        const checkCode = (code: string[], target: string[]) => {
            return JSON.stringify(code.slice(-target.length)) === JSON.stringify(target);
        };

        if (checkCode(input, konamiCode) || checkCode(input, magicCode)) {
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // Increased z-index

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                });
            }, 250);

            setInput([]); // Reset after triggering
        }
    }, [input]);

    return null;
}
