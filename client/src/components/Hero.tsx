import { Button } from "@/components/ui/button";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import Typewriter from "typewriter-effect";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import GlitchText from "@/components/GlitchText";
import Magnetic from "@/components/Magnetic";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";
import React, { useCallback } from "react";

export default function Hero() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const name = profile?.name || "Mayank Parashar";
  const title = profile?.title || "AI & Machine Learning Student";
  const tagline = profile?.tagline || "Building the Future with Artificial Intelligence";
  const githubUrl = profile?.githubUrl || "https://github.com";
  const linkedinUrl = profile?.linkedinUrl || "https://linkedin.com";
  const email = profile?.email || "mailto:email@example.com";

  // Mouse-tracking parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Different parallax layers
  const layer1X = useTransform(springX, (v) => v * -0.02);
  const layer1Y = useTransform(springY, (v) => v * -0.02);
  const layer2X = useTransform(springX, (v) => v * -0.01);
  const layer2Y = useTransform(springY, (v) => v * -0.01);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 relative z-10">
        <motion.div
          style={{ x: layer1X, y: layer1Y }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <span className="px-4 py-2 border border-border rounded-full text-sm font-medium backdrop-blur-sm bg-background/50" data-testid="text-badge">
              {title}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight"
            data-testid="text-hero-title"
          >
            <span className="block text-2xl sm:text-3xl mb-2 text-muted-foreground font-normal">
              Hello, I'm <GlitchText text={name} className="font-bold text-foreground" />
              <span className="block text-xl sm:text-2xl mt-1 text-muted-foreground/80 font-normal">AI/ML Engineer</span>
            </span>
            Building the Future with
            <span className="block mt-2 text-primary h-[1.2em]">
              <Typewriter
                options={{
                  strings: [
                    "Artificial Intelligence",
                    "Machine Learning",
                    "Generative AI",
                    "AI & LLMs",
                    "Data Science",
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 50,
                }}
              />
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-1 bg-foreground mx-auto mb-8"
          ></motion.div>
        </motion.div>

        <motion.div style={{ x: layer2X, y: layer2Y }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            data-testid="text-hero-description"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Magnetic strength={0.4}>
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                data-testid="button-view-projects"
                className="hover:scale-105 transition-transform"
              >
                View My Work
              </Button>
            </Magnetic>
            <Magnetic strength={0.4}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("contact")}
                data-testid="button-get-in-touch"
                className="hover:scale-105 transition-transform"
              >
                Get in Touch
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center justify-center gap-4"
          >
            {[
              { href: githubUrl, icon: Github, label: "GitHub", testId: "button-github", external: true },
              { href: linkedinUrl, icon: Linkedin, label: "LinkedIn", testId: "button-linkedin", external: true },
              { href: `mailto:${email}`, icon: Mail, label: "Email", testId: "button-email", external: false },
            ].map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.external ? "_blank" : undefined}
                rel={social.external ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Button variant="ghost" size="icon" data-testid={social.testId} aria-label={social.label}>
                  <social.icon className="w-5 h-5" />
                </Button>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hover-elevate active-elevate-2 p-2 rounded-full"
        data-testid="button-scroll-down"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-8 left-8 hidden lg:block max-w-xs"
      >
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/50 pl-3">
          "The best way to predict the future is to invent it." <br />
          <span className="not-italic text-[10px] opacity-70">– Alan Kay</span>
        </p>
      </motion.div>
    </section >
  );
}

