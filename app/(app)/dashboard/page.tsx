import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { getAvgCJMM, getLevel } from "@/lib/scoring/levels";
import { CJMMDomain, CJMMScores } from "@/lib/types";

const domainLabels: Record<CJMMDomain, string> = {
  recognize: "Recognize Cues",
  analyze: "Analyze Cues",
  prioritize: "Prioritize Hypotheses",
  generate: "Generate Solutions",
  action: "Take Action",
  evaluate: "Evaluate Outcomes",
};

const baseScores: CJMMScores = {
  recognize: 0,
  analyze: 0,
  prioritize: 0,
  generate: 0,
  action: 0,
  evaluate: 0,
};
const FREE_LIMIT = 3;

const types = [
  ["bowtie", "Bow-Tie 🎯"],
  ["cloze", "Drop-Down Cloze 📝"],
  ["highlight", "Highlight 🔍"],
  ["dragdrop", "Drag & Drop 🔀"],
  ["matrix", "Matrix 📊"],
  ["trend", "Trend 📈"],
];

function scoreColor(score: number) {
  if (score < 40) return "var(--signal-danger)";
  if (score < 70) return "var(--signal-warn)";
  return "var(--signal-ok)";
}

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const uniqueDays = Array.from(
    new Set(dates.map((iso) => new Date(iso).toISOString().slice(0, 10)))
  ).sort((a, b) => (a > b ? -1 : 1));

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const day of uniqueDays) {
    const target = current.toISOString().slice(0, 10);
    if (day === target) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else if (streak === 0) {
      // Allow streak to start yesterday if no activity today.
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);
      if (day === yesterday.toISOString().slice(0, 10)) {
        streak = 1;
        current = yesterday;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_paid")
    .eq("id", user?.id ?? "")
    .single();

  const { data: attempts } = await supabase
    .from("question_attempts")
    .select("score,cjmm_domain,created_at")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const attemptList = attempts ?? [];
  const grouped: Record<CJMMDomain, number[]> = {
    recognize: [],
    analyze: [],
    prioritize: [],
    generate: [],
    action: [],
    evaluate: [],
  };

  for (const a of attemptList) {
    const domain = a.cjmm_domain as CJMMDomain;
    if (grouped[domain]) {
      grouped[domain].push(a.score);
    }
  }

  const cjmmScores: CJMMScores = { ...baseScores };
  (Object.keys(grouped) as CJMMDomain[]).forEach((domain) => {
    const vals = grouped[domain];
    cjmmScores[domain] = vals.length
      ? Math.round(vals.reduce((sum, s) => sum + s, 0) / vals.length)
      : 0;
  });

  const avg = getAvgCJMM(cjmmScores);
  const level = getLevel(avg);
  const streak = calcStreak(attemptList.map((a) => a.created_at));
  const isPaid = profile?.is_paid ?? false;
  const freeRemaining = Math.max(0, FREE_LIMIT - attemptList.length);
  const limitReached = !isPaid && freeRemaining === 0;

  return (
    <div className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
        <Card>
          <p className="kicker mb-4">YOUR CLINICAL REASONING PROFILE</p>
          {(Object.keys(domainLabels) as CJMMDomain[]).map((domain) => {
            const label = domainLabels[domain];
            const score = cjmmScores[domain];
            return (
            <div key={label} className="mb-3 grid grid-cols-[1fr_100px_40px] items-center gap-2">
              <span className="font-ui text-xs">{label}</span>
              <div className="h-1.5 rounded bg-stone-200">
                <div
                  className="h-full rounded"
                  style={{ width: `${score}%`, background: scoreColor(score) }}
                />
              </div>
              <span className="font-ui text-xs" style={{ color: scoreColor(score) }}>
                {score}%
              </span>
            </div>
          );
          })}
        </Card>
        <div className="grid gap-3">
          {[
            ["Questions Answered", String(attemptList.length)],
            ["Current Streak", String(streak)],
            ["Reasoning Level", level],
          ].map(([label, value]) => (
            <Card key={label}>
              <p className="font-ui text-xs">{label}</p>
              <p className="font-heading text-3xl font-black" style={{ color: "var(--gold)" }}>
                {value}
              </p>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {types.map(([slug, label]) => (
          <Link
            key={slug}
            href={limitReached ? "/upgrade" : `/session/${slug}`}
            aria-disabled={limitReached}
            className={limitReached ? "pointer-events-auto" : ""}
          >
            <Card
              className={`h-full transition ${
                limitReached
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-green-900 hover:bg-green-50"
              }`}
            >
              <p className="font-heading text-xl font-black">{label}</p>
              <p className="mt-2 text-sm text-stone-600">
                {limitReached
                  ? "Free limit reached. Upgrade required to continue."
                  : "Targeted NGN clinical reasoning practice"}
              </p>
            </Card>
          </Link>
        ))}
      </div>
      {!isPaid ? (
        <Card className="py-4">
          <p className="font-ui text-xs">FREE ACCESS</p>
          <p className="mt-1 text-sm text-stone-700">
            You have <span className="font-semibold">{freeRemaining}</span> free question
            {freeRemaining === 1 ? "" : "s"} remaining before upgrade is required.
          </p>
          {freeRemaining === 0 ? (
            <Link className="mt-2 inline-block text-sm font-semibold underline" href="/upgrade">
              Upgrade now to continue practice →
            </Link>
          ) : null}
        </Card>
      ) : (
        <Card className="py-4">
          <p className="font-ui text-xs">SUBSCRIPTION</p>
          <p className="mt-1 text-sm text-stone-700">
            Paid access active. Unlimited question attempts enabled.
          </p>
        </Card>
      )}
      <Link
        href={limitReached ? "/upgrade" : "/session/adaptive"}
        className={`rounded-sm border p-3 text-center font-semibold ${
          limitReached ? "opacity-60" : ""
        }`}
        style={{ borderColor: "var(--gold)" }}
      >
        ★ Start Adaptive Session — AI selects question types based on your gaps
      </Link>
    </div>
  );
}
