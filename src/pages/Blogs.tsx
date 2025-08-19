import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";
import GamingHeader from "@/components/GamingHeader";

// CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching from Supabase
const mockBlogs = [
  {
    id: 1,
    title: "The Making of Antim Sawari: A Behind-the-Scenes Look",
    excerpt: "Dive deep into the development process of our psychological horror masterpiece and discover the challenges we faced bringing nightmares to life.",
    content: "Full blog content here...",
    author: "DSY Studio Team",
    publishDate: "2024-03-10",
    readTime: "8 min read",
    category: "Development",
    image: "/api/placeholder/600/300",
    featured: true,
    tags: ["Game Development", "Horror", "Behind the Scenes"]
  },
  {
    id: 2,
    title: "Sound Design in Horror Games: Creating Fear Through Audio",
    excerpt: "Learn how we crafted the spine-chilling audio experience that makes Antim Sawari truly terrifying.",
    content: "Full blog content here...",
    author: "Alex Chen",
    publishDate: "2024-02-28",
    readTime: "6 min read",
    category: "Audio",
    image: "/api/placeholder/600/300",
    featured: false,
    tags: ["Sound Design", "Horror", "Audio"]
  },
  {
    id: 3,
    title: "Upcoming Projects: What's Next for DSY Studio",
    excerpt: "Get an exclusive preview of our upcoming games and the exciting new directions we're exploring.",
    content: "Full blog content here...",
    author: "DSY Studio Team",
    publishDate: "2024-02-15",
    readTime: "5 min read",
    category: "News",
    image: "/api/placeholder/600/300",
    featured: true,
    tags: ["News", "Upcoming Games", "Studio Updates"]
  },
  {
    id: 4,
    title: "The Psychology of Horror: Why We Love Being Scared",
    excerpt: "Exploring the psychological aspects that make horror games so compelling and addictive.",
    content: "Full blog content here...",
    author: "Dr. Sarah Martinez",
    publishDate: "2024-02-01",
    readTime: "10 min read",
    category: "Psychology",
    image: "/api/placeholder/600/300",
    featured: false,
    tags: ["Psychology", "Horror", "Game Theory"]
  },
  {
    id: 5,
    title: "Community Spotlight: Fan Art and Creations",
    excerpt: "Celebrating the incredible creativity of our community with featured fan art and community creations.",
    content: "Full blog content here...",
    author: "Community Team",
    publishDate: "2024-01-20",
    readTime: "4 min read",
    category: "Community",
    image: "/api/placeholder/600/300",
    featured: false,
    tags: ["Community", "Fan Art", "Showcase"]
  }
];

const Blogs = () => {
  const [blogs, setBlogs] = useState(mockBlogs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // CHANGES FOR AUTH AND DATABASE HERE - Replace with actual data fetching
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      // Simulate API call - replace with Supabase query
      setTimeout(() => {
        setBlogs(mockBlogs);
        setLoading(false);
      }, 1000);
    };

    fetchBlogs();
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map(blog => blog.category)))];
  const featuredBlogs = blogs.filter(blog => blog.featured);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
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

  const BlogCard = ({ blog, featured = false }: { blog: typeof mockBlogs[0], featured?: boolean }) => (
    <Card className={`gaming-card group overflow-hidden ${featured ? 'md:col-span-2' : ''}`}>
      <div className="relative overflow-hidden">
        <img
          src={blog.image}
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
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{blog.readTime}</span>
          </div>
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
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">
            <div className="animate-glow-pulse w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blogs...</p>
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