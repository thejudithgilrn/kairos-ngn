import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();
  const { data: sessions } = await admin
    .from("sessions")
    .select("id,user_id,cjmm_scores,completed_at");
  const { data: profiles } = await admin.from("profiles").select("id,name,program,nclex_date");
  const { data: attempts } = await admin.from("question_attempts").select("id,cjmm_domain,score");

  const totalSessions = sessions?.length ?? 0;
  const uniqueStudents = new Set((sessions ?? []).map((s) => s.user_id)).size;
  const questionsAnswered = attempts?.length ?? 0;

  const domainBuckets: Record<string, number[]> = {};
  (attempts ?? []).forEach((a) => {
    if (!domainBuckets[a.cjmm_domain]) domainBuckets[a.cjmm_domain] = [];
    domainBuckets[a.cjmm_domain].push(a.score);
  });
  const cohortDomainScores = Object.fromEntries(
    Object.entries(domainBuckets).map(([domain, vals]) => [
      domain,
      Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    ])
  );

  const sortedGaps = Object.entries(cohortDomainScores).sort(([, a], [, b]) => a - b);
  const topGapDomain = sortedGaps[0]?.[0] ?? "n/a";

  const studentRows = (profiles ?? []).map((p) => {
    const studentSessions = (sessions ?? []).filter((s) => s.user_id === p.id);
    const scores = studentSessions.flatMap((s) =>
      Object.values((s.cjmm_scores ?? {}) as Record<string, number>)
    );
    const avg = scores.length
      ? Math.round(scores.reduce((sum, val) => sum + val, 0) / scores.length)
      : 0;

    return {
      name: p.name,
      program: p.program,
      nclexDate: p.nclex_date,
      sessions: studentSessions.length,
      cjmmAvg: avg,
      lastActive: studentSessions[0]?.completed_at ?? null,
    };
  });

  return NextResponse.json({
    stats: {
      totalSessions,
      uniqueStudents,
      questionsAnswered,
      topGapDomain,
    },
    cohortDomainScores,
    students: studentRows,
  });
}
