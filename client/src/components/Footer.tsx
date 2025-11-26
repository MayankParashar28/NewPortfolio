import { Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { user } from "@/data";
import confetti from "canvas-confetti";

export default function Footer() {
    const currentYear = new Date().getFullYear();

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

    return (
        <footer className="bg-card/95 backdrop-blur-sm border-t border-border py-2 rounded-t-lg shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} {user.name}. All rights reserved.
                        </p>

                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={triggerConfetti} className="focus:outline-none">
                        <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-300 hover:text-yellow-400 cursor-pointer transition-all hover:scale-110" />
                    </button>
                    <a href={user.socials.github} target="_blank" rel="noopener noreferrer" data-testid="footer-github">
                        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform" aria-label="GitHub">
                            <Github className="w-5 h-5" />
                        </Button>
                    </a>
                    <a href={user.socials.linkedin} target="_blank" rel="noopener noreferrer" data-testid="footer-linkedin">
                        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </Button>
                    </a>
                    <a href={user.socials.email} target="_self" data-testid="footer-email">
                        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform" aria-label="Email">
                            <Mail className="w-5 h-5" />
                        </Button>
                    </a>
                </div>
            </div >
        </footer >
    );
}
