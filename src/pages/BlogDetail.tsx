import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  ArrowLeft
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  published_at: string;
  read_time: string;
  category: string;
  image_url: string;
  featured: boolean;
  tags: string[];
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching blog:', error);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Development": "bg-primary text-primary-foreground",
      "Audio": "bg-secondary text-secondary-foreground",
      "News": "bg-accent text-accent-foreground",
      "Psychology": "bg-muted text-muted-foreground",
      "Community": "bg-primary/80 text-primary-foreground"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/blogs">
              <Button variant="gaming">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
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
        <motion.div className="max-w-4xl mx-auto" variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-8">
            <Link to="/blogs">
              <Button variant="outline" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>
            </Link>

            {blog.image_url && (
              <div className="relative overflow-hidden rounded-lg mb-8">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(blog.category)}>
                    {blog.category}
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {blog.title}
              </h1>
              
              <p className="text-xl text-muted-foreground">
                {blog.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                </div>
                {blog.read_time && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{blog.read_time}</span>
                  </div>
                )}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Card className="gaming-card">
            <CardContent className="pt-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-foreground">
                  {blog.content || "Content coming soon..."}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;