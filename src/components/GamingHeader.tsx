import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Crown } from "lucide-react";

const GamingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // CHANGES FOR AUTH AND DATABASE HERE
  const location = useLocation();

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

  // CHANGES FOR AUTH AND DATABASE HERE - Replace with actual auth logic
  const handleLogin = () => {
    console.log("Login functionality - integrate with Supabase");
  };

  const handleSignup = () => {
    console.log("Signup functionality - integrate with Supabase");
  };

  const handleLogout = () => {
    console.log("Logout functionality - integrate with Supabase");
    setIsAuthenticated(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-2' : 'py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Animates out on scroll */}
          <div className={`transition-all duration-500 ${
            scrolled ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
          }`}>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">DSY Studio</span>
            </Link>
          </div>

          {/* Central Navigation - Always visible */}
          <nav className="pill-nav px-6 py-3 rounded-full">
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
          <div className={`transition-all duration-500 ${
            scrolled ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
          }`}>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <AvatarImage src="/api/placeholder/32/32" alt="User" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-md border border-primary/20">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
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