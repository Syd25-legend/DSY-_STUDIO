import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Users, 
  Search, 
  TrendingUp, 
  ArrowRight,
  Pin
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";
import { Helmet } from 'react-helmet-async';

interface Insight {
  id: string;
  title: string;
  content: string;
  user_id: string;
  game_id: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  likes: number;
  views: number;
  media_url: string;
  created_at: string;
}

const titleVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};


const Insights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching insights:', error);
          setInsights([]);
        } else {
          setInsights(data || []);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const categories = ["All", ...Array.from(new Set(insights.map(insight => insight.category).filter(Boolean)))];
  const pinnedInsights = insights.filter(insight => insight.is_pinned);
  const popularInsights = insights.filter(insight => insight.likes > 10 && !insight.is_pinned);

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = !searchTerm || 
      insight.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || insight.category === selectedCategory;
    return matchesSearch && matchesCategory && !insight.is_pinned;
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

  const InsightCard = ({ insight, showPin = false }: { insight: Insight, showPin?: boolean }) => (
    <Card className="gaming-card group h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(insight.category)}>{insight.category}</Badge>
            {showPin && insight.is_pinned && <Badge variant="outline" className="border-accent text-accent"><Pin className="w-3 h-3 mr-1" />Pinned</Badge>}
            {insight.likes > 10 && <Badge variant="outline" className="border-primary text-primary"><TrendingUp className="w-3 h-3 mr-1" />Popular</Badge>}
          </div>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">{insight.title}</CardTitle>
        <CardDescription className="line-clamp-2">{insight.content?.substring(0, 150)}...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col justify-end">
        <div className="flex flex-wrap gap-1">
          {insight.tags?.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
        </div>
        <div className="text-sm text-muted-foreground pt-2">{new Date(insight.created_at).toLocaleDateString()}</div>
        <Link to={`/insights/${insight.id}`}><Button variant="gaming" className="w-full group/btn">View Discussion<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" /></Button></Link>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  if (!insights.length) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Community Insights</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">No discussions available at the moment. Check back soon for community insights!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Community Insights | DSY Studio</title>
        <meta name="description" content="Join discussions, share your game insights, and connect with fellow gamers and the developers at DSY Studio." />
        <link rel="canonical" href="https://www.studiodsy.xyz/insights" />
      </Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div className="text-center mb-12" variants={titleVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-4">
            Community Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-1">
            Join discussions, share insights, and connect with fellow gamers and developers.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search discussions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-primary/20 focus:border-primary/40" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => <Button key={category} variant={selectedCategory === category ? "gaming" : "pill"} size="sm" onClick={() => setSelectedCategory(category)}>{category}</Button>)}
          </div>
        </div>

        {searchTerm === "" && selectedCategory === "All" && pinnedInsights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center"><Pin className="mr-2 h-6 w-6" />Pinned Discussions</h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={gridContainerVariants} initial="hidden" animate="visible">
              {pinnedInsights.map((insight) => <motion.div key={insight.id} variants={cardVariants}><InsightCard insight={insight} showPin /></motion.div>)}
            </motion.div>
          </div>
        )}

        {searchTerm === "" && selectedCategory === "All" && popularInsights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center"><TrendingUp className="mr-2 h-6 w-6" />Popular Discussions</h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridContainerVariants} initial="hidden" animate="visible">
              {popularInsights.slice(0, 3).map((insight) => <motion.div key={insight.id} variants={cardVariants}><InsightCard insight={insight} /></motion.div>)}
            </motion.div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center"><MessageCircle className="mr-2 h-6 w-6" />{searchTerm || selectedCategory !== "All" ? "Search Results" : "All Discussions"}</h2>
          {filteredInsights.length === 0 ? (
            <div className="text-center py-12"><p className="text-muted-foreground">No discussions found matching your search.</p></div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridContainerVariants} initial="hidden" animate="visible">
              {filteredInsights.map((insight) => <motion.div key={insight.id} variants={cardVariants}><InsightCard insight={insight} /></motion.div>)}
            </motion.div>
          )}
        </div>

        {!user && (
          <div className="text-center mt-16">
            <Card className="gaming-card max-w-lg mx-auto">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Join the Conversation</h3>
                <p className="text-muted-foreground mb-4">Create an account to start discussions, share insights, and connect with the community.</p>
                <Link to="/auth"><Button variant="gaming" size="lg">Get Started</Button></Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;