// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import {
  Play,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Gamepad2 as GamepadIcon,
  Zap,
  Headphones,
  Monitor,
  Instagram,
  Youtube,
  Github,
  ChevronDown,
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import BouncyLoader from "@/components/BouncyLoader";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedCounter from "@/components/AnimatedCounter";
import Card3D from "@/components/Card3D";
import WhatWeDo from "@/components/WhatWeDo";
import TechStack from "@/components/TechStack";
import CTABanner from "@/components/CTABanner";
import ScrollProgress from "@/components/ScrollProgress";
import { motion, Variants } from "framer-motion";

const fadeInScaleVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Static data for the featured game,  using the local image
const featuredGameData = {
  id: "antim-yatra",
  image: "/antimyatraposter.webp",
  title: "Antim Yatra",
  status: "Coming Soon",
  description:
    "A cursed railway station binds you to your ancestor's betrayal, where you must face vengeful ghosts and decide the fate of the living and the dead.",
};

const Index = () => {
  const [showBouncyLoader, setShowBouncyLoader] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [stats, setStats] = useState({
    games: 2,
    discussions: 0,
    blogPosts: 1,
  });

  // Handle Header Visibility on Scroll
  useEffect(() => {
    const handleScroll = () => {
      // If the user is within 50px of the top (90% near original position), show header.
      // Otherwise, hide it.
      if (window.scrollY < 50) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check initial position in case of refresh-on-scroll
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const bouncyTimer = setTimeout(() => {
      setShowBouncyLoader(false);
    }, 1200);

    const fetchStats = async () => {
      try {
        const { count: discussionCount, error } = await supabase
          .from("insights")
          .select("*", { count: "exact", head: true });

        if (error) throw error;

        setStats((currentStats) => ({
          ...currentStats,
          discussions: discussionCount ?? 0,
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    return () => clearTimeout(bouncyTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <SEO
        title="Home"
        description="Welcome to DSY Studio. We craft immersive gaming experiences that push the boundaries of storytelling, horror, and interactive entertainment. Explore our games and join our community."
      />

      <BouncyLoader isLoading={showBouncyLoader} />
      <ScrollProgress />
      <GamingHeader hidden={!showHeader} />

      {/* HERO SECTION - Enhanced with 3D and Particles */}
      <section className="hero-section relative py-32 overflow-hidden min-h-screen flex items-center">
        <ParticleBackground />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* --- LEFT COLUMN - Featured Game with 3D Card --- */}
            <motion.div
              variants={fadeInScaleVariants}
              initial="hidden"
              animate="visible"
            >
              <Card3D intensity={0.15}>
                <Card className="gaming-card overflow-hidden group border-2">
                  <div className="relative">
                    <img
                      src={featuredGameData.image}
                      alt={featuredGameData.title}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground neon-text-accent">
                        {featuredGameData.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl gradient-text">
                      {featuredGameData.title}
                    </CardTitle>
                    <CardDescription className="text-base h-20 overflow-hidden">
                      {featuredGameData.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/games/${featuredGameData.id}`}>
                      <Button
                        variant="gaming"
                        className="w-full group/btn btn-3d"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Card3D>
            </motion.div>

            {/* --- RIGHT COLUMN - Studio Info --- */}
            <div className="h-[450px] flex flex-col justify-center">
              <motion.div
                className="space-y-8"
                variants={fadeInScaleVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-center lg:text-left">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                      <img
                        src="/group3.png"
                        alt="DSY Studio Logo"
                        className="w-12 h-10"
                      />
                      <span className="text-sm font-medium text-primary tracking-wider uppercase">
                        Indie Game Development Studio
                      </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold gradient-text">
                      <span className="text- font-michroma">DSY Studio</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                      Crafting immersive gaming experiences that push the
                      boundaries of storytelling, horror, and interactive
                      entertainment.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8 ">
                    <Link to="/games">
                      <Button
                        variant="outline"
                        size="hero"
                        className="w-full sm:w-auto  btn-3d bg-color-accent text-accent border-accent hover:text-accent-foreground ease-in-out"
                      >
                        <GamepadIcon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Explore Our Games
                      </Button>
                    </Link>
                    <Link to="/play">
                      <Button
                        variant="neon"
                        size="hero"
                        className="w-full sm:w-auto btn-3d "
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Play Games
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Stats with Animated Counters */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="text-center">
                    <AnimatedCounter
                      end={stats.games}
                      className="text-3xl font-bold gradient-text"
                    />
                    <div className="text-sm text-muted-foreground">Games</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      end={stats.discussions}
                      className="text-3xl font-bold gradient-text"
                    />
                    <div className="text-sm text-muted-foreground">
                      Discussions
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      end={stats.blogPosts}
                      className="text-3xl font-bold gradient-text"
                    />
                    <div className="text-sm text-muted-foreground">
                      Blog Posts
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GamepadIcon className="floating-icon w-12 h-12 text-primary/20 absolute top-20 left-16" />
          <Headphones className="floating-icon w-10 h-10 text-accent/20 absolute top-40 right-20" />
          <Monitor className="floating-icon w-14 h-14 text-secondary/15 absolute bottom-32 left-32" />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-primary opacity-50" />
        </motion.div>
      </section>

      {/* WHAT WE DO SECTION */}
      <WhatWeDo />

      {/* GAMING HUB SECTION - Enhanced with 3D Cards */}
      <section className="py-24 relative bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4 pb-2">
              Your Gaming Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto ">
              Discover, play, and connect with our comprehensive gaming platform
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                icon: GamepadIcon,
                title: "Premium Games",
                description:
                  "Explore our collection of carefully crafted games",
                link: "/games",
                color: "text-accent",
              },
              {
                icon: BookOpen,
                title: "Developer Blogs",
                description:
                  "Behind-the-scenes insights and updates from our team",
                link: "/blogs",
                color: "text-accent",
              },
              {
                icon: MessageCircle,
                title: "Community",
                description: "Join discussions and connect with fellow gamers",
                link: "/insights",
                color: "text-accent",
              },
              {
                icon: Zap,
                title: "Latest Updates",
                description: "Stay informed about new releases and studio news",
                link: "/blogs",
                color: "text-accent",
              },
            ].map((feature) => (
              <motion.div key={feature.title} variants={fadeInScaleVariants}>
                <Card3D intensity={0.4}>
                  <Card className="gaming-card group flex flex-col h-full gap-2">
                    <CardHeader className="text-center">
                      <feature.icon
                        className={`w-12 h-12 mx-auto mb-4 ${feature.color} transition-transform group-hover:scale-110 group-hover:rotate-12`}
                      />
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Link to={feature.link}>
                        <Button variant="gaming" className="w-full group/btn">
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <TechStack />

      {/* CALL TO ACTION BANNER */}
      <CTABanner />

      {/* FOOTER - Enhanced */}
      <footer className="border-t border-primary/20 py-12 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/group3.png"
                  alt="DSY Studio Logo"
                  className="w-8 h-6"
                />
                <span className="text-lg font-bold text-primary">
                  DSY Studio
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating immersive gaming experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Policy</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="hover:text-primary transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://www.artstation.com/studiodsy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    ArtStation
                  </a>
                </li>
                <li>
                  <a
                    href="https://sketchfab.com/studiodsy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Sketchfab
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.patreon.com/c/DSYStudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Patreon
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="https://www.instagram.com/dsystudio_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#C13584] transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Instagram className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@studiodsy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#FF0000] transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Youtube className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://github.com/Syd25-legend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#33b249] transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Github className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-primary/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} DSY Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
