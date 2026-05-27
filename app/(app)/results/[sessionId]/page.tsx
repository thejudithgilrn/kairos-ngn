import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

export default async function ResultsPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: session } = await supabase
    .from("sessions")
    .select("cjmm_scores,lasater_scores,study_plan,overall_level,completed_at")
    .eq("id", params.sessionId)
    .eq("user_id", user?.id ?? "")
    .single();

  const plan = (session?.study_plan as
    | {
        summary?: string;
        gaps?: { domain: string; priority: string; description: string }[];
        studyPlan?: {
          rank: number;
          topic: string;
          detail: string;
          resource: string;
          clinicalApplication: string;
        }[];
      }
    | undefined) ?? { summary: "", gaps: [], studyPlan: [] };
  const cjmmScores = (session?.cjmm_scores as Record<string, number> | undefined) ?? {};
  const lasaterScores = (session?.lasater_scores as Record<string, number> | undefined) ?? {};

  return (
    <div className="grid gap-4">
      <h2 className="font-heading text-4xl font-black">Session Debrief</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-ui text-xs">NCSBN CJMM</p>
          {Object.entries(cjmmScores).map(([k, v]) => (
            <p className="mt-1 text-sm" key={k}>
              {k}: {v}%
            </p>
          ))}
        </Card>
        <Card>
          <p className="font-ui text-xs">LASATER RUBRIC</p>
          {Object.entries(lasaterScores).map(([k, v]) => (
            <p className="mt-1 text-sm" key={k}>
              {k}: {v}%
            </p>
          ))}
        </Card>
      </div>
      <Card>
        <p className="font-ui text-xs">PERFORMANCE SUMMARY</p>
        <p className="text-sm">{plan.summary || "No summary available yet."}</p>
      </Card>
      <Card>
        <p className="font-ui text-xs">GAP ANALYSIS</p>
        {(plan.gaps ?? []).map((gap) => (
          <p className="mt-1 text-sm" key={`${gap.domain}-${gap.priority}`}>
            {gap.priority.toUpperCase()} · {gap.domain}: {gap.description}
          </p>
        ))}
      </Card>
      <Card>
        <p className="font-ui text-xs">PERSONALIZED STUDY PLAN</p>
        {(plan.studyPlan ?? []).map((item) => (
          <div className="mt-2 text-sm" key={`${item.rank}-${item.topic}`}>
            {item.rank}. {item.topic} — {item.detail}
          </div>
        ))}
      </Card>
      <Card>
        <p className="font-ui text-xs">SESSION STATUS</p>
        <p className="mt-1 text-sm">Level: {session?.overall_level ?? "n/a"}</p>
        <p className="mt-1 text-sm">
          Completed:{" "}
          {session?.completed_at
            ? new Date(session.completed_at).toLocaleString()
            : "n/a"}
        </p>
      </Card>
      <div className="flex gap-3">
        <Link className="rounded border px-3 py-2 text-sm" href="/dashboard">
          Continue Practice
        </Link>
        <a
          className="rounded border px-3 py-2 text-sm"
          href={`/api/study-plan/pdf?sessionId=${params.sessionId}`}
        >
          Download Study Plan
        </a>
      </div>
    </div>
  );
}
