// src/pages/Play.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play as PlayIcon } from "lucide-react";
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
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Play = () => {
  const [playableGames, setPlayableGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayableGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .neq('game_type', 'portfolio')
          .order('featured', { ascending: false });

        if (error) throw error;
        setPlayableGames((data as Game[]) || []);

      } catch (error) {
        console.error('Error fetching playable games:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayableGames();
  }, []);

  const PlayableGameCard = ({ game }: { game: Game }) => (
    <Card className="gaming-card group overflow-hidden flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img 
          src={game.image || ''} 
          alt={game.title} 
          className="w-full h-48 object-cover transition-transform group-hover:scale-105" 
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{game.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 h-10">{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link to={`/play/${game.id}`}>
          <Button variant="gaming" className="w-full">
            <PlayIcon className="mr-2 h-4 w-4" /> Play Game
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Play Games | DSY Studio</title>
        <meta name="description" content="Play web-based games directly from your browser. Explore the collection of playable indie games from DSY Studio." />
        <link rel="canonical" href="https://www.studiodsy.xyz/play" />
      </Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Play Our Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Launch directly into our web-based games. No downloads required.</p>
        </motion.div>
        
        {playableGames.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={gridContainerVariants}
          >
            {playableGames.map((game) => (
              <motion.div key={game.id} variants={cardVariants}>
                <PlayableGameCard game={game} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <h3 className="mt-4 text-lg font-semibold">No Web Games... Yet!</h3>
            <p className="mt-1 text-sm text-muted-foreground">There are no playable web games available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;