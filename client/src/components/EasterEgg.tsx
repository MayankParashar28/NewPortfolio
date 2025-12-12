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

    const triggerConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

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
    };

    useEffect(() => {
        const handleTrigger = () => triggerConfetti();
        window.addEventListener("trigger-easter-egg", handleTrigger);
        return () => window.removeEventListener("trigger-easter-egg", handleTrigger);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setInput((prev) => {
                const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
                const newInput = [...prev, key];
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
            triggerConfetti();
            setInput([]);
        }
    }, [input]);

    return null;
}
