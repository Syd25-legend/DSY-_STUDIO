// src/components/BouncyLoader.tsx

import { Bouncy } from 'ldrs/react';
import 'ldrs/react/Bouncy.css';

interface BouncyLoaderProps {
  isLoading: boolean;
}

const BouncyLoader = ({ isLoading }: BouncyLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <Bouncy size="45" speed="1.75" color="white" />
    </div>
  );
};

export default BouncyLoader;