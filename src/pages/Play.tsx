// src/pages/Play.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play as PlayIcon, Bot } from "lucide-react"; // --- 1. IMPORT BOT ICON ---
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

  // --- 2. CONTROL SWITCH ---
  // Set this to 'true' to FORCE the "No games" screen.
  // Set this to 'false' to show games (if they exist).
  const SHOW_NO_GAMES_SCREEN = true; 

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

  // --- 3. LOGIC TO DETERMINE VIEW ---
  // If the manual switch is ON, OR if there are actually no games -> Show Robot
  const showEmptyState = SHOW_NO_GAMES_SCREEN || playableGames.length === 0;

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
        
        {!showEmptyState ? (
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
          // --- 4. FUNKY ROBOT "NO GAMES" UI ---
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-primary/20 rounded-3xl bg-background/30 backdrop-blur-sm"
          >
            <div className="relative mb-6">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              {/* The Funky Robot Icon */}
              <Bot className="w-24 h-24 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl font-bold mb-2 gradient-text">No games till now</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our gamer robots are currently compiling the fun. Check back later for new web adventures!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Play;