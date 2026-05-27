type Input = {
  userName: string;
  itemTypes: string[];
  cjmmScores: Record<string, number>;
  lasaterScores: Record<string, number>;
  questionSummaries: string[];
};

export async function generateStudyPlan(input: Input) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      summary:
        "You are progressing in recognizing priority findings and should keep practicing escalation timing and intervention selection.",
      gaps: [
        {
          domain: "Evaluate Outcomes",
          priority: "high" as const,
          description:
            "Focus on reassessing intervention effectiveness using trend-based evidence.",
        },
        {
          domain: "Analyze Cues",
          priority: "medium" as const,
          description: "Practice clustering findings into likely pathophysiology patterns.",
        },
        {
          domain: "Generate Solutions",
          priority: "low" as const,
          description: "Develop backup plans when first-line interventions underperform.",
        },
      ],
      studyPlan: [
        {
          rank: 1,
          topic: "Reassessment Frameworks",
          detail: "Use 10-minute post-intervention rechecks to confirm response trends.",
          resource: "NCSBN Clinical Judgment resources",
          clinicalApplication:
            "After oxygen and diuretics, recheck respiratory effort and SpO2 trend.",
        },
        {
          rank: 2,
          topic: "Cue Clustering",
          detail: "Run 15 mixed-case cue clustering drills this week.",
          resource: "ATI NGN case sets",
          clinicalApplication: "Group dyspnea + crackles + oliguria into fluid overload.",
        },
        {
          rank: 3,
          topic: "Prioritization Ladder",
          detail: "Practice first-action selection under unstable conditions.",
          resource: "Kaplan prioritization bank",
          clinicalApplication: "Escalate airway/breathing priorities before lower-risk tasks.",
        },
        {
          rank: 4,
          topic: "Outcome Evaluation",
          detail: "Document expected outcomes before intervention to speed judgment.",
          resource: "Clinical decision checklist",
          clinicalApplication: "Define objective response markers for each intervention.",
        },
      ],
    };
  }

  const prompt = `You are a clinical nursing education advisor.
Generate a post-session debrief for ${input.userName}.

Session data:
- Item types used: ${input.itemTypes.join(", ")}
- CJMM scores: ${JSON.stringify(input.cjmmScores)}
- Lasater scores: ${JSON.stringify(input.lasaterScores)}
- Questions: ${input.questionSummaries.join(" | ")}

Return JSON with:
summary, gaps (top 3 ranked), studyPlan (4 items ranked).`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${prompt}\nReturn strict JSON only.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Anthropic request failed");
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text ?? "{}";
  const parsed = JSON.parse(text) as {
    summary: string;
    gaps: { domain: string; priority: "high" | "medium" | "low"; description: string }[];
    studyPlan: {
      rank: number;
      topic: string;
      detail: string;
      resource: string;
      clinicalApplication: string;
    }[];
  };
  return parsed;
}
