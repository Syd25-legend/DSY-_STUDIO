// src/pages/RefundPolicy.tsx

import GamingHeader from "@/components/GamingHeader";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Refund Policy - DSY Studio</title>
        <meta name="description" content="Refund Policy for digital products sold by DSY Studio." />
      </Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          <XCircle className="w-24 h-24 mx-auto text-destructive mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Refund Policy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thank you for your interest in games from DSY Studio.
          </p>
          <div className="mt-8 prose prose-invert prose-lg mx-auto">
            <p>
              Due to the nature of digital products, all purchases made on studiodsy.xyz are final and non-refundable. Once a game has been purchased and the digital content has been made available, we are unable to offer a refund under any circumstances.
            </p>
            <p>
              We encourage you to review all available information, system requirements, and gameplay videos before making a purchase to ensure the game is right for you. Please see our <Link to="/terms-and-conditions" className="text-primary hover:underline">Terms and Conditions</Link> for more details.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;