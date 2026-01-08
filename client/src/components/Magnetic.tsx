import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Magnetic({ children, strength = 1 }: { children: ReactNode; strength?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    // 1. Use MotionValues to trigger animations without triggering React re-renders (Performance)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // 2. Physics: Higher mass + damping = "Fluid" liquid feel instead of "Bouncy" jitter
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const targetX = (clientX - (left + width / 2)) * strength;
        const targetY = (clientY - (top + height / 2)) * strength;

        x.set(targetX);
        y.set(targetY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }} // Bind directly to style to bypass React render cycle
        >
            {children}
        </motion.div>
    );
}
