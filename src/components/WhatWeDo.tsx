// src/components/WhatWeDo.tsx
import { motion } from "framer-motion";
import { Gamepad2, BookOpen, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Gamepad2,
    title: "Game Development",
    description:
      "Creating immersive gaming experiences with cutting-edge technology and innovative gameplay mechanics.",
    color: "text-accent",
  },
  {
    icon: BookOpen,
    title: "Story Crafting",
    description:
      "Weaving compelling narratives that captivate players and create unforgettable emotional journeys.",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "World Building",
    description:
      "Designing rich, detailed universes with deep lore and intricate ecosystems that feel alive.",
    color: "text-accent",
  },
];

const WhatWeDo = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            What We Do
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're a passionate indie studio dedicated to creating games that
            push boundaries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flip-card h-80"
            >
              <div className="flip-card-inner">
                {/* Front */}
                <div className="flip-card-front">
                  <Card className="gaming-card h-full flex flex-col items-center justify-center text-center p-6">
                    <feature.icon
                      className={`w-20 h-20 ${feature.color} mb-6`}
                    />
                    <CardTitle className="text-2xl mb-3">
                      {feature.title}
                    </CardTitle>
                  </Card>
                </div>
                {/* Back */}
                <div className="flip-card-back">
                  <Card className="glass-card h-full flex flex-col justify-center p-6">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
