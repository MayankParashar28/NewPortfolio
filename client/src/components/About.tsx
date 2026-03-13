import { Card } from "@/components/ui/card";
import { Brain, Code2, Cpu, Sparkles, Target, Workflow, Zap } from "lucide-react";
import { useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";
import TextScramble from "@/components/TextScramble";
import ScratchRevealImage from "@/components/ScratchRevealImage";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";
import myPhoto from "@assets/myphoto.png"; // Fallback/Default

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const bio = profile?.bio || "Passionate about AI and ML.";
  const techFocus = "Current focus: LLM agents, RAG, and scalable ML systems on cloud (AWS)."; // This part wasn't in schema, keeping static for now or could be part of bio.

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  const highlights = [
    {
      icon: Brain,
      title: "LLM & GenAI Builder",
      description: "Building intelligent agents and RAG pipelines using Llama 3, Groq, and LangChain."
    },
    {
      icon: Workflow,
      title: "End-to-end ML Engineer",
      description: "Managing the full lifecycle from data processing to deploying scalable models on AWS."
    },
    {
      icon: Zap,
      title: "Production Mindset",
      description: "Focusing on inference optimization, latency reduction, and robust system architecture."
    }
  ];

  const FLOATING_ICONS = [Brain, Code2, Cpu, Zap, Target, Workflow];

  return (
    <section id="about" className="pt-10 pb-20 md:pt-16 md:pb-32 px-4 sm:px-6 lg:px-8 border-t border-border min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden">
      {/* Floating Tech Particles Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20 dark:opacity-10">
        {FLOATING_ICONS.map((Icon, idx) => (
          <motion.div
            key={idx}
            className="absolute text-primary"
            initial={{ 
              y: "-20vh", 
              x: `${(idx * 100) / FLOATING_ICONS.length}vw`,
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: "120vh",
              x: `${(idx * 100) / FLOATING_ICONS.length + (Math.random() * 10 - 5)}vw`,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 20 + 25,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * -30 // Start at different times
            }}
          >
            <Icon className="w-16 h-16 sm:w-24 sm:h-24" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <TextScramble
            text="About Me"
            as="h2"
            className="text-3xl sm:text-4xl font-heading font-bold mb-4 inline-block"
          />
          <div className="w-20 h-1 bg-foreground mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.02,
                    delayChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed flex flex-wrap gap-x-1"
              data-testid="text-about-paragraph-1"
            >
              {bio.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.4, ease: "easeOut" },
                    },
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <ScrollReveal animation="fade-up" delay={0.25}>
              <div className="flex items-center gap-2 mb-8 text-xs sm:text-sm font-medium text-foreground bg-primary/10 p-1.5 rounded-md border border-primary/20 inline-block">
                <Cpu className="w-3 h-3 text-primary" />
                <span>{techFocus}</span>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {highlights.map((item, index) => (
                <MagneticHighlightCard key={index} item={item} index={index} />
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <motion.div
              ref={containerRef}
              style={{ y, opacity }}
              className="relative border border-border p-2 w-full max-w-xl mx-auto"
            >
              <ScratchRevealImage
                src={myPhoto}
                alt={`Mayank Parashar - AI/ML Engineer`}
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MagneticHighlightCard({ item, index }: { item: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const tx = useTransform(springX, [0, 1], [-6, 6]);
  const ty = useTransform(springY, [0, 1], [-4, 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <ScrollReveal animation="fade-up" delay={0.3 + index * 0.1} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: tx, y: ty }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="h-full cursor-pointer"
      >
        <SpotlightCard className="h-full">
          <Card className="p-3 border border-border hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all h-full bg-transparent group" data-testid={`card-highlight-${index}`}>
            <motion.div
              whileHover={{ rotate: [0, -12, 12, 0] }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-block"
            >
              <item.icon className="w-6 h-6 mb-2 group-hover:text-primary transition-colors duration-300" />
            </motion.div>
            <h4 className="font-heading font-semibold mb-1 text-xs sm:text-sm group-hover:text-primary transition-colors duration-300">
              {item.title}
            </h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{item.description}</p>
          </Card>
        </SpotlightCard>
      </motion.div>
    </ScrollReveal>
  );
}
