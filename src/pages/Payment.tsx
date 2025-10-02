import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Game } from "./GameDetail"; 
import GamingHeader from "@/components/GamingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Lock } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { User } from "@supabase/supabase-js";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface PayPalButtonWrapperProps {
  game: Game | null;
  user: User | null;
  createOrder: () => Promise<string>;
  onApprove: (data: OnApproveData, actions: OnApproveActions) => Promise<void>;
}

const PayPalButtonWrapper = ({ game, createOrder, onApprove }: PayPalButtonWrapperProps) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {isPending && <div className="text-center p-4">Loading Payment Gateway...</div>}
      <div style={{ opacity: isPending ? 0.5 : 1, pointerEvents: isPending ? 'none' : 'auto' }}>
        <PayPalButtons
          style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error("PayPal Button Error:", err);
            toast.error("An error occurred with the PayPal payment.");
          }}
          disabled={isPending || !game}
        />
      </div>
    </>
  );
};

const Payment = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => { 
        if (!gameId) {
          toast.error("Game ID is missing.");
          navigate("/games");
          return;
        }
        setLoading(true);
        try {
          const { data, error } = await supabase.from('games').select('*').eq('id', gameId).single();
          if (error) throw error;
          setGame(data as Game);
        } catch (error) {
          console.error("Error fetching game for payment:", error);
          toast.error("Could not load game details. Please try again.");
          navigate("/games");
        } finally {
          setLoading(false);
        }
    };
    fetchGame();
  }, [gameId, navigate]);

  const createOrder = async (): Promise<string> => { 
    try {
        if (!game) throw new Error("Game details not loaded.");
        const { data, error } = await supabase.functions.invoke('create-paypal-order', {
          body: { gameId: game.id },
        });
        if (error) throw new Error(error.message);
        if (!data.id) throw new Error("PayPal order ID was not returned.");
        return data.id;
      } catch (error) {
        console.error("Error creating PayPal order:", error);
        toast.error("Could not initiate PayPal payment. Please try again.");
        return "";
      }
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => { 
    toast.info("Payment approved. Finalizing your purchase, please wait...");
    try {
      if (!game || !user) throw new Error("Game or user information is missing.");
      const { data: captureData, error: captureError } = await supabase.functions.invoke('capture-paypal-order', {
        body: {
          orderId: data.orderID,
          gameId: game.id,
          userId: user.id,
          paymentMethod: 'paypal'
        },
      });
      if (captureError) throw new Error(captureError.message);
      toast.success("Thank You for purchasing our game!");
      navigate(`/games/${game.id}`);
    } catch (error) {
      console.error("Failed to capture payment:", error);
      toast.error("There was a problem finalizing your purchase. Please contact support.");
    }
  };

  if (loading) {
    return <BouncyLoader isLoading={true} />;
  }

  if (!game) { 
    return (
      <div className="min-h-screen bg-gradient-hero">
        <GamingHeader />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <Link to="/games"><Button variant="gaming"><ArrowLeft className="mr-2 h-4 w-4" />Back to Games</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Checkout for {game.title} - DSY Studio</title>
        <meta name="description" content={`Complete your purchase for ${game.title}. Secure payment options available.`} />
      </Helmet>
      <GamingHeader />
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-2">Secure Checkout</h1>
            <p className="text-lg text-muted-foreground">You're just a step away from owning {game.title}!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b border-primary/20 pb-3">Order Summary</h2>
              <Card className="gaming-card-solid flex gap-6 p-6">
                <img src={game.image!} alt={game.title} className="w-24 h-32 object-cover rounded-md" />
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">PC Digital Download</p>
                  <div className="mt-auto text-2xl font-bold text-accent">{game.price}</div>
                </div>
              </Card>
              <div className="border-t border-primary/20 pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{game.price}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span>{game.price}</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b border-primary/20 pb-3">Payment Method</h2>
              <Card className="gaming-card-solid">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-6">
                    You will be redirected to PayPal's secure gateway to complete your payment. The final charge will be in USD.
                  </p>
                  <PayPalButtonWrapper 
                    game={game}
                    user={user}
                    createOrder={createOrder}
                    onApprove={onApprove}
                  />
                  <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3 mr-2" />
                    <span>Secure payments powered by PayPal</span>
                  </div>
                </CardContent>
              </Card>
              <Link to={`/games/${game.id}`} className="w-full">
                <Button variant="ghost" size="sm" className="w-full"><ArrowLeft className="mr-2 h-4 w-4" />Cancel and Go Back</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;