import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const itemType = body.itemType ?? "bowtie";

  const shared = {
    cjmmDomain: "prioritize",
    lasaterDomain: "responding",
    difficulty: "beginning",
    caseArea: "Medical-Surgical",
    explanation:
      "Prioritization in early deterioration depends on perfusion and oxygenation status.",
    case: {
      patient: "Client: 67-year-old with CHF exacerbation",
      context:
        "Admitted 4 hours ago with dyspnea. Urine output decreased and crackles are now bilateral.",
      vitals: { HR: "118", RR: "30", SpO2: "88% RA", BP: "162/94" },
      abnormalVitals: ["RR", "SpO2", "HR"],
    },
  };

  const questionByType: Record<string, object> = {
    bowtie: {
      ...shared,
      type: "bowtie",
      stem: "Which finding requires the most immediate intervention?",
      causes: {
        options: [
          "Acute fluid volume overload",
          "Medication nonadherence",
          "Pulmonary embolism",
          "Anxiety attack",
        ],
        correct: ["Acute fluid volume overload"],
      },
      action: { label: "Administer prescribed IV diuretic and elevate HOB" },
      outcomes: {
        options: [
          "Improved oxygen saturation and work of breathing",
          "Increased peripheral edema",
          "Rising serum lactate",
          "Worsening crackles",
        ],
        correct: ["Improved oxygen saturation and work of breathing"],
      },
      correct: {
        causes: ["Acute fluid volume overload"],
        outcomes: ["Improved oxygen saturation and work of breathing"],
      },
    },
    cloze: {
      ...shared,
      type: "cloze",
      stem: "Complete the nursing plan for this unstable patient.",
      clozeText: "The priority intervention is __A__. Monitor for __B__ in response.",
      blanks: [
        { id: "a", options: ["IV diuretic", "Oral antacid", "PRN sleep aid"] },
        { id: "b", options: ["improved SpO2", "worsening edema", "new rash"] },
      ],
      correct: { a: "IV diuretic", b: "improved SpO2" },
    },
    highlight: {
      ...shared,
      type: "highlight",
      stem: "Highlight the findings that indicate clinical deterioration.",
      sentenceParts: [
        "RR increased from 22 to 30,",
        "urine output 20 mL/hr,",
        "client reports orthopnea,",
        "skin warm and dry,",
      ],
      correct: [
        "RR increased from 22 to 30,",
        "urine output 20 mL/hr,",
        "client reports orthopnea,",
      ],
    },
    dragdrop: {
      ...shared,
      type: "dragdrop",
      stem: "Assign each intervention to the appropriate priority bucket.",
      chips: ["High-flow oxygen", "Daily weight", "Repeat potassium"],
      zones: ["Immediate", "Soon", "Monitor"],
      correct: {
        Immediate: "High-flow oxygen",
        Soon: "Repeat potassium",
        Monitor: "Daily weight",
      },
    },
    matrix: {
      ...shared,
      type: "matrix",
      stem: "Classify each intervention for this patient's current state.",
      rows: ["IV loop diuretic", "2L fluid bolus", "Continuous pulse oximetry"],
      columns: ["Indicated", "Contraindicated", "Non-Essential"],
      correct: {
        "IV loop diuretic": "Indicated",
        "2L fluid bolus": "Contraindicated",
        "Continuous pulse oximetry": "Indicated",
      },
    },
    trend: {
      ...shared,
      type: "trend",
      stem: "Which trend is most concerning and requires immediate escalation?",
      trendRows: [
        { metric: "SpO2", t1: "94%", t2: "91%", t3: "88%" },
        { metric: "Urine output", t1: "45", t2: "30", t3: "20" },
        { metric: "Temp", t1: "98.9", t2: "99.0", t3: "99.1" },
      ],
      options: [
        "Declining oxygen saturation with oliguria",
        "Stable temperature over time",
        "No clinically meaningful change",
      ],
      correct: "Declining oxygen saturation with oliguria",
    },
  };

  const question =
    itemType === "adaptive"
      ? questionByType.bowtie
      : questionByType[itemType] ?? questionByType.bowtie;

  return NextResponse.json({
    question,
  });
}
