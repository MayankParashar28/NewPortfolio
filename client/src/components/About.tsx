import { Card } from "@/components/ui/card";
import { Brain, Code2, Sparkles } from "lucide-react";
import { user } from "@/data";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";
import TextScramble from "@/components/TextScramble";
import ScratchRevealImage from "@/components/ScratchRevealImage";

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  const highlights = [
    {
      icon: Brain,
      title: "AI Enthusiast",
      description: "Deep passion for artificial intelligence and its real-world applications"
    },
    {
      icon: Code2,
      title: "Problem Solver",
      description: "Turning complex challenges into elegant machine learning solutions"
    },
    {
      icon: Sparkles,
      title: "Innovation Driven",
      description: "Always exploring cutting-edge technologies and research"
    }
  ];



  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <TextScramble
            text="About Me"
            as="h2"
            className="text-4xl sm:text-5xl font-heading font-bold mb-4 inline-block"
          />
          <div className="w-20 h-1 bg-foreground mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <ScrollReveal animation="fade-up">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-6" data-testid="text-about-heading">
                {user.about.title}
              </h3>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={0.1}>
              <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-paragraph-1">
                {user.about.description1}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={0.2}>
              <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-paragraph-2">
                {user.about.description2}
              </p>
            </ScrollReveal>



            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {highlights.map((item, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={0.3 + index * 0.1} className="h-full">
                  <SpotlightCard className="h-full">
                    <Card className="p-4 border border-border hover-elevate transition-all h-full bg-transparent" data-testid={`card-highlight-${index}`}>
                      <item.icon className="w-8 h-8 mb-3" />
                      <h4 className="font-heading font-semibold mb-2 text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </Card>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              ref={containerRef}
              style={{ y, opacity }}
              className="relative border border-border p-2"
            >
              <ScratchRevealImage
                src={user.about.image}
                alt={`${user.name} - AI/ML Engineer`}
                width={500}
                height={500}
                className="w-full"
              />
            </motion.div>

            {user.about.quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4 py-2 bg-muted/30 rounded-r-lg">
                  "{user.about.quote}"
                </blockquote>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
