import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, Variants } from "framer-motion"; // --- FIX: Imported Variants type ---

const Auth = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state?.showSignUp || false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  });

  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Please check your email to confirm your account",
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // --- FIX: Added the Variants type to the constant ---
  const flipVariants: Variants = {
    initial: {
      rotateY: -90,
      opacity: 0
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-hero fixed top-0 left-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <img src="/dsy-logo.png" alt="DSY Studio Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">DSY Studio</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Immersive Gaming Experiences
            </p>
          </div>
          <div className="space-y-6">
            <motion.div whileHover={{ y: -2, boxShadow: "0 0 15px hsl(210 15% 70% / 0.3)" }} transition={{ duration: 0.3 }}>
              <Card className="gaming-card p-6 text-left">
                <h3 className="text-lg font-semibold text-primary mb-2">Antim Sawari</h3>
                <p className="text-sm text-muted-foreground">
                  Our latest psychological horror masterpiece that will keep you on the edge of your seat.
                </p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -2, boxShadow: "0 0 15px hsl(210 15% 70% / 0.3)" }} transition={{ duration: 0.3 }}>
              <Card className="gaming-card p-6 text-left">
                <h3 className="text-lg font-semibold text-secondary mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Join our community of players and share your gaming experiences.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 min-h-screen" style={{ perspective: '1200px' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <img src="/dsy-logo.png" alt="DSY Studio Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">DSY Studio</h1>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'login'}
              variants={flipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="gaming-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </CardTitle>
                  <CardDescription>
                    {isSignUp
                      ? "Join the DSY Studio community"
                      : "Sign in to your account"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-center text-sm text-muted-foreground pt-2">
                    {isSignUp
                      ? "Join our community of creators and players."
                      : "Welcome back to the DSY Studio community."}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            className="pl-10 border-primary/20 focus:border-primary/40"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 border-primary/20 focus:border-primary/40"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 border-primary/20 focus:border-primary/40"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10 border-primary/20 focus:border-primary/40"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    )}
                    <Button type="submit" variant="gaming" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                    </Button>
                  </form>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-primary hover:text-primary-glow transition-colors"
                    >
                      {isSignUp
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"
                      }
                    </button>
                  </div>
                  <div className="text-center">
                    <Link
                      to="/"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back to Home
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
