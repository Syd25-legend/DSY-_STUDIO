import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  Monitor, 
  Cpu,
  Play,
  Download,
  Heart,
  Share2
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// --- NEW: Defined specific types to match your Supabase schema and replace 'any' ---
interface SystemRequirementsDetails {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

// NOTE: Supabase doesn't support JSON arrays for reviews directly in a column.
// This assumes you might fetch reviews from a separate 'reviews' table in the future.
// For now, we will treat it as an empty array.
interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
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
  // players: string;
  developer: string;
  platforms: string[];
  tags: string[];
  media: string[];
  systemRequirements: {
    minimum?: SystemRequirementsDetails;
    recommended?: SystemRequirementsDetails;
  };
  price: string;
  image: string;
  featured: boolean;
}


const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  // FIXED: Replaced useState<any> with the new Game interface
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // --- NEW: Fetches a single game's data from Supabase ---
    const fetchGame = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }
        setGame(data as Game);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You can add a toast notification here to confirm copying
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <Link to="/games">
            <Button variant="gaming">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>
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

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Link to="/games">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">{game.title}</h1>
                <Badge className={getStatusColor(game.status)}>{game.status}</Badge>
              </div>
              <p className="text-lg text-muted-foreground">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                {game.tags?.map((tag: string) => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </div>

            <Card className="gaming-card overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {game.media && game.media.length > 0 && (
                    <>
                      <img src={game.media[selectedMedia]} alt={`${game.title} screenshot ${selectedMedia + 1}`} className="w-full h-96 object-cover" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex space-x-2 overflow-x-auto">
                          {game.media.map((media: string, index: number) => (
                            <button key={index} onClick={() => setSelectedMedia(index)} className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-colors ${selectedMedia === index ? "border-primary" : "border-transparent hover:border-primary/50"}`}>
                              <img src={media} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
              </TabsList>
              <TabsContent value="story" className="space-y-4 pt-4">
                <Card className="gaming-card"><CardHeader><CardTitle>Full Story</CardTitle></CardHeader><CardContent><p className="text-muted-foreground leading-relaxed">{game.fullStory}</p></CardContent></Card>
              </TabsContent>
              <TabsContent value="requirements" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.systemRequirements?.minimum && (
                    <Card className="gaming-card"><CardHeader><CardTitle className="flex items-center"><Monitor className="mr-2 h-5 w-5" />Minimum</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">OS:</span><span>{game.systemRequirements.minimum.os}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Processor:</span><span className="text-right">{game.systemRequirements.minimum.processor}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Memory:</span><span>{game.systemRequirements.minimum.memory}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Graphics:</span><span className="text-right">{game.systemRequirements.minimum.graphics}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Storage:</span><span>{game.systemRequirements.minimum.storage}</span></div>
                    </CardContent></Card>
                  )}
                  {game.systemRequirements?.recommended && (
                    <Card className="gaming-card"><CardHeader><CardTitle className="flex items-center"><Cpu className="mr-2 h-5 w-5" />Recommended</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">OS:</span><span>{game.systemRequirements.recommended.os}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Processor:</span><span className="text-right">{game.systemRequirements.recommended.processor}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Memory:</span><span>{game.systemRequirements.recommended.memory}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Graphics:</span><span className="text-right">{game.systemRequirements.recommended.graphics}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Storage:</span><span>{game.systemRequirements.recommended.storage}</span></div>
                    </CardContent></Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="gaming-card"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-2xl font-bold">{game.price}</CardTitle><div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleFavorite} className={isFavorited ? "text-red-500" : ""}><Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} /></Button>
              <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
            </div></div></CardHeader><CardContent className="space-y-4">
              <Button variant="gaming" size="lg" className="w-full"><Play className="mr-2 h-5 w-5" />Play Now</Button>
              <Button variant="outline" size="lg" className="w-full"><Download className="mr-2 h-5 w-5" />Add to Wishlist</Button>
            </CardContent></Card>

            <Card className="gaming-card"><CardHeader><CardTitle>Game Information</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Developer:</span><span>{game.developer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Release Date:</span><span>{new Date(game.releaseDate).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Genre:</span><span>{game.genre}</span></div>
                {/* <div className="flex justify-between"><span className="text-muted-foreground">Players:</span><span>{game.players || 'N/A'}</span></div> */}
                {game.rating > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Rating:</span><div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{game.rating}/5</span></div></div>}
              </div><Separator /><div>
                <h4 className="font-medium mb-2 text-sm">Available Platforms:</h4>
                <div className="flex flex-wrap gap-2">{game.platforms?.map((platform: string) => <Badge key={platform} variant="secondary">{platform}</Badge>)}</div>
              </div></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
