import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import Magnetic from "@/components/Magnetic";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { user } from "@/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },

    { label: "Certificates", id: "certificates" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-background ${isScrolled ? "border-b border-border shadow-sm" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xl font-heading font-bold hover-elevate active-elevate-2 px-3 py-2 rounded-md"
              data-testid="button-logo"
            >
              {user.name}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Button
                  key={link.id}
                  variant="ghost"
                  onClick={() => scrollToSection(link.id)}
                  data-testid={`button-nav-${link.id}`}
                >
                  {link.label}
                </Button>
              ))}
            </div>
            <a href={user.resumeUrl} download="Mayank_Parashar_Resume.pdf">
              <Button variant="default" className="gap-2" data-testid="button-resume-download">
                <Download className="w-4 h-4" />
                Resume
              </Button>
            </a>
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <a href={user.resumeUrl} download="Mayank_Parashar_Resume.pdf">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-mobile-resume-icon"
                className="transition-transform hover:scale-110"
                aria-label="Download Resume"
              >
                <Download className="w-5 h-5" />
              </Button>
            </a>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              className="transition-transform duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="transform rotate-180 transition-transform duration-300" />
              ) : (
                <Menu className="transform rotate-0 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu with slide transition */}
      <div
        className="md:hidden bg-background border-t border-border overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isMobileMenuOpen ? '500px' : '0px' }}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Button
              key={link.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection(link.id)}
              data-testid={`button-mobile-nav-${link.id}`}
            >
              {link.label}
            </Button>
          ))}
          <a href={user.resumeUrl} download="Mayank_Parashar_Resume.pdf" className="block">
            <Button variant="default" className="w-full gap-2" data-testid="button-mobile-resume-download">
              <Download className="w-4 h-4" />
              Download Resume
            </Button>
          </a>

        </div>
      </div>
    </motion.nav>
  );
}
