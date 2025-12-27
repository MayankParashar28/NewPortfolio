import { Card } from "@/components/ui/card";
import { Brain, Code2, Cpu, Sparkles, Target, Workflow, Zap } from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

  return (
    <section id="about" className="pt-10 pb-20 md:pt-16 md:pb-32 px-4 sm:px-6 lg:px-8 border-t border-border min-h-[calc(100vh-4rem)] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
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


            <ScrollReveal animation="fade-up" delay={0.1}>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed" data-testid="text-about-paragraph-1">
                {bio}
              </p>
            </ScrollReveal>


            <ScrollReveal animation="fade-up" delay={0.25}>
              <div className="flex items-center gap-2 mb-8 text-xs sm:text-sm font-medium text-foreground bg-primary/10 p-1.5 rounded-md border border-primary/20 inline-block">
                <Cpu className="w-3 h-3 text-primary" />
                <span>{techFocus}</span>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {highlights.map((item, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={0.3 + index * 0.1} className="h-full">
                  <SpotlightCard className="h-full">
                    <Card className="p-3 border border-border hover-elevate transition-all h-full bg-transparent" data-testid={`card-highlight-${index}`}>
                      <item.icon className="w-6 h-6 mb-2" />
                      <h4 className="font-heading font-semibold mb-1 text-xs sm:text-sm">{item.title}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{item.description}</p>
                    </Card>
                  </SpotlightCard>
                </ScrollReveal>
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
