import { Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { user } from "@/data";

const socialLinks = [
    { href: user.socials.github, icon: Github, label: "GitHub", testId: "footer-github", external: true },
    { href: user.socials.linkedin, icon: Linkedin, label: "LinkedIn", testId: "footer-linkedin", external: true },
    { href: user.socials.email, icon: Mail, label: "Email", testId: "footer-email", external: false },
];

export default function Footer() {
    return (
        <footer className="bg-card/95 backdrop-blur-sm border-t border-border py-2 rounded-t-lg shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} {user.name}. All rights reserved.
                        </p>
                        <span className="hidden md:inline text-xs text-muted-foreground/50">|</span>
                        <p className="text-xs text-muted-foreground/75">
                            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:text-primary transition-transform will-change-transform"
                        onClick={() => window.dispatchEvent(new CustomEvent("trigger-easter-egg"))}
                        aria-label="Trigger AI Magic"
                        asChild
                    >
                        <motion.button
                            whileHover={{ scale: 1.15, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            <Sparkles className="w-5 h-5" />
                        </motion.button>
                    </Button>
                    {socialLinks.map((social) => (
                        <Button 
                            key={social.label} 
                            variant="ghost" 
                            size="icon" 
                            aria-label={social.label} 
                            className="rounded-full hover:text-primary transition-transform will-change-transform" 
                            asChild
                        >
                            <motion.a
                                href={social.href}
                                target={social.external ? "_blank" : "_self"}
                                rel={social.external ? "noopener noreferrer" : undefined}
                                data-testid={social.testId}
                                whileHover={{ scale: 1.2, rotate: 8 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <social.icon className="w-5 h-5" />
                            </motion.a>
                        </Button>
                    ))}
                </div>
            </div>
        </footer>
    );
}

