import { lazy, Suspense, useEffect } from "react";

import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthProvider";

// Public-route extras only: effects with no initial paint, plus chrome that
// appears on scroll. Keeping them out of the entry bundle speeds up every
// route, and the admin routes never render them at all.
const SmoothScroll = lazy(() => import("@/components/SmoothScroll"));
const ScrollProgress = lazy(() => import("@/components/ScrollProgress"));
const InteractiveSelection = lazy(() => import("@/components/InteractiveSelection"));
const EasterEgg = lazy(() => import("@/components/EasterEgg"));
const BackToTop = lazy(() => import("@/components/BackToTop"));

// Lazy load pages for better initial bundle size
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

const Cursor3D = lazy(() => import("@/components/Cursor3D"));

// The splash screen was removed: it was a fixed animation, not a progress
// indicator, so it delayed the content without ever waiting on it.

// Everything the public page renders. Warming these here means the requests
// are already in flight while the route chunk is still loading, and
// staleTime: Infinity means the components pick the results straight up.
const PUBLIC_DATA = [
  "/api/profile",
  "/api/projects",
  "/api/skills",
  "/api/certificates",
  "/api/internships",
];

/**
 * The custom cursor replaces the native one outright, so it is kept to
 * devices that actually have a pointer to replace. On a touch screen it is
 * invisible weight, and hiding the system cursor on a machine whose owner
 * relies on its size or contrast settings is worse than not having it.
 */
function useCustomCursor() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(pointer: fine)").matches ?? false;
}

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
  const showCustomCursor = useCustomCursor();

  useEffect(() => {
    // Fire and forget: a failure here is not fatal, because the component
    // that needs the data still runs its own query and shows its own error.
    for (const key of PUBLIC_DATA) {
      queryClient.prefetchQuery({ queryKey: [key] });
    }
  }, []);

  return (
    // reducedMotion="user" makes every framer-motion animation in the tree
    // respect the OS setting, instead of relying on each component to ask.
    <MotionConfig reducedMotion="user">
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="min-h-screen text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Skip to main content
              </a>

              {!isAdminRoute && (
                <>
                  <Suspense fallback={null}>
                    <SmoothScroll />
                    <ScrollProgress />
                    <InteractiveSelection />
                    <EasterEgg />
                  </Suspense>
                  {showCustomCursor && (
                    <Suspense fallback={null}>
                      <Cursor3D />
                    </Suspense>
                  )}
                  <Navigation />
                </>
              )}

              <Router />

              {!isAdminRoute && (
                <>
                  <Suspense fallback={null}>
                    <BackToTop />
                  </Suspense>
                  <Footer />
                </>
              )}
            </div>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
