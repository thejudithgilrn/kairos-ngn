import { Card } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-4">
      <h1 className="font-heading text-4xl font-black">Cohort Analytics</h1>
      <div className="grid gap-3 md:grid-cols-4">
        {["Total Sessions", "Unique Students", "Questions Answered", "Top Gap Domain"].map((k) => (
          <Card key={k}>
            <p className="font-ui text-xs">{k}</p>
            <p className="font-heading text-2xl font-black">--</p>
          </Card>
        ))}
      </div>
      <Card>
        <p className="font-ui text-xs">COHORT CHART + CSV EXPORT scaffolded</p>
      </Card>
    </div>
  );
}
