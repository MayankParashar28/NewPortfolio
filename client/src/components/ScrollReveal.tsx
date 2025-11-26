import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
    duration?: number;
    delay?: number;
    className?: string;
    viewportMargin?: string;
}

const variants = {
    "fade-up": {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    },
    "fade-in": {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    "slide-left": {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    },
    "slide-right": {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    },
};

export default function ScrollReveal({
    children,
    animation = "fade-up",
    duration = 0.5,
    delay = 0,
    className = "",
    viewportMargin = "-50px", // Trigger when element is 50px into view
}: ScrollRevealProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: viewportMargin }}
            transition={{ duration, delay, ease: "easeOut" }}
            variants={variants[animation]}
            className={className}
        >
            {children}
        </motion.div>
    );
}
