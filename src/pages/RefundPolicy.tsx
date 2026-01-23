// src/pages/RefundPolicy.tsx

import GamingHeader from "@/components/GamingHeader";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Refund Policy"
        description="Refund Policy for DSY Studio's games and services."
        canonical="/refund-policy"
      />
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          className="max-w-4xl mx-auto prose prose-invert prose-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          <h1 className="gradient-text">Refund Policy</h1>
          <p className="text-muted-foreground">Last Updated: October 2, 2025</p>

          <p>This is the Refund Policy for DSY Studio.</p>

          <p>
            <strong>All sales are final.</strong>
          </p>

          <p>
            However, if you experience technical issues that prevent you from
            playing the game, please contact us.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Refund Policy, please{" "}
            <Link to="/contact">contact us</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
