import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award, BadgeCheck, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import TextScramble from "@/components/TextScramble";
import { useQuery } from "@tanstack/react-query";
import { Certificate } from "@shared/schema";

/**
 * Individual certificate card with mouse-tracking spotlight hover.
 */
function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

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
    <ScrollReveal
      animation="fade-up"
      delay={index * 0.1}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full rounded-xl overflow-hidden cursor-default group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Mouse-tracking spotlight */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) =>
                `radial-gradient(ellipse 300px 200px at ${x} ${y}, hsl(var(--primary) / 0.08) 0%, transparent 70%)`
            ),
          }}
        />

        {/* Glowing border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            boxShadow: "inset 0 0 0 1px hsl(var(--primary) / 0.15), 0 0 30px hsl(var(--primary) / 0.05)",
          }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full p-6 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] flex flex-col transition-colors duration-300 group-hover:border-transparent">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="flex-shrink-0 p-2 bg-background/50 rounded-lg border border-black/10 dark:border-white/10"
              whileHover={{ rotate: [0, -3, 3, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="w-16 h-16 object-cover transition-all duration-300 group-hover:scale-105"
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-heading font-semibold truncate pr-2 group-hover:text-primary transition-colors duration-300">
                  {cert.title}
                </h3>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                </motion.div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award className="w-3 h-3" />
                <span>{cert.issuer}</span>
                <span>•</span>
                <span>{cert.date}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
            {cert.description}
          </p>

          {cert.credentialUrl && cert.credentialUrl !== "#" && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-auto"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent border-black/10 dark:border-white/10 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Credential
              </Button>
            </a>
          )}
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export default function Certificates() {
  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
  });

  if (isLoading) {
    return (
      <section id="certificates" className="py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    );
  }

  const safeCertificates = certificates || [];

  return (
    <section id="certificates" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal animation="fade-up">
            <TextScramble
              text="Certifications & Achievements"
              as="h2"
              className="text-4xl sm:text-5xl font-heading font-bold mb-4 inline-block"
            />
            <div className="w-20 h-1 bg-foreground mx-auto"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              Continuous learning and professional development in AI and machine learning
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {safeCertificates.map((cert, index) => (
            <CertificateCard key={cert.title + index} cert={cert} index={index} />
          ))}
          {safeCertificates.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No certificates found. Add them via Admin Dashboard.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
