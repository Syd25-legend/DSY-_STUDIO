// src/pages/PrivacyPolicy.tsx

import GamingHeader from "@/components/GamingHeader";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Privacy Policy - DSY Studio</title>
        <meta name="description" content="Privacy Policy for DSY Studio's games and services." />
        <meta name="robots" content="noindex" /> {/* Added to discourage search engine indexing for legal pages */}
      </Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div 
          className="max-w-4xl mx-auto prose prose-invert prose-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          <h1 className="gradient-text">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: October 2, 2025</p>

          <p>
            Welcome to DSY Studio ("we", "us", "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website (studiodsy.xyz), games, and related services (collectively, the "Services").
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, purchase our games, or interact with our community features.</p>
          <ul>
            <li><strong>Account Information:</strong> When you register for an account, we collect your email address and username. Passwords are handled by our authentication provider, Supabase, and are never visible to us.</li>
            <li><strong>Profile Information:</strong> You may choose to provide a profile picture (avatar). These images are stored in a public bucket on Supabase named "avatars".</li>
            
            {/* --- UPDATED SECTION --- */}
            <li><strong>Transaction Information:</strong> When you purchase a game, all payment processing is handled on the servers of secure third-party payment providers (e.g., PayPal). We do not collect, store, or have access to your sensitive payment details like credit card numbers. Our system only stores a record of the completed transaction (such as an order ID, the game purchased, and the amount), which is not linked to your sensitive financial data.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process transactions and grant access to purchased digital products.</li>
            <li>Allow you to participate in interactive features of our Services, such as community insights and comments.</li>
            <li>Communicate with you about products, services, and events offered by DSY Studio.</li>
          </ul>

          {/* --- UPDATED SECTION --- */}
          <h2>3. Data Storage and Security</h2>
          <p>
            Our services are built on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase</a>, which provides our database, authentication, and storage services. All data, including user accounts, order history, and profile pictures, is stored on Supabase's secure servers. We rely on Supabase's industry-standard security measures to protect your information. Furthermore, our database tables are protected by Supabase's Row Level Security (RLS) to ensure that users can only access data they are permitted to see.
          </p>

          <h2>4. Your Rights and Choices</h2>
          <p>You may review, update, or delete your account information at any time by logging into your profile page. Please note that some information, such as transaction records, may be retained in our system for legal and accounting purposes after your account is deleted.</p>
          
          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <Link to="/contact">contact us</Link>.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;