import GamingHeader from "@/components/GamingHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Souhardyo Dey",
      role: "Game Developer & 3D Artist",
      avatar: "/api/placeholder/128/128",
      fallback: "SD",
      description: "With four years of 3D modeling and animation experience, Souhardyo is the architect of our virtual worlds. He breathes life into concepts, meticulously crafting every asset and coding the mechanics that define the player's journey. His passion lies in transforming ambitious ideas into tangible, interactive realities.",
      instagram: "https://www.instagram.com/syd_25/",
    },
    {
      name: "Baibhab Paul",
      role: "Game Designer & Storyteller",
      avatar: "/api/placeholder/128/128",
      fallback: "BP",
      description: "As an avid gamer with an encyclopedic knowledge of game design, Baibhab is the visionary behind our experiences. He is a master storyteller, weaving intricate narratives and designing core mechanics that ensure every moment is engaging. His insight into player psychology is key to creating truly memorable games.",
      instagram: "https://www.instagram.com/baibhab_paul/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>About Us - DSY Studio</title>
        <meta name="description" content="Meet the team behind DSY Studio. Learn about our passion for creating immersive horror games and rich interactive storytelling." />
      </Helmet>
      {/* --- FIX 3: Added style block to prevent horizontal scrollbar --- */}
      <style>{`
        html, body { overflow-x: hidden; }
        @keyframes zoom-in-settle { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-zoom-in-settle { animation: zoom-in-settle 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>
      <GamingHeader />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-16 animate-zoom-in-settle">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are DSY Studio, a creative duo united by a lifelong friendship and an unyielding passion for video games. We believe games are more than just entertainment—they are powerful mediums for storytelling and art. Our mission is to build immersive worlds that challenge players, evoke emotion, and leave a lasting impression.
          </p>
        </div>

        <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {teamMembers.map((member, index) => (
                    <div key={member.name} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.15}s` }}>
                        <Card className="gaming-card text-center h-full flex flex-col">
                            <CardHeader className="items-center">
                                <Avatar className="w-24 h-24 mb-4 border-4 border-primary/30"><AvatarImage src={member.avatar} alt={member.name} /><AvatarFallback className="text-3xl bg-gradient-primary text-primary-foreground">{member.fallback}</AvatarFallback></Avatar>
                                <CardTitle className="text-2xl">{member.name}</CardTitle>
                                <p className="text-primary font-medium">{member.role}</p>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <p className="text-muted-foreground mb-6">{member.description}</p>
                                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center space-x-2 text-muted-foreground hover:text-[#C13584] transition-colors mt-auto"><Instagram className="w-5 h-5" /><span>Follow on Instagram</span></a>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;