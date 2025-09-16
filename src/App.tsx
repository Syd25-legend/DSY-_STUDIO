// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import RouteChangeTracker from "./components/RouteChangeTracker"; // <-- 1. IMPORT RouteChangeTracker

// Import all your page components
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs"; // <-- ADDED IMPORT
import ContactUs from "./pages/ContactUs"; // <-- ADDED IMPORT

// 2. REMOVED the duplicate ReactGA import and initialization from here. It is correctly placed in main.tsx.

// This ProtectedRoute component is correct and does not need changes.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <ScrollToTop />
    <RouteChangeTracker /> {/* <-- 3. ADDED the tracker here. It will now track all page changes. */}
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/games" element={<Games />} />
      <Route path="/games/:id" element={<GameDetail />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/:id" element={<InsightDetail />} />
      
      {/* --- ADDED NEW ROUTES --- */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      {/* ------------------------- */}

      <Route 
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;