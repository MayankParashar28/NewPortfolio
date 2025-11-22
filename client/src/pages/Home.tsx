import Navigation from "@/components/Navigation";
import Background3D from "@/components/Background3D";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Background3D />
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
      </div>
    </div>
  );
}
