import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiJupyter, SiGit } from "react-icons/si";
import { Database, Brain, BarChart3 } from "lucide-react";

export default function Skills() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Python", level: 90, icon: SiPython },
        { name: "R", level: 75, icon: BarChart3 },
      ]
    },
    {
      title: "ML Frameworks",
      skills: [
        { name: "TensorFlow", level: 85, icon: SiTensorflow },
        { name: "PyTorch", level: 80, icon: SiPytorch },
        { name: "Scikit-learn", level: 85, icon: SiScikitlearn },
      ]
    },
    {
      title: "Tools & Technologies",
      skills: [
        { name: "Jupyter", level: 90, icon: SiJupyter },
        { name: "Git", level: 85, icon: SiGit },
        { name: "SQL", level: 75, icon: Database },
      ]
    },
    {
      title: "AI Specializations",
      skills: [
        { name: "Deep Learning", level: 85, icon: Brain },
        { name: "Computer Vision", level: 80, icon: Brain },
        { name: "NLP", level: 75, icon: Brain },
      ]
    }
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 border border-border hover-elevate transition-all" data-testid={`card-skill-category-${categoryIndex}`}>
              <h3 className="text-lg font-heading font-semibold mb-6">{category.title}</h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} data-testid={`skill-${categoryIndex}-${skillIndex}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <skill.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" data-testid={`progress-${categoryIndex}-${skillIndex}`} />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
