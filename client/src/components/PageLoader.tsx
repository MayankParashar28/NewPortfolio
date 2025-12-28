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
                        {/* Minimal Spinner */}
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
                            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
                        </div>

                        {/* Minimal Text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                                Loading
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
