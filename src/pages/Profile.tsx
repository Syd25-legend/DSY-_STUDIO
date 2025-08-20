import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';


import GamingHeader from "@/components/GamingHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Lock, Copy, Check, UploadCloud } from "lucide-react";

// --- FIX: Initialize Supabase client directly to resolve path error ---
// In your actual project, this would likely be in a separate file like '@/integrations/supabase/client'
const supabaseUrl = 'https://vpxsoqeicsuybqtvkiyp.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHNvcWVpY3N1eWJxdHZraXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTgxODYsImV4cCI6MjA3MTA5NDE4Nn0.-4KgFdLj-X4i6oLP-xqxIEROJJbX_fRG-n3v0mYywUA'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProfileData {
  username: string;
  avatar_url: string;
}

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

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setAvatarPreview(user.user_metadata.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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
      fetchProfile();
    }
  }, [user, navigate, fetchProfile]);

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
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        newAvatarUrl = urlData.publicUrl;
      }

      const { data: updatedUser, error: userUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl, username: username }
      });

      if (userUpdateError) throw userUpdateError;

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        username: username,
        avatar_url: newAvatarUrl,
      });

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
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <Skeleton className="h-12 w-64 mx-auto mb-10" />
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1"><Skeleton className="h-64 w-full" /></div>
            <div className="md:col-span-2"><Skeleton className="h-96 w-full" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <GamingHeader />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-4">
            Manage Your Profile
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Update your account details and preferences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your public username and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary/40">
                  <AvatarImage src={avatarPreview || user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl">
                    {username ? username.charAt(0).toUpperCase() : <User />}
                  </AvatarFallback>
                </Avatar>
                <div className="relative">
                  <Button asChild variant="outline">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Label>
                  </Button>
                  <Input id="avatar-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" value={user?.email || ''} disabled className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>User ID</Label>
                <div className="relative">
                  <Input value={user?.id || ''} readOnly className="pr-10" />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={copyUserId}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button variant="gaming" onClick={handleProfileUpdate} disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-10" />
                </div>
              </div>
              <Button variant="gaming" onClick={handlePasswordUpdate} disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
