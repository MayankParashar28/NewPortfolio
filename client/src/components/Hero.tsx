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
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="mb-8 inline-block">
          <span className="px-4 py-2 border border-border rounded-full text-sm font-medium" data-testid="text-badge">
            AI & Machine Learning Student
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight" data-testid="text-hero-title">
          Building the Future with
          <span className="block mt-2">
            Artificial Intelligence
          </span>
        </h1>

        <div className="w-24 h-1 bg-foreground mx-auto mb-8"></div>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed" data-testid="text-hero-description">
          Passionate about creating intelligent systems and exploring the frontiers of machine learning, 
          deep learning, and neural networks. Transforming ideas into innovative AI solutions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            data-testid="button-view-projects"
          >
            View My Work
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("contact")}
            data-testid="button-get-in-touch"
          >
            Get in Touch
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-github"
            onClick={() => console.log('GitHub clicked')}
          >
            <Github className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-linkedin"
            onClick={() => console.log('LinkedIn clicked')}
          >
            <Linkedin className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-email"
            onClick={() => console.log('Email clicked')}
          >
            <Mail className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hover-elevate active-elevate-2 p-2 rounded-full"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
