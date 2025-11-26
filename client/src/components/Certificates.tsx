import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award, BadgeCheck } from "lucide-react";
import { user } from "@/data";
import { Tilt } from "react-tilt";
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

export default function Certificates() {
  const certificates = user.certificates;

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
          {certificates.map((cert, index) => (
            <ScrollReveal
              key={index}
              animation="fade-up"
              delay={index * 0.1}
              className="h-full"
            >
              <Tilt options={defaultOptions} className="h-full">
                <SpotlightCard
                  className="h-full border border-white/10 bg-white/5 backdrop-blur-md rounded-xl hover:border-primary/30 transition-all duration-300 group"
                  spotlightColor="rgba(255, 255, 255, 0.15)"
                >
                  <div className="p-6 flex flex-col h-full relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 p-2 bg-background/50 rounded-lg border border-white/10">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-heading font-semibold truncate pr-2">
                            {cert.title}
                          </h3>
                          <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0 animate-pulse" />
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

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-auto bg-transparent border-white/10 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
                      onClick={() => window.open(cert.credentialUrl || "#", "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Credential
                    </Button>
                  </div>
                </SpotlightCard>
              </Tilt>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
