import React, { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import ScrollReveal from "@/components/ScrollReveal";
import TextScramble from "@/components/TextScramble";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Individual project card with mouse-tracking spotlight hover.
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpandedTags, setIsExpandedTags] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const spotX = useSpring(mouseX, { stiffness: 250, damping: 30 });
  const spotY = useSpring(mouseY, { stiffness: 250, damping: 30 });

  const gradientX = useTransform(spotX, (v) => `${v * 100}%`);
  const gradientY = useTransform(spotY, (v) => `${v * 100}%`);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full rounded-xl overflow-hidden cursor-default group"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Mouse-tracking spotlight */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) =>
                `radial-gradient(ellipse 250px 180px at ${x} ${y}, hsl(var(--primary) / 0.1) 0%, transparent 70%)`
            ),
          }}
        />

        {/* Glowing border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
          style={{
            boxShadow: "inset 0 0 0 1px hsl(var(--primary) / 0.2), 0 0 25px hsl(var(--primary) / 0.06)",
          }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full rounded-xl bg-black/5 dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] shadow-xl flex flex-col transition-colors duration-300 group-hover:border-transparent">
          <div className="relative overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              width={600}
              height={338}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              data-testid={`img-project-${index}`}
            />
          </div>

          <div className="p-4 flex flex-col flex-grow relative z-10">
            <h3 className="text-lg font-heading font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300" data-testid={`text-project-title-${index}`}>
              {project.title}
            </h3>
            <p className="text-muted-foreground mb-3 flex-grow text-xs leading-relaxed line-clamp-3" data-testid={`text-project-description-${index}`}>
              {project.description}
            </p>

            <motion.div layout className="flex flex-wrap gap-1.5 mb-4">
              <AnimatePresence>
                {(isExpandedTags ? project.tags : project.tags.slice(0, 3)).map((tag, tagIndex) => (
                  <motion.div
                    key={tag}
                    layout // Add layout prop for smooth repositioning
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-black/5 dark:border-white/5"
                      data-testid={`badge-project-${index}-tag-${tagIndex}`}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
                {project.tags.length > 3 && (
                  <motion.div layout key="expand-button">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0.5 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 opacity-60 cursor-pointer hover:opacity-100 transition-opacity select-none"
                      onClick={() => setIsExpandedTags(!isExpandedTags)}
                    >
                      {isExpandedTags ? "Show less" : `+${project.tags.length - 3} more`}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs bg-transparent border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 hover:text-primary"
                asChild
              >
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" data-testid={`button-project-${index}-github`}>
                  <Github className="w-3 h-3 mr-1.5" />
                  Code
                </a>
              </Button>
              {project.demoLink && (
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  asChild
                >
                  <a href={project.demoLink as string} target="_blank" rel="noopener noreferrer" data-testid={`button-project-${index}-demo`}>
                    <ExternalLink className="w-3 h-3 mr-1.5" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <section id="projects" className="py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    );
  }

  // Handle case where projects might be undefined or empty
  const safeProjects = projects || [];
  const categoryCounts = safeProjects.reduce((acc, p) => {
    const cat = p.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categories = ["All", ...Object.keys(categoryCounts)];

  const filteredProjects = activeCategory === "All"
    ? safeProjects
    : safeProjects.filter((p) => (p.category || "Other") === activeCategory);

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="w-[90%] lg:w-[95%] max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
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

          <ScrollReveal animation="fade-up" delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full transition-all ${activeCategory === category
                    ? "shadow-lg shadow-primary/25 scale-105"
                    : "hover:bg-primary/10 hover:text-primary border-primary/20"
                    }`}
                >
                  {category}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {category === "All" ? safeProjects.length : categoryCounts[category] || 0}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="col-span-full flex flex-col items-center justify-center py-16 text-center"
              >
                <p className="text-muted-foreground text-lg font-heading">No projects in this category yet.</p>
                <p className="text-muted-foreground/60 text-sm mt-2">Check back soon or browse other categories!</p>
              </motion.div>
            )}
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
});
