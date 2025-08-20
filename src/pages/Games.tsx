import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Star, Clock, Users } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  status: string;
  releaseDate: string;
  rating: number;
  image: string;
  featured: boolean;
  tags: string[];
  platforms: string[];
  developer: string;
  price: string;
  media: string[];
  fullStory: string;
  systemRequirements: any;
}

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('featured', { ascending: false });

        if (error) {
          console.error('Error fetching games:', error);
          setGames([]);
        } else {
          setGames(data || []);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
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

  const GameCard = ({ game }: { game: Game }) => (
    <Card className="gaming-card group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={game.image || "/api/placeholder/400/250"}
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
          {game.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {game.tags && game.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{game.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'TBA'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{game.platforms?.join(', ') || 'TBA'}</span>
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
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="gaming-card">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!games.length) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Our Games
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              No games available at the moment. Check back soon for exciting new releases!
            </p>
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