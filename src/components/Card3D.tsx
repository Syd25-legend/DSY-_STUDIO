// src/components/Card3D.tsx
import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // How much the card tilts (0-1)
}

const Card3D = ({ children, className = "", intensity = 0.5 }: Card3DProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxRotation = 15 * intensity;
    const newRotateY = (mouseX / (rect.width / 2)) * maxRotation;
    const newRotateX = -(mouseY / (rect.height / 2)) * maxRotation;

    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        className={`card-3d preserve-3d ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="card-3d-content">{children}</div>
      </motion.div>
    </div>
  );
};

export default Card3D;
