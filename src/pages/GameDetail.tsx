import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  Users, 
  Monitor, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  Play,
  Download,
  Heart,
  Share2
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";

// CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching from Supabase
const mockGameData: { [key: string]: any } = {
  1: {
    id: 1,
    title: "Antim Sawari",
    description: "A psychological horror masterpiece that will test your sanity and courage in ways you never imagined.",
    fullStory: "In the depths of an abandoned psychiatric facility, you play as Dr. Sarah Chen, a forensic psychologist investigating a series of mysterious disappearances. As you delve deeper into the facility's dark history, reality begins to blur with nightmare. Every shadow holds secrets, every door leads to terror, and every choice determines your fate. Experience a gripping narrative that challenges your perception of reality while delivering spine-chilling horror that stays with you long after you stop playing.",
    genre: "Horror",
    status: "Released",
    releaseDate: "2024-03-15",
    rating: 4.8,
    players: "Single Player",
    developer: "DSY Studio",
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
    tags: ["Horror", "Psychological", "Atmospheric", "Story Rich", "Single Player", "Dark"],
    media: [
      "/api/placeholder/800/450",
      "/api/placeholder/800/450",
      "/api/placeholder/800/450",
      "/api/placeholder/800/450"
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1060 / AMD RX 580",
        storage: "25 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
        storage: "25 GB available space (SSD)"
      }
    },
    price: "$29.99",
    reviews: [
      {
        id: 1,
        author: "GamerReviewer",
        rating: 5,
        comment: "Absolutely terrifying and beautifully crafted. The atmosphere is incredible!",
        date: "2024-03-20"
      },
      {
        id: 2,
        author: "HorrorFan92",
        rating: 4,
        comment: "Great story and visuals, though some puzzles were a bit challenging.",
        date: "2024-03-18"
      }
    ]
  }
};

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching
  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      // Simulate API call - replace with Supabase query
      setTimeout(() => {
        const gameData = mockGameData[id as string];
        setGame(gameData || null);
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchGame();
    }
  }, [id]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // CHANGES FOR AUTH AND DATABASE HERE - Add to user favorites in Supabase
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Add toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">
            <div className="animate-glow-pulse w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading game details...</p>
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

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/games">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                  {game.title}
                </h1>
                <Badge className={getStatusColor(game.status)}>
                  {game.status}
                </Badge>
              </div>

              <p className="text-lg text-muted-foreground">
                {game.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Media Gallery */}
            <Card className="gaming-card overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={game.media[selectedMedia]}
                    alt={`${game.title} screenshot ${selectedMedia + 1}`}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {game.media.map((media: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedMedia(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedMedia === index
                              ? "border-primary"
                              : "border-transparent hover:border-primary/50"
                          }`}
                        >
                          <img
                            src={media}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Details Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="space-y-4">
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle>Full Story</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {game.fullStory}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Monitor className="mr-2 h-5 w-5" />
                        Minimum Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">OS:</span>
                        <span>{game.systemRequirements.minimum.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processor:</span>
                        <span className="text-right text-sm">{game.systemRequirements.minimum.processor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Memory:</span>
                        <span>{game.systemRequirements.minimum.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Graphics:</span>
                        <span className="text-right text-sm">{game.systemRequirements.minimum.graphics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage:</span>
                        <span>{game.systemRequirements.minimum.storage}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Cpu className="mr-2 h-5 w-5" />
                        Recommended Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">OS:</span>
                        <span>{game.systemRequirements.recommended.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processor:</span>  
                        <span className="text-right text-sm">{game.systemRequirements.recommended.processor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Memory:</span>
                        <span>{game.systemRequirements.recommended.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Graphics:</span>
                        <span className="text-right text-sm">{game.systemRequirements.recommended.graphics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage:</span>
                        <span>{game.systemRequirements.recommended.storage}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {game.reviews.map((review: any) => (
                  <Card key={review.id} className="gaming-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.author}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="gaming-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {game.price}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFavorite}
                      className={isFavorited ? "text-red-500" : ""}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="gaming" size="lg" className="w-full">
                  <Play className="mr-2 h-5 w-5" />
                  Play Now
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <Download className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle>Game Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Developer:</span>
                    <span>{game.developer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Date:</span>
                    <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genre:</span>
                    <span>{game.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players:</span>
                    <span>{game.players}</span>
                  </div>
                  {game.rating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{game.rating}/5</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Available Platforms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map((platform: string) => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;