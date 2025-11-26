import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
                >
                    <div className="flex flex-col items-center gap-6">
                        {/* Waving Hand Animation */}
                        <div className="relative">
                            {/* Glow effect */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-full bg-primary/20 blur-2xl w-32 h-32 -translate-x-1/4 -translate-y-1/4"
                            />

                            {/* Waving Hand Emoji */}
                            <motion.div
                                animate={{
                                    rotate: [0, 14, -8, 14, -4, 10, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatDelay: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="text-8xl relative z-10"
                                style={{ transformOrigin: "70% 70%" }}
                            >
                                👋
                            </motion.div>
                        </div>

                        {/* Welcome Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-heading font-bold mb-2">
                                Welcome!
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Loading portfolio...
                            </p>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
