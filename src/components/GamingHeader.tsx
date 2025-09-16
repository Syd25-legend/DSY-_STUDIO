import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Loader2, Menu, X, ChevronRight, BookOpen, MessageCircle, Info, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../integrations/supabase/client";

// Define types for fetched data
type BlogTitle = { id: string; title: string; };
type InsightTitle = { id: string; title: string; };

// --- Sidebar Component ---
const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
  const navigate = useNavigate();
  // State to manage ONE active accordion instead of multiple booleans
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const [blogTitles, setBlogTitles] = useState<BlogTitle[]>([]);
  const [insightTitles, setInsightTitles] = useState<InsightTitle[]>([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      const { data: blogsData, error: blogsError } = await supabase.from('blogs').select('id, title').order('published_at', { ascending: false });
      if (blogsError) console.error("Error fetching blogs for sidebar:", blogsError);
      else setBlogTitles(blogsData || []);

      const { data: insightsData, error: insightsError } = await supabase.from('insights').select('id, title').order('created_at', { ascending: false });
      if (insightsError) console.error("Error fetching insights for sidebar:", insightsError);
      else setInsightTitles(insightsData || []);
    };
    fetchSidebarData();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const NavLink = ({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: React.ElementType }) => (
    <Link to={to} onClick={() => handleNavigate(to)} className="flex items-center space-x-4 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors duration-200">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  const AccordionLink = ({ name, title, children, icon: Icon }: { name: string; title: string; children: React.ReactNode; icon: React.ElementType }) => {
    // Check if this accordion is the active one
    const isOpen = activeAccordion === name;

    const toggleAccordion = () => {
      // If it's already open, close it. Otherwise, open it.
      setActiveAccordion(isOpen ? null : name);
    };

    return (
      <div>
        <div onClick={toggleAccordion} className="flex items-center justify-between space-x-4 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{title}</span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
        {/* AnimatePresence handles the exit animation (contraction) */}
        <AnimatePresence initial={false}>
          {isOpen && (
            // This motion.div handles the expand and contract animation
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden pl-8"
            >
              <div className="border-l-2 border-primary/20 py-2 space-y-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }} // Corrected exit animation for smooth slide-out
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full max-w-xs bg-card border-r border-primary/20 z-50 flex flex-col p-4"
          >
            <div className="flex items-center justify-between pb-4 border-b border-primary/10">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                {/* Using your studio name from saved info */}
                <img src="/dsylogo1.png" alt="DSY Studio Logo" className="w-11 h-8" />
                <span className="text-xl font-bold gradient-text">DSY Studio</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-grow pt-4 overflow-y-auto space-y-2">
              <AccordionLink name="blogs" title="Blogs" icon={BookOpen}>
                <Link to="/blogs" onClick={() => handleNavigate('/blogs')} className="block pl-4 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10">All Blogs</Link>
                {blogTitles.map(blog => (
                  <Link key={blog.id} to={`/blogs/${blog.id}`} onClick={() => handleNavigate(`/blogs/${blog.id}`)} className="block pl-4 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 truncate">{blog.title}</Link>
                ))}
              </AccordionLink>
              <AccordionLink name="insights" title="Insights" icon={MessageCircle}>
                <Link to="/insights" onClick={() => handleNavigate('/insights')} className="block pl-4 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10">All Insights</Link>
                {insightTitles.map(insight => (
                  <Link key={insight.id} to={`/insights/${insight.id}`} onClick={() => handleNavigate(`/insights/${insight.id}`)} className="block pl-4 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 truncate">{insight.title}</Link>
                ))}
              </AccordionLink>
              <NavLink to="/about" icon={Info}>About Us</NavLink>
              <NavLink to="/contact" icon={Mail}>Contact Us</NavLink>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};


// --- Main Header Component ---
const GamingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Games", path: "/games" },
  ];

  const isActivePath = (path: string) => location.pathname === path;
  const handleLogin = () => navigate('/auth');
  const handleSignup = () => navigate('/auth', { state: { showSignUp: true } });
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  const handleProfileNavigation = () => navigate('/profile');

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${scrolled ? 'py-2' : 'py-6'}`}>
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between">
            {/* UPDATED: Changed -translate-x-full to -translate-y-full */}
            <div className={`transition-all duration-500 z-10 ${scrolled ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-8 h-8 text-foreground" />
              </Button>
            </div>
            <nav className={`pill-nav px-6 py-3 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${!scrolled ? 'hidden md:block' : 'block'}`}>
              <div className="flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className={`text-sm font-medium transition-colors ${isActivePath(item.path) ? 'text-primary neon-text' : 'text-muted-foreground hover:text-foreground'}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
            {/* UPDATED: Changed translate-x-full to -translate-y-full */}
            <div className={`transition-all duration-500 flex items-center justify-end min-w-[10rem] ${scrolled ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
              {loading ? (
                <div className="flex items-center justify-center w-10 h-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.username} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.user_metadata?.username ? user.user_metadata.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-md border border-primary/20">
                    <DropdownMenuItem onClick={handleProfileNavigation} className="cursor-pointer"><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleProfileNavigation} className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={handleLogin}>Login</Button>
                  <Button variant="gaming" size="sm" onClick={handleSignup}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default GamingHeader;