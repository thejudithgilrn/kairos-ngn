import { Card } from "@/components/ui/Card";

export default function ResultsPage() {
  return (
    <div className="grid gap-4">
      <h2 className="font-heading text-4xl font-black">Session Debrief</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><p className="font-ui text-xs">NCSBN CJMM</p></Card>
        <Card><p className="font-ui text-xs">LASATER RUBRIC</p></Card>
      </div>
      <Card>
        <p className="font-ui text-xs">GAP ANALYSIS</p>
        <p className="text-sm">Prioritized recommendation cards are scaffolded for API data binding.</p>
      </Card>
    </div>
  );
}
