// src/components/BouncyLoader.tsx
import LoaderAnimation from './loaderanimation';

interface BouncyLoaderProps {
  isLoading: boolean;
}

const BouncyLoader = ({ isLoading }: BouncyLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      {/* 
        To change the size of the loader:
        Pass a 'size' prop to LoaderAnimation, e.g., <LoaderAnimation size={80} /> or <LoaderAnimation size="100px" />
        Default size is 50px (small).
      */}
      <LoaderAnimation size={80} />
    </div>
  );
};

export default BouncyLoader;
