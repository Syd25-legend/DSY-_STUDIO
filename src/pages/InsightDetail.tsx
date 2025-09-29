import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Eye, MessageCircle, ArrowLeft, Pin, PlusCircle } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

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

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const InsightDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [insight, setInsight] = useState<Insight | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setCommentsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`*, profiles (username, avatar_url)`)
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments((data as Comment[]) || []);
    }
    setCommentsLoading(false);
  }, [id]);


  useEffect(() => {
    const fetchInsightAndComments = async () => {
      if (!id) return;
      setLoading(true);

      const { data: insightData, error: insightError } = await supabase
        .from('insights').select('*').eq('id', id).single();

      if (insightError) {
        console.error('Error fetching insight:', insightError);
      } else {
        setInsight(insightData);
        if (insightData) {
          await supabase.from('insights').update({ views: insightData.views + 1 }).eq('id', id);
        }
      }
      setLoading(false);
      
      await fetchComments();
    };
    
    fetchInsightAndComments();
  }, [id, fetchComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast({ title: "Comment cannot be empty.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "You must be logged in to comment.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({ post_id: id, user_id: user.id, content: newComment.trim() });
      if (error) throw error;
      toast({ title: "Comment posted successfully!" });
      setNewComment("");
      setShowCommentForm(false);
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({ title: "Failed to post comment.", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  if (!insight) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Discussion Not Found</h1>
          <Link to="/insights"><Button variant="gaming"><ArrowLeft className="mr-2 h-4 w-4" />Back to Insights</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div className="max-w-4xl mx-auto" variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-8">
            <Link to="/insights"><Button variant="outline" className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" />Back to Insights</Button></Link>
            {insight.media_url && <div className="relative overflow-hidden rounded-lg mb-8"><img src={insight.media_url} alt={insight.title} className="w-full h-64 md:h-96 object-cover" /></div>}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 flex-wrap"><Badge className={getCategoryColor(insight.category)}>{insight.category}</Badge>{insight.is_pinned && <Badge variant="outline" className="border-accent text-accent"><Pin className="w-3 h-3 mr-1" />Pinned</Badge>}</div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-2">{insight.title}</h1>
              <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1"><Calendar className="w-4 h-4" /><span>{new Date(insight.created_at).toLocaleDateString()}</span></div>
                  <div className="flex items-center space-x-1"><Eye className="w-4 h-4" /><span>{formatNumber(insight.views)} views</span></div>
                </div>
              </div>
              {insight.tags && insight.tags.length > 0 && <div className="flex flex-wrap gap-2">{insight.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}</div>}
            </div>
          </div>
          <Card className="gaming-card mb-8"><CardContent className="pt-8"><div className="prose prose-lg max-w-none"><div className="whitespace-pre-wrap text-foreground">{insight.content || "Content coming soon..."}</div></div></CardContent></Card>
          <Card className="gaming-card">
            <CardHeader><CardTitle className="flex items-center justify-between"><span><MessageCircle className="mr-2 h-5 w-5 inline-block" />Comments ({comments.length})</span></CardTitle></CardHeader>
            <CardContent>
              {commentsLoading ? (
                 <p className="text-muted-foreground text-center py-4">Loading comments...</p>
              ) : comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-border/50 pb-4 last:border-b-0"><div className="flex items-start space-x-3"><Avatar className="w-10 h-10"><AvatarImage src={comment.profiles?.avatar_url} /><AvatarFallback>{comment.profiles?.username?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback></Avatar><div className="flex-1"><div className="flex items-center space-x-2 mb-2"><span className="font-semibold">{comment.profiles?.username || 'Anonymous'}</span><span className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span></div><p className="text-foreground whitespace-pre-wrap">{comment.content}</p></div></div></div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to share your thoughts!</p>
              )}
              <div className="mt-8 pt-6 border-t border-border/50">
                {user ? (
                  showCommentForm ? (
                    <div className="space-y-4">
                      <Textarea placeholder="Write your comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-[100px] border-primary/20 focus:border-primary/40" />
                      <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setShowCommentForm(false)} disabled={isSubmitting}>Cancel</Button><Button variant="gaming" onClick={handleCommentSubmit} disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post Comment"}</Button></div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => setShowCommentForm(true)}><PlusCircle className="mr-2 h-4 w-4" />Add a comment</Button>
                  )
                ) : (
                  <p className="text-center text-muted-foreground"><Link to="/auth" className="text-primary hover:underline">Log in</Link> to join the discussion.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InsightDetail;