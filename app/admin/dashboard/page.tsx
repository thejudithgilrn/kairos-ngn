import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  if (!process.env.ADMIN_PASSWORD || searchParams.key !== process.env.ADMIN_PASSWORD) {
    redirect("/admin");
  }

  const admin = createAdminClient();
  const { data: sessions } = await admin.from("sessions").select("id,user_id,cjmm_scores");
  const { data: attempts } = await admin
    .from("question_attempts")
    .select("id,cjmm_domain,score");
  const totalSessions = sessions?.length ?? 0;
  const uniqueStudents = new Set((sessions ?? []).map((s) => s.user_id)).size;
  const questionsAnswered = attempts?.length ?? 0;
  const domainScoreMap: Record<string, number[]> = {};
  (attempts ?? []).forEach((a) => {
    if (!domainScoreMap[a.cjmm_domain]) domainScoreMap[a.cjmm_domain] = [];
    domainScoreMap[a.cjmm_domain].push(a.score);
  });
  const topGapDomain =
    Object.entries(domainScoreMap)
      .map(([k, vals]) => [k, vals.reduce((s, v) => s + v, 0) / vals.length] as const)
      .sort((a, b) => a[1] - b[1])[0]?.[0] ?? "n/a";

  return (
    <div className="grid gap-4">
      <h1 className="font-heading text-4xl font-black">Cohort Analytics</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <p className="font-ui text-xs">Total Sessions</p>
          <p className="font-heading text-2xl font-black">{totalSessions}</p>
        </Card>
        <Card>
          <p className="font-ui text-xs">Unique Students</p>
          <p className="font-heading text-2xl font-black">{uniqueStudents}</p>
        </Card>
        <Card>
          <p className="font-ui text-xs">Questions Answered</p>
          <p className="font-heading text-2xl font-black">{questionsAnswered}</p>
        </Card>
        <Card>
          <p className="font-ui text-xs">Top Gap Domain</p>
          <p className="font-heading text-2xl font-black">{topGapDomain}</p>
        </Card>
      </div>
      <Card>
        <p className="font-ui text-xs">COHORT DOMAIN SNAPSHOT</p>
        {Object.entries(domainScoreMap).map(([domain, vals]) => (
          <p key={domain} className="mt-1 text-sm">
            {domain}: {Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)}%
          </p>
        ))}
      </Card>
    </div>
  );
}
