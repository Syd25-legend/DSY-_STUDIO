// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import RouteChangeTracker from "./components/RouteChangeTracker";
import { Helmet } from 'react-helmet-async';

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
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Payment from "./pages/Payment"; // --- 1. IMPORT THE NEW PAYMENT PAGE ---


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

const App = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DSY Studio",
    "url": "https://www.studiodsy.xyz/"
  };

  return (
    <TooltipProvider>
      <Helmet>
        <title>DSY Studio- Indie Game Development Studio</title>
        <meta name="description" content="DSY Studio is a passionate team of two game creators focused on building compelling narrative worlds. Discover our projects." />
        <link rel="canonical" href="https://www.studiodsy.xyz/" />
        <meta property="og:site_name" content="DSY Studio" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:id" element={<InsightDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
       
        {/* --- PROTECTED ROUTES --- */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* --- 2. ADD THE NEW PAYMENT ROUTE --- */}
        <Route path="/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;