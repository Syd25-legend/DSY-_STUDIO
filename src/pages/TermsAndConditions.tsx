// src/pages/TermsAndConditions.tsx

import GamingHeader from "@/components/GamingHeader";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Terms & Conditions - DSY Studio</title>
        <meta name="description" content="Terms and Conditions for DSY Studio's games and services." />
      </Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div 
          className="max-w-4xl mx-auto prose prose-invert prose-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          <h1 className="gradient-text">Terms and Conditions</h1>
          <p className="text-muted-foreground">Last Updated: September 29, 2025</p>

          <p>
            Please read these Terms and Conditions ("Terms") carefully before using the studiodsy.xyz website and the games provided by DSY Studio ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
          </p>

          <h2>1. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of DSY Studio. Our games, including but not limited to "Antim Yatra", are protected by copyright and other laws. Our trademarks may not be used in connection with any product or service without the prior written consent of DSY Studio.
          </p>

          <h2>3. Purchases</h2>
           {/* --- UPDATED --- */}
          <p>
            If you wish to purchase any product made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase. Payment processing for all purchases is handled by secure, third-party payment providers, and we do not store your sensitive financial information. All sales are final as per our <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>.
          </p>
          
          <h2>4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>

          <h2>6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;