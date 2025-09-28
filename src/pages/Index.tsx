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
import { Helmet } from "react-helmet-async";
import {
  Play,
  Users,
  MessageCircle,
  BookOpen,
  Star,
  ArrowRight,
  GamepadIcon,
  Zap,
  Headphones,
  Monitor,
  Instagram,
  Youtube,
  Github,
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { Game } from "./GameDetail";

const Index = () => {
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [isGameLoading, setIsGameLoading] = useState(true);

  const [stats, setStats] = useState({
    games: 1,
    discussions: "0",
    blogPosts: 1,
  });

  useEffect(() => {
    const fetchFeaturedGame = async () => {
      setIsGameLoading(true);
      try {
        const { data, error } = await supabase
          .from("games")
          .select("*")
          .eq("featured", true)
          .limit(1)
          .single();
        if (error) throw error;
        setFeaturedGame(data as Game);
      } catch (error) {
        console.error("Error fetching featured game:", error);
      } finally {
        setIsGameLoading(false);
      }
    };

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

    fetchFeaturedGame();
    fetchStats();
  }, []);

  const studioInfo = {
    description:
      "As two lifelong friends and creators, DSY Studio is motivated by a love for games and narrative. Our focus is on indie game development, specializing in immersive horror games and rich interactive storytelling. We are creating worlds worth exploring, and our journey with our debut title, Antim Yatra, is only getting started.",
    team: [
      {
        id: 1,
        name: "Souhardyo Dey",
        role: "Game Developer",
        description:
          "Materializes concepts into reality by creating and iterating on each aspect of the game.",
      },
      {
        id: 2,
        name: "Baibhab Paul",
        role: "Game Designer",
        description:
          "Shapes the vision, the stories, and the mechanics into immersive experiences.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>DSY Studio - Indie Game Development Studio</title>
        <meta
          name="description"
          content="Welcome to DSY Studio. We craft immersive gaming experiences that push the boundaries of storytelling, horror, and interactive entertainment. Explore our games and join our community."
        />
      </Helmet>
      <style>{`
        @keyframes blur-zoom-in {
          0% {
            transform: scale(0.9);
            filter: blur(8px);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            filter: blur(0px);
            opacity: 1;
          }
        }
        .animate-blur-zoom-in {
          animation: blur-zoom-in 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <GamingHeader />

      <section className="hero-section relative py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* --- LEFT COLUMN --- */}
            <div>
              {isGameLoading ? (
                <Card className="gaming-card overflow-hidden group h-[450px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Loading Featured Game...
                  </p>
                </Card>
              ) : featuredGame ? (
                <Card className="gaming-card overflow-hidden group animate-blur-zoom-in">
                  <div className="relative">
                    <img
                      src={featuredGame.image}
                      alt={featuredGame.title}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
                        {featuredGame.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {featuredGame.rating}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl gradient-text">
                      {featuredGame.title}
                    </CardTitle>
                    <CardDescription className="text-base h-20 overflow-hidden">
                      {featuredGame.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/games/${featuredGame.id}`}>
                      <Button variant="gaming" className="w-full group/btn">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card className="gaming-card overflow-hidden group h-[450px] flex items-center justify-center animate-blur-zoom-in">
                  <p className="text-muted-foreground">
                    No featured game available right now.
                  </p>
                </Card>
              )}
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="h-[450px] flex flex-col justify-center">
              {isGameLoading ? (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Loading Studio Info...
                  </p>
                </div>
              ) : (
                // --- MODIFICATION START: Removed style={{ animationDelay: '0.3s' }} ---
                <div className="space-y-8 animate-blur-zoom-in">
                  {/* // --- MODIFICATION END --- */}
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
                          <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                          Explore Our Games
                        </Button>
                      </Link>
                      <Link to="/insights">
                        <Button
                          variant="neon"
                          size="hero"
                          className="w-full sm:w-auto"
                        >
                          <Users className="mr-2 h-5 w-5" />
                          Join Community
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
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GamepadIcon className="floating-icon w-12 h-12 text-primary/20 absolute top-20 left-16" />
          <Headphones className="floating-icon w-10 h-10 text-accent/20 absolute top-40 right-20" />
          <Monitor className="floating-icon w-14 h-14 text-secondary/15 absolute bottom-32 left-32" />
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 pb-4">
              Your Gaming Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto ">
              Discover, play, and connect with our comprehensive gaming platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="gaming-card group flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
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
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-24 relative"> */}
      {/* <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text pb-2">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-muted-foreground">Join our community to unlock exclusive content, participate in discussions, and be the first to know about new releases.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Link to="/auth"><Button variant="hero" size="hero" className="w-full sm:w-auto group"><Users className="mr-2 h-5 w-5" />Join Community</Button></Link>
              <Link to="/games"><Button variant="neon" size="hero" className="w-full sm:w-auto"><Play className="mr-2 h-5 w-5" />Start Playing</Button></Link> */}
      {/* </div>
          </div>
        </div> */}
      {/* </section> */}

      {/* <section className="py-24 relative border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">About Us</h2><p className="text-xl text-muted-foreground max-w-3xl mx-auto">{studioInfo.description}</p></div>
          <div className="flex flex-col md:flex-row justify-center gap-12 lg:gap-24">
            {studioInfo.team.map((member, index) => (
              <div key={member.id} className="text-center flex flex-col items-center max-w-sm">
               
                <h3 className={`text-2xl font-bold ${index === 0 ? 'text-accent' : 'text-accent'}`}>{member.name}</h3>
                <p className="text-lg text-secondary mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

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
              <h4 className="font-semibold mb-4">Games</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/games"
                    className="hover:text-primary transition-colors"
                  >
                    All Games
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/insights"
                    className="hover:text-primary transition-colors"
                  >
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="hover:text-primary transition-colors"
                  >
                    Developer Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    className="hover:text-primary transition-colors"
                  >
                    Join Us
                  </Link>
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
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#FF0000] transition-colors duration-300"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a
                  href="https://www.github.com"
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
