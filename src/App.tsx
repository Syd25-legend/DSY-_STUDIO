// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// REMOVED: QueryClient and QueryClientProvider as they are in main.tsx
import { Routes, Route, Navigate } from "react-router-dom"; // REMOVED: BrowserRouter from imports
import { useAuth } from "@/hooks/useAuth"; // REMOVED: AuthProvider as it's in main.tsx
import ScrollToTop from "./components/ScrollToTop";
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
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-WKPZK8BM4P"; 
ReactGA.initialize(GA_MEASUREMENT_ID);

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
  // REMOVED: QueryClientProvider and AuthProvider from here.
  <TooltipProvider>
    <Toaster />
    <Sonner />
    {/* REMOVED: The extra <BrowserRouter> that was wrapping the routes */}
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/games" element={<Games />} />
      <Route path="/games/:id" element={<GameDetail />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/:id" element={<InsightDetail />} />

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