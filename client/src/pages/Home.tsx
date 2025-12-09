import { lazy, Suspense } from "react";

const Background3D = lazy(() => import("@/components/Background3D"));
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";

import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition"; // Import

import { Helmet } from "react-helmet-async";
import { user } from "@/data";

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen relative">
        <Helmet>
          <title>{user.name} | {user.title}</title>
          <meta name="description" content={user.about.description1} />
          <meta property="og:title" content={`${user.name} | ${user.title}`} />
          <meta property="og:description" content={user.about.description1} />
          <meta property="og:image" content={user.about.image} />
          <meta property="og:type" content="website" />
        </Helmet>
        <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
          <Background3D />
        </Suspense>
        <div className="relative z-10">

          <main id="main-content" className="relative">
            <Hero />
            <About />
            <Skills />
            <Projects />

            <Certificates />
            <Contact />
          </main>
        </div>
        <BackToTop />
        <PageLoader />
      </div>
    </PageTransition >
  );
}
