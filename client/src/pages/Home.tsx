import { lazy, Suspense, useEffect, useState } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";

const Background3D = lazy(() => import("@/components/Background3D"));

// three.js and drei come to 237 KB gzipped -- more than half of everything
// this page downloads -- for a decorative particle field. The component
// already thins itself out on small screens and for reduced motion, but that
// happens after the chunk has arrived, which is the expensive part. So the
// import itself is skipped where it costs the most and shows the least, and
// otherwise deferred until the browser is idle so it never competes with the
// content or the data fetches.
/**
 * Whether this browser can actually run the 3D canvas.
 *
 * Without this check the chunk loads, three.js fails to get a context and
 * throws during render, and React tears the whole page down -- the visitor
 * gets a blank screen instead of the portfolio. That happens on any browser
 * with hardware acceleration off, a WebGL-blocking privacy extension, an old
 * GPU, or a VM. Checking first also avoids downloading 237 KB that cannot run.
 */
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Release it immediately; this was only a capability probe.
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function useBackdrop() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const w = window as any;
    if (w.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (w.innerWidth < 768) return;
    if (!hasWebGL()) return;

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setEnabled(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = w.setTimeout(() => setEnabled(true), 600);
    return () => w.clearTimeout(id);
  }, []);

  return enabled;
}
import Hero from "@/components/Hero";
import About from "@/components/About";
import Internships from "@/components/Internships";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";

import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import PageTransition from "@/components/PageTransition";

import { Helmet } from "react-helmet-async";
import { user } from "@/data";

export default function Home() {
  const showBackdrop = useBackdrop();

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
        {showBackdrop && (
          // The capability probe above catches the common case, but a context
          // can still be refused after it succeeds (a GPU reset, a tab that
          // has exhausted the browser's context budget). The backdrop is
          // decorative, so losing it must never cost the page.
          <ErrorBoundary label="Background3D">
            <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
              <Background3D />
            </Suspense>
          </ErrorBoundary>
        )}
        <div className="relative z-10">

          <main id="main-content" className="relative">
            <Hero />
            {/* About sits here so a visitor has the context before the work,
                then Projects and Skills carry the evidence. */}
            <About />
            <Projects />
            <Skills />
            <Internships />
            <Certificates />
            <Contact />
          </main>
        </div>
      </div>
    </PageTransition >
  );
}
