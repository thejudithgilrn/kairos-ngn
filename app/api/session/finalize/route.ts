import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAvgCJMM, getLevel } from "@/lib/scoring/levels";
import { generateStudyPlan } from "@/lib/ai/generateStudyPlan";

export async function POST(req: NextRequest) {
  const { sessionId, sessionType = "adaptive" } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const { data: attempts } = await supabase
    .from("question_attempts")
    .select("item_type,cjmm_domain,lasater_domain,score,question_json,created_at")
    .eq("user_id", user.id)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const list = attempts ?? [];
  if (!list.length) {
    return NextResponse.json({ error: "No attempts found for session" }, { status: 404 });
  }

  const cjmmTotals: Record<string, number[]> = {};
  const lasaterTotals: Record<string, number[]> = {};
  list.forEach((a) => {
    if (!cjmmTotals[a.cjmm_domain]) cjmmTotals[a.cjmm_domain] = [];
    if (!lasaterTotals[a.lasater_domain]) lasaterTotals[a.lasater_domain] = [];
    cjmmTotals[a.cjmm_domain].push(a.score);
    lasaterTotals[a.lasater_domain].push(a.score);
  });

  const avgMap = (obj: Record<string, number[]>) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, vals]) => [
        k,
        Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
      ])
    );
  const cjmmScores = avgMap(cjmmTotals);
  const lasaterScores = avgMap(lasaterTotals);

  const plan = await generateStudyPlan({
    userName: profile?.name ?? "Student",
    itemTypes: list.map((a) => a.item_type),
    cjmmScores,
    lasaterScores,
    questionSummaries: list.map((a) => a.question_json?.stem ?? "Clinical item"),
  });

  const avg = getAvgCJMM({
    recognize: cjmmScores.recognize ?? 0,
    analyze: cjmmScores.analyze ?? 0,
    prioritize: cjmmScores.prioritize ?? 0,
    generate: cjmmScores.generate ?? 0,
    action: cjmmScores.action ?? 0,
    evaluate: cjmmScores.evaluate ?? 0,
  });
  const overall = getLevel(avg);

  const { error } = await supabase.from("sessions").upsert({
    id: sessionId,
    user_id: user.id,
    session_type: sessionType,
    cjmm_scores: cjmmScores,
    lasater_scores: lasaterScores,
    overall_level: overall,
    study_plan: plan,
    completed_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    sessionId,
    overallLevel: overall,
    ...plan,
    cjmmScores,
    lasaterScores,
  });
}
