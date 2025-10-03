import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Star, 
  Monitor, 
  Cpu,
  Download,
  Share2,
  ShoppingBag
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

interface SystemRequirementsDetails {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  fullStory: string;
  genre: string;
  status: string;
  releaseDate: string;
  rating: number;
  developer: string;
  platforms: string[];
  tags: string[];
  media: string[];
  systemRequirements: {
    minimum?: SystemRequirementsDetails;
    recommended?: SystemRequirementsDetails;
  };
  price: string;
  image: string | null;
  featured: boolean;
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
  },
};

// --- 1. NEW COMPONENT TO HANDLE RELEASE DATE LOGIC ---
const ReleaseDateDisplay = ({ dateString }: { dateString: string | null }) => {
  if (!dateString) {
    return <span>TBA</span>;
  }

  const releaseDate = new Date(dateString);

  // Check if the date string is a valid date
  if (isNaN(releaseDate.getTime())) {
    // If not a valid date, it's a string like "Coming Soon", so display it directly
    return <span>{dateString}</span>;
  }

  // Get today's date with the time set to the start of the day for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (releaseDate > today) {
    // If the release date is in the future
    return <span>Releasing on {formattedDate}</span>;
  } else {
    // If the release date is today or in the past
    return <span>{formattedDate}</span>;
  }
};


const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchGameAndPurchaseStatus = async () => {
      if (!id) return;
      setLoading(true);
      setHasPurchased(false);
      try {
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();

        if (gameError) throw gameError;
        setGame(gameData as Game);

        if (user) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('id')
            .eq('user_id', user.id)
            .eq('game_id', id)
            .limit(1)
            .single();
          
          if (orderError && orderError.code !== 'PGRST116') {
            throw orderError;
          }
          if (orderData) {
            setHasPurchased(true);
          }
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndPurchaseStatus();
  }, [id, user]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link.");
    }
  };

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <Link to="/games"><Button variant="gaming"><ArrowLeft className="mr-2 h-4 w-4" />Back to Games</Button></Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released": return "bg-accent text-accent-foreground";
      case "In Development": return "bg-primary text-primary-foreground";
      case "Coming Soon": return "bg-secondary text-secondary-foreground";
      case "Early Access": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };
  
  const ActionButton = () => {
    if (hasPurchased) {
      return (
        <a href="https://syd-25.itch.io/antim-yatra" target="_blank" rel="noopener noreferrer">
          <Button variant="gaming" size="lg" className="w-full">
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
        </a>
      );
    }
    return (
      <Link to={`/payment/${game.id}`} className="w-full">
        <Button variant="hero" size="lg" className="w-full">
          <ShoppingBag className="mr-2 h-5 w-5" /> Buy Now
        </Button>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>{game.title} - DSY Studio</title>
        <meta name="description" content={game.description} />
      </Helmet>
      <GamingHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8"><Link to="/games"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Games</Button></Link></div>
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={fadeIn} initial="hidden" animate="visible">
          <motion.div className="lg:col-span-2 space-y-8" variants={fadeIn}>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4"><h1 className="text-3xl md:text-4xl font-bold gradient-text">{game.title}</h1><Badge className={getStatusColor(game.status)}>{game.status}</Badge></div>
              <p className="text-lg text-muted-foreground">{game.description}</p>
              <div className="flex flex-wrap gap-2">{game.tags?.map((tag: string) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
            </div>
            <Card className="gaming-card overflow-hidden"><CardContent className="p-0"><div className="relative">
              {game.media && game.media.length > 0 && (<><img src={game.media[selectedMedia]} alt={`${game.title} screenshot ${selectedMedia + 1}`} className="w-full h-96 object-cover" /><div className="absolute bottom-4 left-4 right-4"><div className="flex space-x-2 overflow-x-auto">
                {game.media.map((media: string, index: number) => (<button key={index} onClick={() => setSelectedMedia(index)} className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-colors ${selectedMedia === index ? "border-primary" : "border-transparent hover:border-primary/50"}`}><img src={media} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" /></button>))}
              </div></div></>)}
            </div></CardContent></Card>
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="story">Story</TabsTrigger><TabsTrigger value="requirements">Requirements</TabsTrigger></TabsList>
              <TabsContent value="story" className="space-y-4 pt-4"><Card className="gaming-card"><CardHeader><CardTitle>Full Story</CardTitle></CardHeader><CardContent><p className="text-muted-foreground leading-relaxed">{game.fullStory}</p></CardContent></Card></TabsContent>
              <TabsContent value="requirements" className="space-y-4 pt-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.systemRequirements?.minimum && (<Card className="gaming-card"><CardHeader><CardTitle className="flex items-center"><Monitor className="mr-2 h-5 w-5" />Minimum</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">OS:</span><span>{game.systemRequirements.minimum.os}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Processor:</span><span className="text-right">{game.systemRequirements.minimum.processor}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Memory:</span><span>{game.systemRequirements.minimum.memory}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Graphics:</span><span className="text-right">{game.systemRequirements.minimum.graphics}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Storage:</span><span>{game.systemRequirements.minimum.storage}</span></div>
                </CardContent></Card>)}
                {game.systemRequirements?.recommended && (<Card className="gaming-card"><CardHeader><CardTitle className="flex items-center"><Cpu className="mr-2 h-5 w-5" />Recommended</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">OS:</span><span>{game.systemRequirements.recommended.os}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Processor:</span><span className="text-right">{game.systemRequirements.recommended.processor}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Memory:</span><span>{game.systemRequirements.recommended.memory}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Graphics:</span><span className="text-right">{game.systemRequirements.recommended.graphics}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Storage:</span><span>{game.systemRequirements.recommended.storage}</span></div>
                </CardContent></Card>)}
              </div></TabsContent>
            </Tabs>
          </motion.div>
          <motion.div className="space-y-6" variants={fadeIn}>
            <Card className="gaming-card"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-2xl font-bold">{game.price}</CardTitle><div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
            </div></div></CardHeader><CardContent className="space-y-4">
              <ActionButton />
            </CardContent></Card>
            <Card className="gaming-card"><CardHeader><CardTitle>Game Information</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                {/* <div className="flex justify-between"><span className="text-muted-foreground">Developer:</span><span>{game.developer}</span></div> */}
                {/* --- 2. REPLACE THE OLD RENDERING WITH THE NEW COMPONENT --- */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Date:</span>
                  <span className="text-right"><ReleaseDateDisplay dateString={game.releaseDate} /></span>
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">Genre:</span><span>{game.genre}</span></div>
                {game.rating > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Rating:</span><div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{game.rating}/5</span></div></div>}
              </div><Separator /><div>
                <h4 className="font-medium mb-2 text-sm">Available Platforms:</h4>
                <div className="flex flex-wrap gap-2">{game.platforms?.map((platform: string) => <Badge key={platform} variant="secondary">{platform}</Badge>)}</div>
              </div></CardContent></Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameDetail;