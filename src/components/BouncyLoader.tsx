// src/components/BouncyLoader.tsx
import { HashLoader } from 'react-spinners';

interface BouncyLoaderProps {
  isLoading: boolean;
}

const BouncyLoader = ({ isLoading }: BouncyLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <HashLoader
        color="#ffffff" 
        loading={isLoading}
        cssOverride={{}}
        size={40}
        speedMultiplier={1}
      />
    </div>
  );
};

export default BouncyLoader;