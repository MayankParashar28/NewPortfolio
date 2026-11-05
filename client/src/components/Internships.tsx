import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Internship } from "@shared/schema";
import ScrollReveal from "@/components/ScrollReveal";
import TextScramble from "@/components/TextScramble";
import SpotlightCard from "@/components/SpotlightCard";
import { Building2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Internships() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { data: internshipsList, isLoading } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
  });

  if (isLoading) {
    return (
      <section id="experience" className="py-20 border-t border-border relative overflow-hidden">
        <div className="w-[90%] lg:w-[95%] max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-muted rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-1 w-20 bg-muted rounded animate-pulse mx-auto" />
          </div>
          <div className="space-y-12">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse max-w-3xl mx-auto" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const safeInternships = internshipsList || [];

  if (safeInternships.length === 0) {
    return null; // Don't render section if empty
  }

  const activeInternship = safeInternships[activeIndex] || safeInternships[0];

  return (
    <section id="experience" className="py-24 border-t border-border relative overflow-hidden bg-background">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.03),transparent_70%)] pointer-events-none" />

      <div className="w-[90%] lg:w-[95%] max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <ScrollReveal animation="fade-up">
            <TextScramble
              text="Professional Experience"
              as="h2"
              className="text-4xl sm:text-5xl font-heading font-bold mb-4 text-foreground inline-block"
            />
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-base sm:text-lg">
              Showcasing practical training and corporate job simulation work in engineering
            </p>
          </ScrollReveal>
        </div>

        {/* Tabbed deck layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch min-h-[400px]">
          {/* Tabs Column: Left side on desktop, top side on mobile */}
          <div className="md:col-span-4 flex flex-wrap md:flex-col gap-2 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-border/40 md:pr-4 shrink-0">
            {safeInternships.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-300 flex-1 min-w-[140px] md:w-full md:min-w-0 md:flex-initial select-none cursor-pointer ${
                    isActive 
                      ? "text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02] dark:hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Active tab background slider */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCompanyBg"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-xl border border-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Active tab indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCompanyBar"
                      className="absolute hidden md:block md:left-0 md:right-auto md:top-1/4 md:bottom-1/4 md:w-[3px] md:h-auto bg-primary rounded-r"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Company Logo / Fallback */}
                  <div className={`w-9 h-9 rounded-lg p-1.5 flex items-center justify-center border shrink-0 transition-colors duration-300 z-10 ${
                    isActive 
                      ? "bg-background border-primary/30" 
                      : "bg-white/[0.03] dark:bg-black/20 border-border/40"
                  }`}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.company} 
                        className="w-full h-full object-contain rounded-md"
                      />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )}
                  </div>

                  <div className="z-10 flex-grow leading-tight min-w-0">
                    <span className="block text-sm font-semibold truncate">{item.company}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5 truncate">{item.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Pane Column */}
          <div className="md:col-span-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-auto md:h-full"
              >
                <SpotlightCard className="h-auto md:h-full rounded-2xl">
                  <div className="relative p-6 md:p-8 rounded-2xl border border-black/[0.05] dark:border-white/[0.06] bg-black/5 dark:bg-white/[0.02] backdrop-blur-xl h-auto md:h-full flex flex-col justify-between group overflow-hidden">
                    {/* Ambient glow decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

                    <div>
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6 mb-6">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
                            Work Experience
                          </span>
                          <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight leading-tight">
                            {activeInternship.role}
                          </h3>
                        </div>

                        {/* Company Badge */}
                        <div className="flex items-center gap-2.5 bg-muted/30 border border-border/20 px-3.5 py-2 rounded-xl w-fit">
                          <div className="w-6 h-6 rounded bg-background p-0.5 flex items-center justify-center border border-border/30">
                            {activeInternship.image ? (
                              <img 
                                src={activeInternship.image} 
                                alt={activeInternship.company} 
                                className="w-full h-full object-contain rounded"
                              />
                            ) : (
                              <Building2 className="w-3.5 h-3.5 text-muted-foreground/60" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{activeInternship.company}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-2.5 py-1 rounded-full border border-border/10 w-fit">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{activeInternship.duration}</span>
                        </div>

                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line pt-2 group-hover:text-muted-foreground/95 transition-colors">
                          {activeInternship.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
