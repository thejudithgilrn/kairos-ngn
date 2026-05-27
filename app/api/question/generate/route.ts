import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { selectNextItemType } from "@/lib/ai/adaptive";
import { CJMMScores, ItemType } from "@/lib/types";
import { fallbackQuestion } from "@/lib/ai/questionFallbacks";
import { questionSchemas } from "@/lib/ai/questionSchemas";

const itemTypeRules: Record<string, string> = {
  bowtie: "Return causes, one action label, and outcomes.",
  cloze: "Return clozeText, blanks, and correct object keyed by blank id.",
  highlight: "Return sentenceParts and correct array with selected significant findings.",
  dragdrop: "Return chips, zones, and correct mapping zone->chip.",
  matrix: "Return rows, columns, and correct mapping row->column.",
  trend: "Return trendRows, options, and correct option string.",
};

function extractJson(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let itemType = (body.itemType ?? "bowtie") as ItemType;
  const sessionId = body.sessionId as string | undefined;

  if (itemType === "adaptive") {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: attempts } = await supabase
        .from("question_attempts")
        .select("item_type,cjmm_domain,score")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      const scores: CJMMScores = {
        recognize: 50,
        analyze: 50,
        prioritize: 50,
        generate: 50,
        action: 50,
        evaluate: 50,
      };
      (attempts ?? []).forEach((a) => {
        const d = a.cjmm_domain as keyof CJMMScores;
        scores[d] = Math.round((scores[d] + a.score) / 2);
      });
      itemType = selectNextItemType(scores, (attempts ?? []) as { item_type: ItemType }[]);
    } else {
      itemType = "bowtie";
    }
  }

  let question = fallbackQuestion(itemType as Exclude<ItemType, "adaptive">);
  const schema =
    questionSchemas[itemType as keyof typeof questionSchemas] ?? questionSchemas.bowtie;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const prompt = `You are a clinical nursing education expert.
Generate one NGN ${itemType} question.
Rules: ${itemTypeRules[itemType] ?? "Return valid NGN item payload."}
Return strict JSON only with keys required by this item.
Must include: type, stem, cjmmDomain, lasaterDomain, difficulty, caseArea, explanation, case, and correct answer keys.
`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 1400,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (response.ok) {
        const bodyJson = (await response.json()) as {
          content?: { type: string; text?: string }[];
        };
        const text = bodyJson.content?.find((c) => c.type === "text")?.text ?? "";
        const parsed = JSON.parse(extractJson(text));
        const validated = schema.safeParse(parsed);
        if (validated.success) {
          question = validated.data;
        }
      }
    } catch {
      // Keep fallback question on AI or parse failure.
    }
  }

  return NextResponse.json({
    sessionId,
    question,
  });
}
