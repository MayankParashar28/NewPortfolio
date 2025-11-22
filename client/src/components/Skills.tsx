import { Card } from "@/components/ui/card";
import { SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiJupyter, SiGit } from "react-icons/si";
import { Database, Brain, BarChart3 } from "lucide-react";

export default function Skills() {
  const skills = [
    { name: "Python", level: 90, icon: SiPython, color: "text-blue-500" },
    { name: "TensorFlow", level: 85, icon: SiTensorflow, color: "text-orange-500" },
    { name: "PyTorch", level: 80, icon: SiPytorch, color: "text-red-500" },
    { name: "Scikit-learn", level: 85, icon: SiScikitlearn, color: "text-orange-400" },
    { name: "Deep Learning", level: 85, icon: Brain, color: "text-purple-500" },
    { name: "Computer Vision", level: 80, icon: Brain, color: "text-cyan-500" },
    { name: "NLP", level: 75, icon: Brain, color: "text-green-500" },
    { name: "Jupyter", level: 90, icon: SiJupyter, color: "text-orange-600" },
    { name: "Git", level: 85, icon: SiGit, color: "text-red-600" },
    { name: "SQL", level: 75, icon: Database, color: "text-blue-400" },
    { name: "R", level: 75, icon: BarChart3, color: "text-blue-500" },
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4" data-testid="text-skills-title">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-foreground mx-auto"></div>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            A comprehensive toolkit for building intelligent systems and solving complex problems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="p-4 border border-border hover-elevate transition-all group relative overflow-hidden"
              data-testid={`card-skill-${index}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-foreground/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                  <div className="relative bg-background rounded-lg p-3 border border-border">
                    <skill.icon className={`w-6 h-6 ${skill.color}`} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-sm leading-tight" data-testid={`text-skill-name-${index}`}>
                    {skill.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all duration-300 group-hover:bg-foreground rounded-full"
                        style={{ width: `${skill.level}%` }}
                        data-testid={`progress-${index}`}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground min-w-max">{skill.level}%</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
