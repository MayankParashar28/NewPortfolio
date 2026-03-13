import { lazy, Suspense, useState } from "react";


import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import InteractiveSelection from "@/components/InteractiveSelection";
import EasterEgg from "@/components/EasterEgg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { AuthProvider } from "@/context/AuthProvider";

// Lazy load pages for better initial bundle size
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Lazy load 3D components for performance
const Cursor3D = lazy(() => import("@/components/Cursor3D"));


function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <Switch location={location} key={location}>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin") || location === "/login";
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider defaultTheme="dark">


      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AnimatePresence mode="wait">
            {isLoading && !isAdminRoute ? (
              <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
            ) : (
              <motion.div
                key="app-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="min-h-screen text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground"
              >
                <a
                  href="#about"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Skip to main content
                </a>

                {!isAdminRoute && (
                  <>
                    <SmoothScroll />
                    <ScrollProgress />
                    <Suspense fallback={null}>
                      <Cursor3D />
                    </Suspense>
                    <InteractiveSelection />
                    <EasterEgg />
                    <Navigation />
                  </>
                )}

                <Router />

                {!isAdminRoute && (
                  <>
                    <BackToTop />
                    <Footer />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>

  );
}


export default App;
