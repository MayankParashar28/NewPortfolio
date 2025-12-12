import { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import InteractiveSelection from "@/components/InteractiveSelection";
import EasterEgg from "@/components/EasterEgg";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";

import SmoothScroll from "@/components/SmoothScroll";

// Lazy load 3D components for performance
const Cursor3D = lazy(() => import("@/components/Cursor3D"));
const ParticleBackground = lazy(() => import("@/components/ParticleBackground"));

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
          <SmoothScroll />
          <ScrollProgress />
          <Suspense fallback={null}>
            <ParticleBackground />
            <Cursor3D />
          </Suspense>
          <InteractiveSelection />
          <EasterEgg />
          <Navigation />
          <Router />
          <BackToTop />
          <Footer />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
