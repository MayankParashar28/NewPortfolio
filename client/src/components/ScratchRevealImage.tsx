import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ScratchRevealImageProps {
    src: string;
    revealSrc?: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function ScratchRevealImage({
    src,
    revealSrc,
    alt,
    width,
    height,
    className,
}: ScratchRevealImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const lensX = useSpring(mouseX, springConfig);
    const lensY = useSpring(mouseY, springConfig);

    const updateDimensions = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    };

    useEffect(() => {
        updateDimensions();
        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) observer.observe(containerRef.current);
        window.addEventListener("resize", updateDimensions);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Center the 200px lens
        mouseX.set(e.clientX - rect.left - 100);
        mouseY.set(e.clientY - rect.top - 100);
    };

    const imgX = useTransform(lensX, (x) => -x);
    const imgY = useTransform(lensY, (y) => -y);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden z-10 cursor-none ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            data-cursor-hidden="true"
        >
            {/* Base Image (Grayscale) */}
            <img
                src={src}
                alt={alt}
                className="w-full h-auto block object-cover grayscale"
                onLoad={updateDimensions}
            />

            {/* Lens (Blob) */}
            <motion.div
                className="absolute top-0 left-0 pointer-events-none z-20 overflow-hidden bg-background"
                style={{
                    x: lensX,
                    y: lensY,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isHovering ? 1 : 0,
                }}
                transition={{
                    opacity: { duration: 0.2 },
                }}
            >
                {/* Inner Reveal Image */}
                <motion.img
                    src={revealSrc || src}
                    alt={alt}
                    className="absolute max-w-none object-cover"
                    style={{
                        x: imgX,
                        y: imgY,
                        width: dimensions.width,
                        height: dimensions.height,
                        // Ensure it's visible even if loading fails (fallback color)
                        backgroundColor: "rgba(0,0,0,0.1)",
                    }}
                />
            </motion.div>
        </div>
    );
}
