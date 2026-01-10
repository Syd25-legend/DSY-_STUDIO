// src/components/CTABanner.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

const CTABanner = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Remove the gradient background overlay to match other sections */}

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Gamepad2 className="absolute top-10 left-10 w-16 h-16 text-primary/10 floating-icon" />
        <Gamepad2 className="absolute bottom-20 right-20 w-20 h-20 text-accent/10 floating-icon" />
        <Gamepad2 className="absolute top-40 right-40 w-12 h-12 text-primary/10 floating-icon" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Ready to Experience</span>
            <br />
            <span className="glow-text">Our Games?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Dive into immersive worlds, unravel mysteries, and embark on
            unforgettable adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/games">
              <Button
                variant="hero"
                size="hero"
                className="w-full sm:w-auto btn-3d group"
              >
                <Gamepad2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Browse Games
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="neon"
                size="hero"
                className="w-full sm:w-auto btn-3d"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default CTABanner;
