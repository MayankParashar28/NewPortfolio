import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 50, // Increased from 20
        scale: 0.95,
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    out: {
        opacity: 0,
        y: -50, // Increased from -20
        scale: 1.05,
    },
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.7, // Slower for visibility
};

export default function PageTransition({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={className}
            style={{ width: '100%', height: '100%' }} // Ensure it takes full space
        >
            {children}
        </motion.div>
    );
}
