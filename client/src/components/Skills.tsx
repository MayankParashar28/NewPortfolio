import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiJupyter, SiGit, SiReact, SiTypescript, SiNodedotjs, SiDocker, SiMongodb, SiPostgresql } from "react-icons/si";
import { Brain, Database, Code2, Terminal, Cpu, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextScramble from "@/components/TextScramble";

const skills = [
  { name: "Python", icon: SiPython, color: "#3776AB", category: "Languages" },
  { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00", category: "AI/ML" },
  { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C", category: "AI/ML" },
  { name: "React", icon: SiReact, color: "#61DAFB", category: "Frontend" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "Languages" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", category: "Backend" },
  { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E", category: "AI/ML" },
  { name: "Docker", icon: SiDocker, color: "#2496ED", category: "DevOps" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", category: "Database" },
  { name: "Deep Learning", icon: Brain, color: "#9333EA", category: "AI/ML" },
  { name: "Computer Vision", icon: Cpu, color: "#06B6D4", category: "AI/ML" },
  { name: "NLP", icon: Globe, color: "#22C55E", category: "AI/ML" },
];

const defaultOptions = {
  reverse: false,
  max: 35,
  perspective: 1000,
  scale: 1.1,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

export default React.memo(function Skills() {
  return (
    <section id="skills" className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextScramble
              text="Skills & Expertise"
              as="h2"
              className="text-3xl sm:text-5xl font-heading font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 inline-block"
            />
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Mastering the tools of tomorrow.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Tilt options={defaultOptions} className="h-full">
                <div className="h-full p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 group flex flex-col items-center justify-center gap-3 text-center">
                  <motion.div
                    className="p-2.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300"
                    style={{ color: skill.color }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2, // Staggered delay for natural feel
                    }}
                  >
                    <skill.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </motion.div>

                  <div>
                    <h3 className="font-heading font-semibold text-sm sm:text-base mb-0.5 text-foreground">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded-full bg-white/5">
                      {skill.category}
                    </span>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
