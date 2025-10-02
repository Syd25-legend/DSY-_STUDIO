import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function getPayPalAccessToken() {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("PayPal Auth Error:", errorBody);
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SECURE_SERVICE_KEY') ?? ''
    );

    const { gameId } = await req.json();
    if (!gameId) throw new Error("Game ID is required.");

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('price')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      throw new Error("Game not found or could not be fetched.");
    }

    // --- CURRENCY CONVERSION LOGIC ---
    const inrPriceString = game.price.replace(/[^0-9.]/g, '');
    const inrAmount = parseFloat(inrPriceString);
    const conversionRate = parseFloat(Deno.env.get("INR_TO_USD_RATE") || '83.5');
    const usdAmount = (inrAmount / conversionRate).toFixed(2);
    // ---------------------------------

    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: usdAmount,
          },
        }],
      }),
    });

    if (!orderResponse.ok) {
      const errorDetails = await orderResponse.text();
      throw new Error(`Failed to create PayPal order: ${errorDetails}`);
    }

    const orderData = await orderResponse.json();

    return new Response(JSON.stringify({ id: orderData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});