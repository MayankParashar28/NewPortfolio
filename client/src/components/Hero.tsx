import { Button } from "@/components/ui/button";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg"></div>
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 inline-block">
          <span className="px-4 py-2 rounded-full glassmorphism text-sm font-medium text-primary" data-testid="text-badge">
            AI & Machine Learning Student
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 glow-text-primary" data-testid="text-hero-title">
          Building the Future with
          <span className="block mt-2 bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Artificial Intelligence
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-hero-description">
          Passionate about creating intelligent systems and exploring the frontiers of machine learning, 
          deep learning, and neural networks. Transforming ideas into innovative AI solutions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="gradient-primary glow-border-primary"
            data-testid="button-view-projects"
          >
            View My Work
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("contact")}
            className="glassmorphism"
            data-testid="button-get-in-touch"
          >
            Get in Touch
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphism hover-elevate active-elevate-2"
            data-testid="button-github"
            onClick={() => console.log('GitHub clicked')}
          >
            <Github className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphism hover-elevate active-elevate-2"
            data-testid="button-linkedin"
            onClick={() => console.log('LinkedIn clicked')}
          >
            <Linkedin className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphism hover-elevate active-elevate-2"
            data-testid="button-email"
            onClick={() => console.log('Email clicked')}
          >
            <Mail className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="w-8 h-8 text-primary" />
      </button>
    </section>
  );
}
