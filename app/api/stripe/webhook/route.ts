import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  const stripe = getStripeServer();
  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({
          is_paid: true,
          stripe_customer_id:
            typeof session.customer === "string" ? session.customer : null,
          stripe_subscription_id:
            typeof session.subscription === "string" ? session.subscription : null,
        })
        .eq("id", userId);
    }

    if (process.env.RESEND_API_KEY && session.customer_details?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Kairos NGN <onboarding@resend.dev>",
        to: session.customer_details.email,
        subject: "Welcome to Kairos NGN",
        text: "Your subscription is active. You now have unlimited clinical reasoning sessions.",
      });
    }
  }

  return NextResponse.json({ received: true });
}
