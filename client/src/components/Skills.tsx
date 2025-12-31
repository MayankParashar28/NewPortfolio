import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextScramble from "@/components/TextScramble";
import { useQuery } from "@tanstack/react-query";
import { Skill } from "@shared/schema";
import { getIcon } from "@/lib/skillIcons";
import { Loader2 } from "lucide-react";

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

  // Define the order of categories
  const categoryOrder = ["Core ML/AI", "Software Engineering", "Cloud/DevOps"];

  // Group skills by category
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
                  <motion.div
                    key={`${category}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.1 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Tilt options={defaultOptions} className="h-full">
                      <div className="h-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 group flex flex-col items-center justify-center gap-2 text-center">
                        <div
                          className="p-2 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-300"
                          style={{ color: skill.color || "currentColor" }}
                        // Animate logic here...
                        >
                          {React.createElement(getIcon(skill), { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                        </div>

                        <div>
                          <h3 className="font-heading font-semibold text-xs sm:text-sm mb-0.5 text-foreground">
                            {skill.name}
                          </h3>
                        </div>
                      </div>
                    </Tilt>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
