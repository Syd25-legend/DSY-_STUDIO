import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Search, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Pin,
  Eye
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";

// CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching from Supabase
const mockTopics = [
  {
    id: 1,
    title: "Antim Sawari - Share Your Horror Experiences",
    description: "Discuss your most terrifying moments, theories about the story, and share screenshots from your playthrough.",
    category: "Game Discussion",
    author: {
      name: "DSY Studio",
      avatar: "/api/placeholder/32/32",
      isAdmin: true
    },
    createdAt: "2024-03-15",
    replies: 247,
    views: 3420,
    lastActivity: "2024-03-19",
    isPinned: true,
    isPopular: true,
    tags: ["Antim Sawari", "Horror", "Discussion"]
  },
  {
    id: 2,
    title: "What Makes a Great Horror Game? Developer AMA",
    description: "Join our lead developer for an Ask Me Anything session about horror game design, psychology, and what makes players truly scared.",
    category: "Developer AMA",
    author: {
      name: "Alex Chen",
      avatar: "/api/placeholder/32/32",
      isAdmin: true
    },
    createdAt: "2024-03-12",
    replies: 189,
    views: 2850,
    lastActivity: "2024-03-18",
    isPinned: true,
    isPopular: false,
    tags: ["AMA", "Game Design", "Horror"]
  },
  {
    id: 3,
    title: "Community Challenge: Create Your Own Horror Scenario",
    description: "Submit your own horror game scenarios and vote on the best ones. The winner might inspire our next project!",
    category: "Community Challenge",
    author: {
      name: "Community Team",
      avatar: "/api/placeholder/32/32",
      isAdmin: true
    },
    createdAt: "2024-03-10",
    replies: 156,
    views: 2100,
    lastActivity: "2024-03-19",
    isPinned: false,
    isPopular: true,
    tags: ["Community", "Contest", "Creative"]
  },
  {
    id: 4,
    title: "Technical Issues & Bug Reports",
    description: "Report any technical issues you've encountered and get help from our support team and community.",
    category: "Support",
    author: {
      name: "Support Team",
      avatar: "/api/placeholder/32/32",
      isAdmin: true
    },
    createdAt: "2024-03-08",
    replies: 94,
    views: 1650,
    lastActivity: "2024-03-19",
    isPinned: false,
    isPopular: false,
    tags: ["Support", "Bug Reports", "Technical"]
  },
  {
    id: 5,
    title: "Fan Art & Creative Content Showcase",
    description: "Share your fan art, videos, mods, and other creative content inspired by our games.",
    category: "Fan Content",
    author: {
      name: "DSY Studio",
      avatar: "/api/placeholder/32/32",
      isAdmin: true
    },
    createdAt: "2024-03-05",
    replies: 312,
    views: 4200,
    lastActivity: "2024-03-19",
    isPinned: false,
    isPopular: true,
    tags: ["Fan Art", "Creative", "Community"]
  },
  {
    id: 6,
    title: "Upcoming Features & Development Updates",
    description: "Stay updated on what's coming next and provide feedback on upcoming features and improvements.",
    category: "Development",
    author: {
      name: "Dev Team",
      avatar: "/api/placeholder/32/32",
      isAdmin: true
    },
    createdAt: "2024-03-01",
    replies: 203,
    views: 3100,
    lastActivity: "2024-03-18",
    isPinned: false,
    isPopular: false,
    tags: ["Development", "Updates", "Features"]
  }
];

const Insights = () => {
  const [topics, setTopics] = useState(mockTopics);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching
  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      // Simulate API call - replace with Supabase query
      setTimeout(() => {
        setTopics(mockTopics);
        setLoading(false);
      }, 1000);
    };

    fetchTopics();
  }, []);

  const categories = ["All", ...Array.from(new Set(topics.map(topic => topic.category)))];
  const pinnedTopics = topics.filter(topic => topic.isPinned);
  const popularTopics = topics.filter(topic => topic.isPopular && !topic.isPinned);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || topic.category === selectedCategory;
    return matchesSearch && matchesCategory && !topic.isPinned;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Game Discussion": "bg-primary text-primary-foreground",
      "Developer AMA": "bg-secondary text-secondary-foreground",
      "Community Challenge": "bg-accent text-accent-foreground",
      "Support": "bg-muted text-muted-foreground",
      "Fan Content": "bg-primary/80 text-primary-foreground",
      "Development": "bg-secondary/80 text-secondary-foreground"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const TopicCard = ({ topic, showPin = false }: { topic: typeof mockTopics[0], showPin?: boolean }) => (
    <Card className="gaming-card group">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(topic.category)}>
              {topic.category}
            </Badge>
            {showPin && topic.isPinned && (
              <Badge variant="outline" className="border-accent text-accent">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            {topic.isPopular && (
              <Badge variant="outline" className="border-primary text-primary">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
        
        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
          {topic.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {topic.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {topic.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
              <AvatarFallback className="text-xs">
                {topic.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{topic.author.name}</span>
            {topic.author.isAdmin && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                Admin
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(topic.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(topic.replies)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(topic.views)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Last: {new Date(topic.lastActivity).toLocaleDateString()}</span>
          </div>
        </div>

        <Link to={`/insights/${topic.id}`}>
          <Button variant="gaming" className="w-full group/btn">
            Join Discussion
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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
            <p className="text-muted-foreground">Loading community discussions...</p>
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
            Community Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join discussions, share insights, and connect with fellow gamers and developers.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "gaming" : "pill"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Pinned Topics */}
        {searchTerm === "" && selectedCategory === "All" && pinnedTopics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center">
              <Pin className="mr-2 h-6 w-6" />
              Pinned Discussions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedTopics.map((topic, index) => (
                <div key={topic.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TopicCard topic={topic} showPin />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Topics */}
        {searchTerm === "" && selectedCategory === "All" && popularTopics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" />
              Popular Discussions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTopics.slice(0, 3).map((topic, index) => (
                <div key={topic.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TopicCard topic={topic} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Topics */}
        <div>
          <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center">
            <MessageCircle className="mr-2 h-6 w-6" />
            {searchTerm || selectedCategory !== "All" ? "Search Results" : "All Discussions"}
          </h2>
          
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No discussions found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => (
                <div key={topic.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TopicCard topic={topic} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="gaming-card max-w-lg mx-auto">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Join the Conversation</h3>
              <p className="text-muted-foreground mb-4">
                Create an account to start discussions, share insights, and connect with the community.
              </p>
              <Link to="/auth">
                <Button variant="gaming" size="lg">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Insights;