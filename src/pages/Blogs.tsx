import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  published_at: string;
  read_time: string;
  category: string;
  image_url: string;
  featured: boolean;
  tags: string[];
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

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('featured', { ascending: false })
          .order('published_at', { ascending: false });

        if (error) {
          console.error('Error fetching blogs:', error);
          setBlogs([]);
        } else {
          setBlogs(data || []);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map(blog => blog.category).filter(Boolean)))];
  const featuredBlogs = blogs.filter(blog => blog.featured);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = !searchTerm || 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const BlogCard = ({ blog, featured = false }: { blog: Blog, featured?: boolean }) => (
    <Card className={`gaming-card group overflow-hidden h-full flex flex-col ${featured ? 'md:col-span-2' : ''}`}>
      <div className="relative overflow-hidden">
        <img
          src={blog.image_url || "/api/placeholder/600/300"}
          alt={blog.title}
          className={`w-full object-cover transition-transform group-hover:scale-105 ${
            featured ? 'h-64' : 'h-48'
          }`}
        />
        <div className="absolute top-3 left-3">
          <Badge className={getCategoryColor(blog.category)}>
            {blog.category}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className={`group-hover:text-primary transition-colors ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {blog.title}
        </CardTitle>
        <CardDescription className={`line-clamp-2 ${featured ? 'text-base' : 'text-sm'}`}>
          {blog.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 mt-auto">
        <div className="flex flex-wrap gap-1 pb-3">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Link to={`/blogs/${blog.id}`}>
          <Button variant="gaming" className="w-full group/btn">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  if (!blogs.length) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Developer Blogs</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">No blog posts available at the moment. Check back soon for updates!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div className="text-center mb-12" variants={titleVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-4">
            Developer Blogs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-1">
            Behind-the-scenes insights, development updates, and thoughts from the DSY Studio team.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category} variant={selectedCategory === category ? "gaming" : "pill"} size="sm" onClick={() => setSelectedCategory(category)}>
                {category}
              </Button>
            ))}
          </div>
        </div>

        {searchTerm === "" && selectedCategory === "All" && featuredBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Featured Articles</h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={gridContainerVariants} initial="hidden" animate="visible">
              {featuredBlogs.slice(0, 2).map((blog) => (
                <motion.div key={blog.id} variants={cardVariants}><BlogCard blog={blog} featured /></motion.div>
              ))}
            </motion.div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 gradient-text">{searchTerm || selectedCategory !== "All" ? "Search Results" : "Latest Articles"}</h2>
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12"><p className="text-muted-foreground">No blogs found matching your search.</p></div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridContainerVariants} initial="hidden" animate="visible">
              {filteredBlogs.map((blog) => (
                <motion.div key={blog.id} variants={cardVariants}><BlogCard blog={blog} /></motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;