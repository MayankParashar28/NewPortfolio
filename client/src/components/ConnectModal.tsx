
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { user } from "@/data";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ConnectModal({ trigger }: { trigger: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    return (
        <>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
                {trigger}
            </div>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)", filter: "brightness(100%) blur(10px)" }}
                            animate={{ opacity: 1, clipPath: "circle(150% at 50% 50%)", filter: "brightness(100%) blur(0px)" }}
                            exit={{
                                opacity: 0,
                                clipPath: "circle(0% at 50% 50%)", // The "burn" hole closing in
                                scale: 0.9, // Ash crumbling
                                filter: "brightness(50%) sepia(100%) saturate(500%) hue-rotate(-30deg) blur(5px) contrast(200%)" // Charred fire look
                            }}
                            transition={{
                                type: "tween",
                                ease: "circIn", // Accelerates like a rapid burn
                                duration: 0.8
                            }}
                            style={{
                                transformPerspective: 1000,
                                willChange: "transform, opacity, filter, clip-path",
                                backfaceVisibility: "hidden"
                            }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-background/60 backdrop-blur-[20px] supports-[backdrop-filter]:bg-background/40"
                        >
                            {/* Noise Texture for Premium Feel */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                            />

                            {/* Background Ambience */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 0],
                                        opacity: [0.2, 0.4, 0.2]
                                    }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"
                                />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        rotate: [0, -60, 0],
                                        opacity: [0.1, 0.3, 0.1]
                                    }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"
                                />
                            </div>

                            {/* Close Button - Outside logic */}
                            <div className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />

                            {/* Close Icon */}
                            <motion.button
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="absolute top-6 right-6 md:top-12 md:right-12 p-4 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 hover:border-foreground/20 backdrop-blur-md transition-all text-foreground z-50 group"
                            >
                                <X className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-500" />
                            </motion.button>

                            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center pointer-events-none">
                                {/* Left Side: Typography */}
                                <div className="space-y-8 text-left pointer-events-auto">
                                    <div className="overflow-hidden">
                                        <motion.h2
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-foreground"
                                        >
                                            LET'S
                                        </motion.h2>
                                    </div>
                                    <div className="overflow-hidden">
                                        <motion.h2
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                            className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"
                                        >
                                            CONNECT.
                                        </motion.h2>
                                    </div>

                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: 100 }}
                                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                        className="h-1.5 bg-foreground/20 rounded-full"
                                    />

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="text-lg md:text-2xl text-muted-foreground font-light max-w-lg leading-relaxed"
                                    >
                                        Use the links to reach out. I'm available for freelance work and new opportunities.
                                    </motion.p>
                                </div>

                                {/* Right Side: Cards */}
                                <div className="grid gap-4 md:gap-6 pointer-events-auto">
                                    {user.contact.map((contact, index) => {
                                        const Icon = contact.icon;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.6 + (index * 0.1),
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 15
                                                }}
                                                className="group relative"
                                            >
                                                {/* Premium Glow/Spotlight Effect */}
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-[2.1rem] blur opacity-0 group-hover:opacity-75 transition duration-500" />

                                                <a
                                                    href={contact.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative flex items-center p-5 md:p-7 rounded-[2rem] bg-black/40 border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-500 overflow-hidden"
                                                >
                                                    {/* Inner Shine */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    <div className="relative p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg group-hover:scale-110 group-hover:rotate-3">
                                                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                                                    </div>

                                                    <div className="ml-6 md:ml-8 flex-1 relative z-10">
                                                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-primary-foreground/90 transition-colors">{contact.label}</h3>
                                                        <p className="text-sm md:text-base text-zinc-400 group-hover:text-zinc-300 transition-colors mt-1 font-medium line-clamp-1">
                                                            {contact.value}
                                                        </p>
                                                    </div>

                                                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 group-hover:scale-110 overflow-hidden">
                                                        <ArrowUpRight className="absolute w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-hover:text-primary-foreground transition-all duration-500 group-hover:-translate-y-full group-hover:translate-x-full" />
                                                        <ArrowUpRight className="absolute w-5 h-5 md:w-6 md:h-6 text-primary-foreground transition-all duration-500 translate-y-full -translate-x-full group-hover:translate-y-0 group-hover:translate-x-0" />
                                                    </div>
                                                </a>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
