import { lazy, Suspense } from "react";


import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
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

  return (
    <ThemeProvider defaultTheme="dark">


      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">

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
          </div>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>

  );
}


export default App;
