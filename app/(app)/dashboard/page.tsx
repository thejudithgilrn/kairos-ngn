import Link from "next/link";
import { Card } from "@/components/ui/Card";

const cjmm = [
  ["Recognize Cues", 66],
  ["Analyze Cues", 48],
  ["Prioritize Hypotheses", 55],
  ["Generate Solutions", 52],
  ["Take Action", 59],
  ["Evaluate Outcomes", 45],
];

const types = [
  ["bowtie", "Bow-Tie 🎯"],
  ["cloze", "Drop-Down Cloze 📝"],
  ["highlight", "Highlight 🔍"],
  ["dragdrop", "Drag & Drop 🔀"],
  ["matrix", "Matrix 📊"],
  ["trend", "Trend 📈"],
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
        <Card>
          <p className="kicker mb-4">YOUR CLINICAL REASONING PROFILE</p>
          {cjmm.map(([label, score]) => (
            <div key={label} className="mb-3 grid grid-cols-[1fr_100px_40px] items-center gap-2">
              <span className="font-ui text-xs">{label}</span>
              <div className="h-1.5 rounded bg-stone-200">
                <div className="h-full rounded" style={{ width: `${score}%`, background: "var(--green)" }} />
              </div>
              <span className="font-ui text-xs">{score}%</span>
            </div>
          ))}
        </Card>
        <div className="grid gap-3">
          {["Questions Answered: 12", "Current Streak: 4", "Reasoning Level: Beginning"].map((text) => (
            <Card key={text}>
              <p className="font-ui text-xs">{text.split(":")[0]}</p>
              <p className="font-heading text-3xl font-black" style={{ color: "var(--gold)" }}>
                {text.split(":")[1]}
              </p>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {types.map(([slug, label]) => (
          <Link key={slug} href={`/session/${slug}`}>
            <Card className="h-full transition hover:border-green-900 hover:bg-green-50">
              <p className="font-heading text-xl font-black">{label}</p>
              <p className="mt-2 text-sm text-stone-600">Targeted NGN clinical reasoning practice</p>
            </Card>
          </Link>
        ))}
      </div>
      <Link href="/session/adaptive" className="rounded-sm border p-3 text-center font-semibold" style={{ borderColor: "var(--gold)" }}>
        ★ Start Adaptive Session — AI selects question types based on your gaps
      </Link>
    </div>
  );
}
