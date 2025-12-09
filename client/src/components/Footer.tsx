import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

import { user } from "@/data";

export default function Footer() {
    const currentYear = new Date().getFullYear();

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
                            Last updated: December 2025
                        </p>

                    </div>
                </div>
                <div className="flex items-center gap-4">
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
