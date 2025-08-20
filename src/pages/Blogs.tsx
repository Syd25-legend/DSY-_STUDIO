import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Card className={`gaming-card group overflow-hidden ${featured ? 'md:col-span-2' : ''}`}>
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

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'TBA'}</span>
            </div>
          </div>
          {blog.read_time && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{blog.read_time}</span>
            </div>
          )}
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
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="gaming-card">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Developer Blogs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              No blog posts available at the moment. Check back soon for updates!
            </p>
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
            Developer Blogs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Behind-the-scenes insights, development updates, and thoughts from the DSY Studio team.
          </p>
        </div>

        {/* Search and Filter */}
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

        {/* Featured Blogs */}
        {searchTerm === "" && selectedCategory === "All" && featuredBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.slice(0, 2).map((blog, index) => (
                <div key={blog.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BlogCard blog={blog} featured />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Blogs */}
        <div>
          <h2 className="text-2xl font-bold mb-6 gradient-text">
            {searchTerm || selectedCategory !== "All" ? "Search Results" : "Latest Articles"}
          </h2>
          
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blogs found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, index) => (
                <div key={blog.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;