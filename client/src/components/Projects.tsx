import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Tilt } from "react-tilt";
import { user } from "@/data";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";
import TextScramble from "@/components/TextScramble";

const defaultOptions = {
  reverse: false,
  max: 15,
  perspective: 1000,
  scale: 1.02,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

export default React.memo(function Projects() {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal animation="fade-up">
            <TextScramble
              text="Featured Projects"
              as="h2"
              className="text-4xl sm:text-5xl font-heading font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 inline-block"
            />
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
              Innovative AI solutions showcasing practical applications of machine learning
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.projects.map((project, index) => (
            <ScrollReveal
              key={index}
              animation="fade-up"
              delay={index * 0.1}
              className="h-full"
            >
              <Tilt options={defaultOptions} className="h-full">
                <SpotlightCard className="h-full rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl group hover:border-primary/30 transition-all duration-300 flex flex-col">
                  <div className="relative overflow-hidden aspect-video">
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={338}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                      data-testid={`img-project-${index}`}
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-grow relative z-10">
                    <h3 className="text-lg font-heading font-bold mb-2 text-foreground group-hover:text-primary transition-colors" data-testid={`text-project-title-${index}`}>
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 flex-grow text-xs leading-relaxed line-clamp-3" data-testid={`text-project-description-${index}`}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0.5 bg-white/5 hover:bg-white/10 border-white/5"
                          data-testid={`badge-project-${index}-tag-${tagIndex}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs bg-transparent border-white/20 hover:bg-white/10 hover:text-primary"
                        onClick={() => window.open(project.links.github, "_blank")}
                        data-testid={`button-project-${index}-github`}
                      >
                        <Github className="w-3 h-3 mr-1.5" />
                        Code
                      </Button>
                      {project.links.demo && project.links.demo !== "#" && (
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => window.open(project.links.demo, "_blank")}
                          data-testid={`button-project-${index}-demo`}
                        >
                          <ExternalLink className="w-3 h-3 mr-1.5" />
                          Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </Tilt>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
});
