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
    const { orderId, gameId, userId, paymentMethod } = await req.json();
    if (!orderId || !gameId || !userId) {
      throw new Error("Missing required fields: orderId, gameId, or userId.");
    }

    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureResponse.json();

    if (captureData.status !== 'COMPLETED') {
      throw new Error(`PayPal payment not completed. Status: ${captureData.status}`);
    }

    // --- GET FINAL AMOUNT SECURELY FROM PAYPAL'S RESPONSE ---
    const purchaseUnit = captureData.purchase_units[0];
    const capture = purchaseUnit.payments.captures[0];
    const finalAmount = capture.amount.value;
    const finalCurrency = capture.amount.currency_code;
    // ----------------------------------------------------

    const supabase = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SECURE_SERVICE_KEY') ?? ''
    );

    const { error: insertError } = await supabase.from('orders').insert({
      user_id: userId,
      game_id: gameId,
      status: 'completed',
      amount: finalAmount,
      currency: finalCurrency,
      payment_method: paymentMethod,
    });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error("Payment was successful but failed to save the order to the database.");
    }

    return new Response(JSON.stringify({ success: true, order: captureData }), {
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