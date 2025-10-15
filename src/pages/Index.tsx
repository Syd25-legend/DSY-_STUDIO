// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
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
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants, useInView } from "framer-motion";

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

// Static data for the featured game, using the local image
const featuredGameData = {
  id: "antim-yatra",
  image: "/antimyatraposter.webp",
  title: "Antim Yatra",
  status: "Coming Soon",
  description: "A cursed railway station binds you to your ancestor's betrayal, where you must face vengeful ghosts and decide the fate of the living and the dead.",
};

const Index = () => {
  const [showBouncyLoader, setShowBouncyLoader] = useState(true);
  const gamingHubRef = useRef(null);
  const isGamingHubInView = useInView(gamingHubRef, { once: false });
  const [showHeader, setShowHeader] = useState(true);
  const [stats, setStats] = useState({
    games: 1,
    discussions: "0",
    blogPosts: 1,
  });

  useEffect(() => {
    setShowHeader(!isGamingHubInView);
  }, [isGamingHubInView]);


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
          discussions: (discussionCount ?? 0).toLocaleString(),
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    return () => clearTimeout(bouncyTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>DSY Studio | Indie Game Development</title>
        <meta name="description" content="Welcome to DSY Studio. We craft immersive gaming experiences that push the boundaries of storytelling, horror, and interactive entertainment. Explore our games and join our community." />
        <link rel="canonical" href="https://www.studiodsy.xyz/" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DSY Studio",
            "url": "https://www.studiodsy.xyz/",
            "logo": "https://www.studiodsy.xyz/dsylogo1.png",
            "description": "DSY Studio is a passionate team of two game creators focused on building compelling narrative worlds and immersive experiences.",
            "sameAs": [
              "https://www.instagram.com/dsystudio_/",
              "https://www.artstation.com/studiodsy",
              "https://sketchfab.com/studiodsy"
            ]
          }
        `}</script>
      </Helmet>
      
      <BouncyLoader isLoading={showBouncyLoader} />
      <GamingHeader hidden={!showHeader} />

      <section className="hero-section relative py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* --- LEFT COLUMN --- */}
            <div>
              <motion.div variants={fadeInScaleVariants} initial="hidden" animate="visible">
                <Card className="gaming-card overflow-hidden group">
                  <div className="relative">
                    <img
                      src={featuredGameData.image}
                      alt={featuredGameData.title}
                      className="w-full h-64 object-cover transition-transform "
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
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
                      <Button variant="gaming" className="w-full group/btn">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="h-[450px] flex flex-col justify-center">
              <motion.div
                className="space-y-8"
                variants={fadeInScaleVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <img
                        src="/dsylogo1.png"
                        alt="DSY Studio Logo"
                        className="w-12 h-10"
                      />
                      <span className="text-sm font-medium text-primary tracking-wider uppercase">
                        Indie Game Development Studio
                      </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                      <span className="text-accent">DSY Studio</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                      Crafting immersive gaming experiences that push the
                      boundaries of storytelling, horror, and interactive
                      entertainment.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link to="/games">
                      <Button
                        variant="hero"
                        size="hero"
                        className="w-full sm:w-auto group"
                      >
                        <GamepadIcon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Explore Our Games
                      </Button>
                    </Link>
                    <Link to="/play">
                      <Button
                        variant="neon"
                        size="hero"
                        className="w-full sm:w-auto"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Play Games
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      2
                    </div>
                    <div className="text-sm text-muted-foreground">Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {stats.discussions}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Discussions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {stats.blogPosts}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Blog Posts
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GamepadIcon className="floating-icon w-12 h-12 text-primary/20 absolute top-20 left-16" />
          <Headphones className="floating-icon w-10 h-10 text-accent/20 absolute top-40 right-20" />
          <Monitor className="floating-icon w-14 h-14 text-secondary/15 absolute bottom-32 left-32" />
        </div>
      </section>

      <section className="py-24 relative" ref={gamingHubRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 pb-4">
              Your Gaming Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto ">
              Discover, play, and connect with our comprehensive gaming platform
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                description: "Behind-the-scenes insights from our team",
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
                <Card
                  className="gaming-card group flex flex-col h-full"
                >
                  <CardHeader className="text-center">
                    <feature.icon
                      className={`w-12 h-12 mx-auto mb-4 ${feature.color} transition-transform group-hover:scale-110`}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-primary/20 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/dsylogo1.png"
                  alt="DSY Studio Logo"
                  className="w-8 h-6"
                />
                <span className="text-lg font-bold gradient-text">
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
                  <a href="https://www.artstation.com/studiodsy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    ArtStation
                  </a>
                </li>
                <li>
                  <a href="https://sketchfab.com/studiodsy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Sketchfab
                  </a>
                </li>
                <li>
                  <a href="https://www.patreon.com/c/DSYStudio" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Patreon
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/dsystudio_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#C13584] transition-colors duration-300"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.youtube.com/@studiodsy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#FF0000] transition-colors duration-300"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/Syd25-legend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#33b249] transition-colors duration-300"
                >
                  <Github className="w-6 h-6" />
                </a>
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