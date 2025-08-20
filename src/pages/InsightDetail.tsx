import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, MessageCircle, ArrowLeft, Pin, Heart } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const InsightDetail = () => {
  const { id } = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching insight:', error);
      } else {
        setInsight(data);
        // Increment view count
        if (data) {
          await supabase
            .from('insights')
            .update({ views: data.views + 1 })
            .eq('id', id);
        }
      }
      setLoading(false);
    };

    const fetchComments = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
      setCommentsLoading(false);
    };

    fetchInsight();
    fetchComments();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Discussion Not Found</h1>
            <p className="text-muted-foreground mb-8">The discussion you're looking for doesn't exist.</p>
            <Link to="/insights">
              <Button variant="gaming">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/insights">
              <Button variant="outline" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Button>
            </Link>

            {insight.media_url && (
              <div className="relative overflow-hidden rounded-lg mb-8">
                <img
                  src={insight.media_url}
                  alt={insight.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2 flex-wrap">
                <Badge className={getCategoryColor(insight.category)}>
                  {insight.category}
                </Badge>
                {insight.is_pinned && (
                  <Badge variant="outline" className="border-accent text-accent">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {insight.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(insight.views)} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(insight.likes)} likes</span>
                  </div>
                </div>
              </div>

              {insight.tags && insight.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {insight.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <Card className="gaming-card mb-8">
            <CardContent className="pt-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-foreground">
                  {insight.content || "Content coming soon..."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-border/50 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={comment.profiles?.avatar_url} />
                          <AvatarFallback>
                            {comment.profiles?.username?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">
                              {comment.profiles?.username || 'Anonymous'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InsightDetail;