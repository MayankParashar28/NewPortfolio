import { Card } from "@/components/ui/card";
import { Brain, Code2, Sparkles } from "lucide-react";
import neuralNetworkImg from "@assets/generated_images/ai_neural_network_visualization.png";

export default function About() {
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
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4" data-testid="text-about-title">
            About Me
          </h2>
          <div className="w-20 h-1 bg-foreground mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-6" data-testid="text-about-heading">
              Exploring the Possibilities of AI
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-paragraph-1">
              I'm a dedicated AI and Machine Learning student with a strong foundation in computer science 
              and a burning curiosity for intelligent systems. My journey in AI has been driven by the 
              desire to create technology that can learn, adapt, and solve meaningful problems.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-paragraph-2">
              From developing neural networks to implementing computer vision solutions, I'm constantly 
              pushing the boundaries of what's possible with machine learning. I believe in the power of 
              AI to transform industries and improve lives, and I'm committed to being part of that transformation.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {highlights.map((item, index) => (
                <Card key={index} className="p-4 border border-border hover-elevate transition-all" data-testid={`card-highlight-${index}`}>
                  <item.icon className="w-8 h-8 mb-3" />
                  <h4 className="font-heading font-semibold mb-2 text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative border border-border p-2">
              <img
                src={neuralNetworkImg}
                alt="AI Neural Network Visualization"
                className="w-full grayscale"
                data-testid="img-about-visualization"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
