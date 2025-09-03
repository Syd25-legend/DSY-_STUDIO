import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const RouteChangeTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Initialize GA4
  useEffect(() => {
    // Replace with your Measurement ID
    // You can also move this to App.tsx
    ReactGA.initialize("G-D03S1PLQKY");
    setInitialized(true);
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [initialized, location]);

  return null; // This component does not render anything
};

export default RouteChangeTracker;