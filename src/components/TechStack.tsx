// src/components/TechStack.tsx
import { motion } from "framer-motion";
import { Box, Palette, Code, Layers, Cpu, Workflow } from "lucide-react";

const technologies = [
  {
    name: "Unity",
    icon: Box,
    description: "Game Engine",
    color: "text-primary",
  },
  // {
  //   name: "Unreal Engine",
  //   icon: Cpu,
  //   description: "3D Development",
  //   color: "text-primary",
  // },
  {
    name: "Blender",
    icon: Layers,
    description: "3D Modeling",
    color: "text-primary",
  },
  // {
  //   name: "Substance",
  //   icon: Palette,
  //   description: "Texturing",
  //   color: "text-primary",
  // },
  {
    name: "Git",
    icon: Workflow,
    description: "Version Control",
    color: "text-primary",
  },
  {
    name: "C#",
    icon: Code,
    description: "Programming",
    color: "text-primary",
  },
];

const TechStack = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Our Tech Stack
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by industry-leading tools and technologies
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center justify-center p-6 gaming-card group cursor-pointer rounded-lg w-40"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.4 }}
              >
                <tech.icon
                  className={`w-12 h-12 md:w-16 md:h-16 ${tech.color} mb-3 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
                />
              </motion.div>
              <h3 className="font-semibold text-sm md:text-base mb-1">
                {tech.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
