import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Game } from "./GameDetail";
import GamingHeader from "@/components/GamingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Landmark, IndianRupee } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        toast.error("Game ID is missing.");
        navigate("/games");
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setGame(data as Game);
      } catch (error) {
        console.error("Error fetching game for payment:", error);
        toast.error("Could not load game details. Please try again.");
        setGame(null);
        navigate("/games");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !game) {
      toast.error("You must be logged in to purchase a game.");
      return;
    }
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        game_id: game.id,
        status: 'completed',
        amount: parseFloat(game.price.replace(/[^0-9.-]+/g,"")),
        currency: 'INR',
        payment_method: paymentMethod,
      });
      if (error) throw error;
      toast.success("Thank You for purchasing our game!");
      navigate(`/games/${game.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("There was an issue with your purchase. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <BouncyLoader isLoading={loading} />;
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
      <div className="container mx-auto px-4 pt-32 pb-16 flex justify-center">
        <motion.div className="w-full max-w-2xl" variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-8">
            <Link to={`/games/${game.id}`}><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Cancel and Go Back</Button></Link>
          </div>
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text">Checkout</CardTitle>
              <CardDescription>You are purchasing "{game.title}"</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <img src={game.image!} alt={game.title} className="w-full h-64 object-cover rounded-lg" />
                  <div className="flex flex-col justify-center space-y-4">
                    <h2 className="text-2xl font-bold">{game.title}</h2>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    <div className="text-4xl font-bold text-accent">{game.price}</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Select Payment Method</h3>
                  <RadioGroup defaultValue="upi" value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 transition-colors hover:bg-primary/10 data-[state=checked]:border-primary"><RadioGroupItem value="upi" id="upi" /><IndianRupee className="h-5 w-5" /> UPI</Label></div>
                    <div><Label htmlFor="card" className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 transition-colors hover:bg-primary/10 data-[state=checked]:border-primary"><RadioGroupItem value="card" id="card" /><CreditCard className="h-5 w-5" /> Card</Label></div>
                    <div><Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 transition-colors hover:bg-primary/10 data-[state=checked]:border-primary"><RadioGroupItem value="netbanking" id="netbanking" /><Landmark className="h-5 w-5" /> Net Banking</Label></div>
                  </RadioGroup>
                  {paymentMethod === 'upi' && ( <div className="space-y-2"><Label htmlFor="upi_id">UPI ID</Label><Input id="upi_id" placeholder="yourname@bank" defaultValue="demopayment@upi" /></div> )}
                  {paymentMethod === 'card' && ( <div className="space-y-4"><div className="space-y-2"><Label htmlFor="card_number">Card Number</Label><Input id="card_number" placeholder="0000 0000 0000 0000" defaultValue="1234 5678 9101 1121"/></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="expiry">Expiry</Label><Input id="expiry" placeholder="MM/YY" defaultValue="12/28"/></div><div className="space-y-2"><Label htmlFor="cvc">CVC</Label><Input id="cvc" placeholder="123" defaultValue="321" /></div></div></div> )}
                  {paymentMethod === 'netbanking' && ( <div className="space-y-2"><Label htmlFor="bank">Select Bank</Label><select id="bank" className="w-full p-2 border rounded-md bg-transparent"><option>Demo Bank of India</option><option>Example National Bank</option></select></div> )}
                </div>
                <Button variant="hero" size="lg" className="w-full mt-8" type="submit" disabled={processing}>
                  {processing ? "Processing..." : `Pay Securely - ${game.price}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;