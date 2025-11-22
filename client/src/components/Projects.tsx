import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import mlDashboardImg from "@assets/generated_images/ml_project_dashboard_mockup.png";
import cvProjectImg from "@assets/generated_images/computer_vision_project_interface.png";
import dlResearchImg from "@assets/generated_images/deep_learning_research_visualization.png";

export default function Projects() {
  const projects = [
    {
      title: "Predictive Analytics Platform",
      description: "Built a machine learning platform for time-series forecasting using LSTM networks, achieving 92% accuracy in predicting market trends.",
      image: mlDashboardImg,
      tags: ["Python", "TensorFlow", "LSTM", "Data Analysis"],
      github: "#",
      demo: "#"
    },
    {
      title: "AI-Powered Image Recognition",
      description: "Developed a computer vision system using CNN for real-time object detection and classification with 95% accuracy on custom dataset.",
      image: cvProjectImg,
      tags: ["PyTorch", "CNN", "OpenCV", "Computer Vision"],
      github: "#",
      demo: "#"
    },
    {
      title: "NLP Sentiment Analyzer",
      description: "Created a natural language processing model for sentiment analysis of social media data using transformer architecture.",
      image: dlResearchImg,
      tags: ["NLP", "BERT", "Transformers", "Python"],
      github: "#",
      demo: "#"
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4 glow-text-cyan" data-testid="text-projects-title">
            Featured Projects
          </h2>
          <div className="w-20 h-1 gradient-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Innovative AI solutions showcasing practical applications of machine learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="glassmorphism overflow-hidden group hover-elevate transition-all duration-300"
              data-testid={`card-project-${index}`}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  data-testid={`img-project-${index}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-heading" data-testid={`text-project-title-${index}`}>
                  {project.title}
                </CardTitle>
                <CardDescription data-testid={`text-project-description-${index}`}>
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs" data-testid={`badge-project-${index}-tag-${tagIndex}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 glassmorphism"
                    onClick={() => console.log(`View ${project.title} on GitHub`)}
                    data-testid={`button-project-${index}-github`}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gradient-primary"
                    onClick={() => console.log(`View ${project.title} demo`)}
                    data-testid={`button-project-${index}-demo`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
