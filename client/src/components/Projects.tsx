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
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4" data-testid="text-projects-title">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-foreground mx-auto"></div>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Innovative AI solutions showcasing practical applications of machine learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="border border-border overflow-hidden group hover-elevate transition-all duration-300"
              data-testid={`card-project-${index}`}
            >
              <div className="relative overflow-hidden aspect-video border-b border-border">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale transition-transform duration-300 group-hover:scale-105"
                  data-testid={`img-project-${index}`}
                />
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
                    className="flex-1"
                    onClick={() => console.log(`View ${project.title} on GitHub`)}
                    data-testid={`button-project-${index}-github`}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
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
