import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award } from "lucide-react";
import certBadge1 from "@assets/generated_images/ai_certification_badge_design.png";
import certBadge2 from "@assets/generated_images/ml_certification_emblem.png";

export default function Certificates() {
  const certificates = [
    {
      title: "Deep Learning Specialization",
      issuer: "Coursera & DeepLearning.AI",
      date: "2024",
      description: "Comprehensive specialization covering neural networks, CNNs, RNNs, and deployment strategies.",
      image: certBadge1,
      credentialUrl: "#"
    },
    {
      title: "Machine Learning Engineering",
      issuer: "Stanford Online",
      date: "2024",
      description: "Advanced course on production ML systems, MLOps, and scalable AI infrastructure.",
      image: certBadge2,
      credentialUrl: "#"
    },
    {
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "2023",
      description: "Professional certification in building and training neural networks using TensorFlow.",
      image: certBadge1,
      credentialUrl: "#"
    },
    {
      title: "Natural Language Processing",
      issuer: "Hugging Face",
      date: "2023",
      description: "Specialized training in transformer models, BERT, GPT, and state-of-the-art NLP techniques.",
      image: certBadge2,
      credentialUrl: "#"
    }
  ];

  return (
    <section id="certificates" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-card/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4 glow-text-cyan" data-testid="text-certificates-title">
            Certifications & Achievements
          </h2>
          <div className="w-20 h-1 gradient-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Continuous learning and professional development in AI and machine learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <Card
              key={index}
              className="glassmorphism hover-elevate transition-all group"
              data-testid={`card-certificate-${index}`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all"></div>
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="relative w-16 h-16 rounded-full object-cover"
                      data-testid={`img-certificate-${index}`}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-heading mb-1" data-testid={`text-certificate-title-${index}`}>
                      {cert.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4 text-primary" />
                      <span data-testid={`text-certificate-issuer-${index}`}>{cert.issuer}</span>
                      <span>•</span>
                      <span data-testid={`text-certificate-date-${index}`}>{cert.date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-4" data-testid={`text-certificate-description-${index}`}>
                  {cert.description}
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full glassmorphism"
                  onClick={() => console.log(`View ${cert.title} credential`)}
                  data-testid={`button-certificate-${index}-view`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Credential
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
