"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function UpgradePlans() {
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | null>(null);
  const [error, setError] = useState("");

  async function startCheckout(plan: "monthly" | "annual") {
    setLoadingPlan(plan);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="font-heading mb-6 text-center text-4xl font-black">
        Upgrade to Continue
      </h2>
      {error ? <p className="mb-4 text-center text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-ui text-xs">MONTHLY</p>
          <p className="font-heading text-4xl font-black">$19</p>
          <p className="text-sm">Cancel anytime</p>
          <Button
            className="mt-4 w-full"
            onClick={() => startCheckout("monthly")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "monthly" ? "Redirecting..." : "Choose Monthly"}
          </Button>
        </Card>
        <Card className="bg-stone-900 text-white">
          <p className="font-ui text-xs">ANNUAL · BEST VALUE</p>
          <p className="font-heading text-4xl font-black">$147</p>
          <p className="text-sm">Save $81</p>
          <Button
            className="mt-4 w-full"
            onClick={() => startCheckout("annual")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "annual" ? "Redirecting..." : "Choose Annual"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
