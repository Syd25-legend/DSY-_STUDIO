// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Extracts pathname property from useLocation hook
  const { pathname } = useLocation();

  // This effect runs whenever the pathname changes
  useEffect(() => {
    // Scrolls the window to the top left corner of the document
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component does not render anything to the DOM
  return null;
};

export default ScrollToTop;