import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface TextScrambleProps {
    text: string;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    duration?: number;
    characterSet?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function TextScramble({
    text,
    className = "",
    as: Component = "span",
    duration = 1000,
    characterSet = DEFAULT_CHARS,
}: TextScrambleProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isInView && !isAnimating) {
            setIsAnimating(true);
            let iteration = 0;
            const totalIterations = text.length;
            const intervalDuration = duration / (totalIterations * 2); // Adjust speed based on length

            const interval = setInterval(() => {
                setDisplayText((prev) =>
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return characterSet[Math.floor(Math.random() * characterSet.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                    setIsAnimating(false);
                    setDisplayText(text); // Ensure final text is correct
                }

                iteration += 1 / 3; // Slower resolve for smoother effect
            }, 30);

            return () => clearInterval(interval);
        }
    }, [isInView, text, duration, characterSet]);

    return (
        <Component ref={ref as any} className={className} aria-label={text}>
            {displayText}
        </Component>
    );
}
