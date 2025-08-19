import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Users, 
  MessageCircle, 
  BookOpen, 
  Star, 
  Calendar,
  Crown,
  ArrowRight,
  GamepadIcon,
  Zap,
  Headphones,
  Monitor,
  Keyboard,
  Mouse,
  Disc3
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";

const Index = () => {
  // CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data from Supabase
  const featuredGame = {
    id: 1,
    title: "Antim Sawari",
    description: "Experience the psychological horror that will haunt your dreams. Our latest masterpiece combines atmospheric storytelling with spine-chilling gameplay.",
    image: "/api/placeholder/600/400",
    rating: 4.8,
    status: "Released"
  };

  const stats = {
    games: 12,
    players: "50K+",
    discussions: 1200,
    blogPosts: 48
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      
      {/* Hero Section */}
      <section className="hero-section relative py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Crown className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-primary tracking-wider uppercase">
                    Independent Game Studio
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="gradient-text">DSY Studio</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Crafting immersive gaming experiences that push the boundaries of 
                  storytelling, horror, and interactive entertainment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/games">
                  <Button variant="hero" size="hero" className="w-full sm:w-auto group">
                    <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Explore Our Games
                  </Button>
                </Link>
                <Link to="/insights">
                  <Button variant="neon" size="hero" className="w-full sm:w-auto">
                    <Users className="mr-2 h-5 w-5" />
                    Join Community
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stats.games}</div>
                  <div className="text-sm text-muted-foreground">Games</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stats.players}</div>
                  <div className="text-sm text-muted-foreground">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stats.discussions}</div>
                  <div className="text-sm text-muted-foreground">Discussions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stats.blogPosts}</div>
                  <div className="text-sm text-muted-foreground">Blog Posts</div>
                </div>
              </div>
            </div>

            {/* Featured Game Card */}
            <div className="animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
              <Card className="gaming-card overflow-hidden group">
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
                    <span className="text-sm font-medium">{featuredGame.rating}</span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">
                    {featuredGame.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {featuredGame.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link to={`/games/${featuredGame.id}`}>
                    <Button variant="gaming" className="w-full group/btn">
                      Play Now
                      <Play className="ml-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Gaming Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GamepadIcon className="floating-icon w-12 h-12 text-primary/20 absolute top-20 left-16" />
          <Headphones className="floating-icon w-10 h-10 text-accent/20 absolute top-40 right-20" />
          <Monitor className="floating-icon w-14 h-14 text-secondary/15 absolute bottom-32 left-32" />
          <Keyboard className="floating-icon w-11 h-11 text-primary/15 absolute top-64 left-1/4" />
          <Mouse className="floating-icon w-8 h-8 text-accent/25 absolute bottom-48 right-16" />
          <Disc3 className="floating-icon w-9 h-9 text-secondary/20 absolute top-32 right-1/3" />
          <GamepadIcon className="floating-icon w-8 h-8 text-primary/10 absolute bottom-20 left-1/2" />
          <Headphones className="floating-icon w-13 h-13 text-accent/15 absolute top-56 right-1/4" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Your Gaming Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover, play, and connect with our comprehensive gaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GamepadIcon,
                title: "Premium Games",
                description: "Explore our collection of carefully crafted games across multiple genres",
                link: "/games",
                color: "text-primary"
              },
              {
                icon: BookOpen,
                title: "Developer Blogs",
                description: "Behind-the-scenes insights and development stories from our team",
                link: "/blogs",
                color: "text-secondary"
              },
              {
                icon: MessageCircle,
                title: "Community",
                description: "Join discussions, share experiences, and connect with fellow gamers",
                link: "/insights",
                color: "text-accent"
              },
              {
                icon: Zap,
                title: "Latest Updates",
                description: "Stay informed about new releases, features, and studio news",
                link: "/blogs",
                color: "text-primary-glow"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className="gaming-card group" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color} transition-transform group-hover:scale-110`} />
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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

      {/* Call to Action */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of players in our gaming community. Create your account to unlock exclusive content, 
              participate in discussions, and be the first to know about new releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="hero" className="w-full sm:w-auto group">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </Link>
              <Link to="/games">
                <Button variant="neon" size="hero" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" />
                  Start Playing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold gradient-text">DSY Studio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating immersive gaming experiences that push the boundaries of interactive entertainment.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Games</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/games" className="hover:text-primary transition-colors">All Games</Link></li>
                <li><Link to="/games/1" className="hover:text-primary transition-colors">Antim Sawari</Link></li>
                <li><span className="cursor-not-allowed opacity-50">Coming Soon</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/insights" className="hover:text-primary transition-colors">Discussions</Link></li>
                <li><Link to="/blogs" className="hover:text-primary transition-colors">Developer Blog</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Join Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DSY Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;