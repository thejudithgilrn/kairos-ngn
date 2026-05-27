import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreSchema } from "@/lib/ai/questionSchemas";

function localScore(question: unknown, answer: unknown) {
  const expected = (question as { correct?: unknown })?.correct;
  const correct = JSON.stringify(answer) === JSON.stringify(expected);
  let partial = false;

  if (
    !correct &&
    expected &&
    typeof expected === "object" &&
    answer &&
    typeof answer === "object"
  ) {
    const expectedEntries = Object.entries(expected);
    const matched = expectedEntries.filter(
      ([k, v]) =>
        JSON.stringify((answer as Record<string, unknown>)[k]) === JSON.stringify(v)
    ).length;
    partial = matched > 0 && matched < expectedEntries.length;
  }

  return {
    correct,
    partial,
    score: correct ? 100 : partial ? 60 : 30,
    feedback: correct
      ? "Correct prioritization. You recognized the unstable respiratory trend and selected the intervention with strongest physiologic benefit."
      : "Focus on prioritizing oxygenation/perfusion cues first. In this CJMM step, immediate instability should drive action selection.",
    cjmmImpact: correct ? 6 : partial ? 2 : -4,
    lasaterImpact: correct ? 5 : partial ? 1 : -3,
  };
}

export async function POST(req: NextRequest) {
  const { question, answer, itemType, sessionId } = await req.json();
  let grading = localScore(question, answer);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const prompt = `Score this NGN ${itemType} answer.
Question: ${JSON.stringify(question)}
Student answer: ${JSON.stringify(answer)}
Correct answer: ${JSON.stringify((question as { correct?: unknown })?.correct)}
Return strict JSON with:
{
  "correct": boolean,
  "partial": boolean,
  "score": number 0-100,
  "feedback": string,
  "cjmmImpact": number -8..8,
  "lasaterImpact": number -8..8
}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as {
          content?: { type: string; text?: string }[];
        };
        const text = data.content?.find((c) => c.type === "text")?.text ?? "";
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        const jsonSlice = start >= 0 && end > start ? text.slice(start, end + 1) : text;
        const parsed = JSON.parse(jsonSlice);
        const validated = scoreSchema.safeParse(parsed);
        if (validated.success) {
          grading = validated.data;
        }
      }
    } catch {
      // keep local grading fallback
    }
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("question_attempts").insert({
      user_id: user.id,
      session_id: sessionId ?? crypto.randomUUID(),
      item_type: itemType ?? question?.type ?? "bowtie",
      cjmm_domain: question?.cjmmDomain ?? "prioritize",
      lasater_domain: question?.lasaterDomain ?? "responding",
      score: grading.score,
      is_correct: grading.correct,
      question_json: question,
      answer_json: answer,
      feedback_json: {
        feedback: grading.feedback,
        partial: grading.partial,
        correct: grading.correct,
      },
    });
  }

  return NextResponse.json({
    ...grading,
  });
}
