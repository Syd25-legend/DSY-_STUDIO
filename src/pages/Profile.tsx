import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import GamingHeader from "@/components/GamingHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Lock, Copy, Check, UploadCloud, Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";


interface ProfileData {
  username: string;
  avatar_url: string;
}

interface PurchasedGame {
  created_at: string;
  games: {
    id: string;
    title: string;
    image: string | null;
    genre: string | null;
  } | null;
}

const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [username, setUsername] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [purchasedGames, setPurchasedGames] = useState<PurchasedGame[]>([]);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      const { data: profileData, error: profileError, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single();

      if (profileError && status !== 406) throw profileError;
      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || '');
        setAvatarPreview(user.user_metadata.avatar_url);
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`created_at, games ( id, title, image, genre )`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      if (ordersData) {
        setPurchasedGames(ordersData as PurchasedGame[]);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({ title: "Error", description: "Could not fetch your profile data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        if (!user) navigate('/auth');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      fetchProfileData();
    }
  }, [user, navigate, fetchProfileData]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsUpdatingProfile(true);
    let newAvatarUrl = profile?.avatar_url;

    try {
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        newAvatarUrl = urlData.publicUrl;
      }
      await supabase.auth.updateUser({ data: { avatar_url: newAvatarUrl, username: username } });
      const { error: profileError } = await supabase.from('profiles').upsert({ id: user.id, username: username, avatar_url: newAvatarUrl });
      if (profileError) throw profileError;
      toast({ title: "Success!", description: "Your profile has been updated." });
      setAvatarFile(null);
      await refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Update Failed", description: (error as Error).message || "Could not update your profile.", variant: "destructive" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Success!", description: "Your password has been updated." });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      toast({ title: "Password Update Failed", description: (error as Error).message || "Could not update your password.", variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  if (loading) {
    return <BouncyLoader isLoading={loading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-4">Manage Your Profile</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Update your account details and preferences.</p>
        </div>

        <motion.div className="max-w-4xl mx-auto space-y-8" variants={cardContainerVariants} initial="hidden" animate="visible">
          <motion.div variants={cardItemVariants}>
            <Card className="gaming-card">
              <CardHeader><CardTitle>Profile Details</CardTitle><CardDescription>Update your public username and avatar.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="w-24 h-24 border-2 border-primary/40">
                    <AvatarImage src={avatarPreview || user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl">{username ? username.charAt(0).toUpperCase() : <User />}</AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <Button asChild variant="outline"><Label htmlFor="avatar-upload" className="cursor-pointer"><UploadCloud className="mr-2 h-4 w-4" />Change Avatar</Label></Button>
                    <Input id="avatar-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleAvatarChange} />
                  </div>
                </div>
                <div className="space-y-2"><Label htmlFor="username">Username</Label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" /></div></div>
                <div className="space-y-2"><Label htmlFor="email">Email Address</Label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="email" value={user?.email || ''} disabled className="pl-10" /></div></div>
                <div className="space-y-2"><Label>User ID</Label><div className="relative"><Input value={user?.id || ''} readOnly className="pr-10" /><Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={copyUserId}>{isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</Button></div></div>
                <Button variant="gaming" onClick={handleProfileUpdate} disabled={isUpdatingProfile}>{isUpdatingProfile ? "Saving..." : "Save Changes"}</Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardItemVariants}>
            <Card className="gaming-card">
              <CardHeader><CardTitle>Security</CardTitle><CardDescription>Change your password.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="pl-10" /></div></div>
                <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-10" /></div></div>
                <Button variant="gaming" onClick={handlePasswordUpdate} disabled={isUpdatingPassword}>{isUpdatingPassword ? "Updating..." : "Update Password"}</Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardItemVariants}>
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle>My Games Library</CardTitle>
                <CardDescription>All the games you've purchased from DSY Studio.</CardDescription>
              </CardHeader>
              <CardContent>
                {purchasedGames.length > 0 ? (
                  <div className="space-y-4">
                    {purchasedGames.map((purchase) => purchase.games && (
                      <div key={purchase.games.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={purchase.games.image || ''} alt={purchase.games.title} className="w-16 h-16 object-cover rounded-md"/>
                          <div>
                            <h3 className="font-semibold">{purchase.games.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{purchase.games.genre}</Badge>
                              <span>•</span>
                              <span>Purchased on {new Date(purchase.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Link to={`/games/${purchase.games.id}`}>
                          <Button variant="outline">View Game</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                    <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Your Library is Empty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You haven't purchased any games yet.</p>
                    <Button asChild variant="gaming" className="mt-4">
                      <Link to="/games">Explore Games</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Profile;