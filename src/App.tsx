// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import RouteChangeTracker from "./components/RouteChangeTracker";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// Import all page components
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
import Payment from "./pages/Payment";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import Play from "./pages/Play";
import GameLobby from "./pages/GameLobby"; // Renamed for clarity

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
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><p>Loading Payment Options...</p></div>;
  }

  const initialOptions = {
    clientId: paypalClientId,
    currency: "USD",
    intent: "capture",
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <RouteChangeTracker />
      
      <PayPalScriptProvider options={initialOptions}>
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
       
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />

          {/* PROTECTED ROUTES */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
          <Route path="/play/:gameId" element={<ProtectedRoute><GameLobby /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PayPalScriptProvider>
    </TooltipProvider>
  );
};

export default App;