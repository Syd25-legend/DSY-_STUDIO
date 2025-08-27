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
import { User, LogOut, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const GamingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    { label: "Blogs", path: "/blogs" },
    { label: "Insights", path: "/insights" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleSignup = () => {
    navigate('/auth', { state: { showSignUp: true } });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // --- NEW: Handler to navigate to the profile page ---
  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-2' : 'py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between">
          {/* Logo - Animates out on scroll */}
          <div className={`transition-all duration-500 ${
            scrolled ? 'opacity-0 -translate-x-50' : 'opacity-100 translate-x-0'
          }`}>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
               <img src="/dsylogo1.png" alt="DSY Studio Logo" className="w-11 h-8" />
              </div>
              <span className="text-xl font-bold gradient-text">DSY Studio</span>
            </Link>
          </div>

          {/* Central Navigation is now absolutely centered */}
          <nav className={`pill-nav px-6 py-3 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
            // Hide nav on small screens if the logo or auth section is visible to prevent overlap
            !scrolled ? 'hidden md:block' : 'block'
          }`}>
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-primary neon-text'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth Section - Animates out on scroll */}
          <div className={`transition-all duration-500 flex items-center justify-end min-w-[10rem] ${
            scrolled ? 'opacity-0 translate-x-50' : 'opacity-100 translate-x-0'
          }`}>
            {/* Loading state for user profile */}
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
                  {/* --- UPDATED: Added onClick handler to navigate to /profile --- */}
                  <DropdownMenuItem onClick={handleProfileNavigation} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {/* --- UPDATED: Also linked Settings to /profile for convenience --- */}
                  <DropdownMenuItem onClick={handleProfileNavigation} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="gaming" size="sm" onClick={handleSignup}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GamingHeader;