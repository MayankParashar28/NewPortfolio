import { Button } from "@/components/ui/button";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import GlitchText from "@/components/GlitchText";
import Magnetic from "@/components/Magnetic";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";

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

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 relative z-10">
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
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" data-testid="button-github" className="hover:scale-110 transition-transform">
              <Github className="w-5 h-5" />
            </Button>
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" data-testid="button-linkedin" className="hover:scale-110 transition-transform">
              <Linkedin className="w-5 h-5" />
            </Button>
          </a>
          <a href={`mailto:${email}`}>
            <Button variant="ghost" size="icon" data-testid="button-email" className="hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </Button>
          </a>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hover-elevate active-elevate-2 p-2 rounded-full"
        data-testid="button-scroll-down"
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
