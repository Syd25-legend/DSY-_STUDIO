import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { Game } from "./GameDetail";
import { Helmet } from 'react-helmet-async';
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

const titleVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase.from('games').select('*').order('featured', { ascending: false });
        if (error) {
          console.error('Error fetching games:', error);
          setGames([]);
        } else {
          setGames((data as Game[]) || []);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released": return "bg-accent text-accent-foreground";
      case "In Development": return "bg-primary text-primary-foreground";
      case "Coming Soon": return "bg-secondary text-secondary-foreground";
      case "Early Access": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const GameCard = ({ game }: { game: Game }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const tagsToShow = isExpanded ? game.tags : game.tags?.slice(0, 3);

    return (
      <Card className="gaming-card group overflow-hidden flex flex-col h-full">
        <Link to={`/games/${game.id}`} className="flex flex-col flex-grow">
          <div className="relative overflow-hidden">
            {/* --- MODIFICATION START: Conditional rendering for the image --- */}
            {game.image ? (
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-48 object-cover transition-transform group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-muted/50 border-b border-border">
                <h3 className="text-lg font-heading text-center p-4 text-muted-foreground">
                  {game.title}
                </h3>
              </div>
            )}
            {/* --- MODIFICATION END --- */}

            <div className="absolute top-3 left-3"><Badge className={getStatusColor(game.status)}>{game.status}</Badge></div>
            {game.rating > 0 && <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /><span className="text-xs font-medium">{game.rating}</span></div>}
          </div>
          <CardHeader>
            <div className="flex justify-between items-start mb-2"><CardTitle className="text-lg group-hover:text-primary transition-colors">{game.title}</CardTitle><Badge variant="outline" className="text-xs flex-shrink-0">{game.genre}</Badge></div>
            <CardDescription className="text-sm line-clamp-2 h-10">{game.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col flex-grow">
            <div className="flex flex-wrap gap-1 items-center transition-all duration-300">
              {tagsToShow?.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
              {game.tags && game.tags.length > 3 && !isExpanded && <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-primary/20" onClick={(e) => { e.preventDefault(); setIsExpanded(true); }}>+{game.tags.length - 3}</Badge>}
            </div>
          </CardContent>
        </Link>
        <div className="p-6 pt-0 mt-auto">
           <Link to={`/payment/${game.id}`} className="mt-auto">
            <Button variant="outline" className="w-full text-accent border-accent hover:bg-accent hover:text-accent-foreground">
              <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now - {game.price}
            </Button>
          </Link>
        </div>
      </Card>
    );
  };

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  if (!games.length) {
    return (
      <div className="min-h-screen bg-gradient-hero"><GamingHeader /><div className="container mx-auto px-4 pt-32 pb-16"><div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Our Games</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">No games available at the moment. Check back soon for exciting new releases!</p>
      </div></div></div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet><title>Our Games - DSY Studio</title><meta name="description" content="Explore the full collection of games from DSY Studio. Discover our immersive gaming experiences, from psychological horror to cyberpunk adventures." /></Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Our Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover our collection of immersive gaming experiences, from psychological horror to cyberpunk adventures.</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={gridContainerVariants}
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={cardVariants}>
              <GameCard game={game} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Games;