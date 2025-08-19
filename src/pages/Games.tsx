import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Star, Clock, Users } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";

// CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching from Supabase
const mockGames = [
  {
    id: 1,
    title: "Antim Sawari",
    description: "A psychological horror masterpiece that will test your sanity and courage.",
    genre: "Horror",
    status: "Released",
    releaseDate: "2024-03-15",
    rating: 4.8,
    players: "Single Player",
    image: "/api/placeholder/400/250",
    featured: true,
    tags: ["Horror", "Psychological", "Atmospheric", "Story Rich"]
  },
  {
    id: 2,
    title: "Neon Runners",
    description: "Fast-paced cyberpunk racing through neon-lit cities.",
    genre: "Racing",
    status: "In Development",
    releaseDate: "2024-08-20",
    rating: 0,
    players: "Multiplayer",
    image: "/api/placeholder/400/250",
    featured: true,
    tags: ["Racing", "Cyberpunk", "Multiplayer", "Fast-Paced"]
  },
  {
    id: 3,
    title: "Mystic Realms",
    description: "Explore magical worlds filled with ancient mysteries.",
    genre: "Adventure",
    status: "Coming Soon",
    releaseDate: "2024-12-10",
    rating: 0,
    players: "Single Player",
    image: "/api/placeholder/400/250",
    featured: false,
    tags: ["Adventure", "Fantasy", "Exploration", "Magic"]
  },
  {
    id: 4,
    title: "Steel Warriors",
    description: "Tactical mech combat in a post-apocalyptic world.",
    genre: "Strategy",
    status: "Early Access",
    releaseDate: "2024-01-05",
    rating: 4.2,
    players: "Multiplayer",
    image: "/api/placeholder/400/250",
    featured: false,
    tags: ["Strategy", "Mech", "Tactical", "Post-Apocalyptic"]
  }
];

const Games = () => {
  const [games, setGames] = useState(mockGames);
  const [loading, setLoading] = useState(false);

  // CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      // Simulate API call - replace with Supabase query
      setTimeout(() => {
        setGames(mockGames);
        setLoading(false);
      }, 1000);
    };

    fetchGames();
  }, []);

  const featuredGames = games.filter(game => game.featured);
  const allGames = games;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released":
        return "bg-accent text-accent-foreground";
      case "In Development":
        return "bg-primary text-primary-foreground";
      case "Coming Soon":
        return "bg-secondary text-secondary-foreground";
      case "Early Access":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const GameCard = ({ game }: { game: typeof mockGames[0] }) => (
    <Card className="gaming-card group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(game.status)}>
            {game.status}
          </Badge>
        </div>
        {game.rating > 0 && (
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">{game.rating}</span>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {game.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {game.genre}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {game.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {game.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{game.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{game.players}</span>
          </div>
        </div>

        <Link to={`/games/${game.id}`}>
          <Button variant="gaming" className="w-full">
            Learn More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">
            <div className="animate-glow-pulse w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading games...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Our Games
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of immersive gaming experiences, from psychological horror to cyberpunk adventures.
          </p>
        </div>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Featured
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game, index) => (
                <div key={game.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allGames.map((game, index) => (
                <div key={game.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Games;