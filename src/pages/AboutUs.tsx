import GamingHeader from "@/components/GamingHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

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
    transition: { staggerChildren: 0.15 },
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

const AboutUs = () => {
  const [showBouncyLoader, setShowBouncyLoader] = useState(true);

  useEffect(() => {
    const bouncyTimer = setTimeout(() => {
      setShowBouncyLoader(false);
    }, 800);
    return () => clearTimeout(bouncyTimer);
  }, []);

  const teamMembers = [
    {
      name: "Souhardyo Dey",
      role: "Game Developer & 3D Artist",
      avatar: "/souhardyo-dey.jpg",
      fallback: "SD",
      description: "Souhardyo has four years of 3D modeling and animation experience and is the creator of our virtual worlds. He animates ideas and painstakingly crafts all of the assets including the systems that shape the experience of the player. He is motivated by turning big ideas into real and interactive executions.",
      instagram: "https://www.instagram.com/_souhardyo/",
    },
    {
      name: "Baibhab Paul",
      role: "Game Designer & Storyteller",
      avatar: "/baibhab-paul.jpg",
      fallback: "BP",
      description: "Baibhab is a passionate gamer who knows everything there is to know about game design, bringing his unique vision to life. He has a gift for narrative and story design, as well as creating intricate core mechanics, all to make certain every second is entertaining. His understanding of player psychology helps produce unforgettable gaming experiences.",
      instagram: "https://www.instagram.com/baibhab_paul/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
  <title>About Us | DSY Studio</title>
  <meta name="description" content="Meet the team behind DSY Studio. Learn about our passion for creating immersive horror games and rich interactive storytelling." />
  <link rel="canonical" href="https://www.studiodsy.xyz/about" />
</Helmet>
      <BouncyLoader isLoading={showBouncyLoader} />
      <GamingHeader />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div className="text-center mb-16" variants={titleVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Who Are We!</h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            <span className="font-bold text-foreground">DSY Studio</span> is a company of creative souls who met through a combined love for video games and years of friendship. We feel that games are sometimes underappreciated as far an expressive storytelling medium and an art form aside from entertainement. Our objective is to manufacture playful, cerebral, and memorable gaming experiences that will engage, question, and put players in a position of feeling.
          </p>
        </motion.div>

        <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">Meet the Team</h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" variants={gridContainerVariants} initial="hidden" animate="visible">
                {teamMembers.map((member) => (
                    <motion.div key={member.name} variants={cardVariants}>
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
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;