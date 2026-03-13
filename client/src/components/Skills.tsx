import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import TextScramble from "@/components/TextScramble";
import { useQuery } from "@tanstack/react-query";
import { Skill } from "@shared/schema";
import { getIcon } from "@/lib/skillIcons";
import { Loader2 } from "lucide-react";

/**
 * Individual skill card with a premium mouse-tracking spotlight effect.
 * The glow follows the cursor and the icon lifts on hover.
 */
function SkillCard({ skill, index, categoryIndex }: { skill: Skill; index: number; categoryIndex: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw mouse position on the card (0-1 range)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring-based values for the spotlight
  const spotX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const spotY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Convert to percentage strings for the radial gradient
  const gradientX = useTransform(spotX, (v) => `${v * 100}%`);
  const gradientY = useTransform(spotY, (v) => `${v * 100}%`);
  
  // Map mouse percentage to a physical pixel translation for the magnetic effect
  const translateX = useTransform(spotX, [0, 1], [-15, 15]);
  const translateY = useTransform(spotY, [0, 1], [-15, 15]);

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

  const skillColor = skill.color || "hsl(var(--primary))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: categoryIndex * 0.08 + index * 0.04, ease: "easeOut" }}
      viewport={{ once: true, margin: "-40px" }}
      className="h-full"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x: translateX, y: translateY }} className="h-full">
        <motion.div
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0.2}
          whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
          className="relative h-full rounded-xl overflow-hidden cursor-grab group bg-background"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
        {/* Animated spotlight overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, ${skillColor}22 0%, transparent 65%)`
            ),
          }}
        />

        {/* Glowing border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            boxShadow: `inset 0 0 0 1px ${skillColor}44, 0 0 20px ${skillColor}15`,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full p-3 rounded-xl bg-black/5 dark:bg-white/[0.04] backdrop-blur-md border border-white/[0.06] dark:border-white/[0.08] flex flex-col items-center justify-center gap-2.5 text-center transition-colors duration-300 group-hover:border-transparent">
          {/* Icon container */}
          <motion.div
            className="p-2.5 rounded-xl transition-all duration-400"
            style={{ color: skillColor }}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {React.createElement(getIcon(skill), { className: "w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm" })}
              {/* Glow behind icon on hover */}
              <div
                className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"
                style={{ backgroundColor: skillColor }}
              />
            </motion.div>
          </motion.div>

          {/* Skill name */}
          <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground/80 group-hover:text-foreground transition-colors duration-300">
            {skill.name}
          </h3>
        </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  if (isLoading) {
    return (
      <section id="skills" className="py-20 flex justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    );
  }

  const safeSkills = skills || [];
  const categoryOrder = ["Core ML/AI", "Software Engineering", "Cloud/DevOps"];

  const groupedSkills = safeSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof safeSkills>);

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextScramble
              text="Skills & Expertise"
              as="h2"
              className="text-3xl sm:text-4xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 inline-block"
            />
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Mastering the tools of tomorrow.
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {categoryOrder.map((category, categoryIndex) => (
            <div key={category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl font-heading font-bold mb-3 pl-3 border-l-4 border-primary text-foreground/90"
              >
                {category}
              </motion.h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {groupedSkills[category]?.map((skill, index) => (
                  <SkillCard
                    key={`${category}-${skill.name}-${index}`}
                    skill={skill}
                    index={index}
                    categoryIndex={categoryIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
