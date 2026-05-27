import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function UpgradePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="font-heading mb-6 text-center text-4xl font-black">Upgrade to Continue</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-ui text-xs">MONTHLY</p>
          <p className="font-heading text-4xl font-black">$19</p>
          <p className="text-sm">Cancel anytime</p>
          <Button className="mt-4 w-full">Choose Monthly</Button>
        </Card>
        <Card className="bg-stone-900 text-white">
          <p className="font-ui text-xs">ANNUAL · BEST VALUE</p>
          <p className="font-heading text-4xl font-black">$147</p>
          <p className="text-sm">Save $81</p>
          <Button className="mt-4 w-full">Choose Annual</Button>
        </Card>
      </div>
    </div>
  );
}
