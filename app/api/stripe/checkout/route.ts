import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/client";

export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const monthly = process.env.STRIPE_PRICE_MONTHLY;
  const annual = process.env.STRIPE_PRICE_ANNUAL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl || !monthly || !annual) {
    return NextResponse.json(
      { error: "Stripe or app URL env vars missing" },
      { status: 500 }
    );
  }

  const priceId = plan === "annual" ? annual : monthly;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripeServer();
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId: user.id,
      plan,
    },
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/upgrade`,
  });

  return NextResponse.json({ url: checkout.url });
}
