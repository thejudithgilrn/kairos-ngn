"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BowTie } from "@/components/question/types/BowTie";
import { Cloze } from "@/components/question/types/Cloze";
import { DragDrop } from "@/components/question/types/DragDrop";
import { Highlight } from "@/components/question/types/Highlight";
import { Matrix } from "@/components/question/types/Matrix";
import { Trend } from "@/components/question/types/Trend";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionShape } from "@/lib/types";

export default function SessionTypePage() {
  const params = useParams<{ type: string }>();
  const [question, setQuestion] = useState<QuestionShape | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/question/generate", {
        method: "POST",
        body: JSON.stringify({ itemType: params.type, cjmmDomain: "prioritize" }),
      });
      const data = await res.json();
      setQuestion(data.question);
    };
    run();
  }, [params.type]);

  async function handleSubmit(answer: unknown) {
    if (!question) return;
    const res = await fetch("/api/question/score", {
      method: "POST",
      body: JSON.stringify({ question, answer, itemType: question.type }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
  }

  if (!question) return <p>Loading question...</p>;

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <ProgressBar value={10} />
          <span className="font-ui text-xs">Q 1 of 10</span>
        </div>
        <Card>
          <p className="font-heading text-2xl font-bold">{question.case.patient}</p>
          <p className="mt-2 text-sm">{question.case.context}</p>
          <p className="mt-4 text-sm">{question.stem}</p>
          <div className="mt-4">
            {question.type === "bowtie" && (
              <BowTie
                causes={question.causes?.options ?? []}
                outcomes={question.outcomes?.options ?? []}
                onSubmit={handleSubmit}
              />
            )}
            {question.type === "cloze" && (
              <Cloze
                text={(question as QuestionShape & { clozeText?: string }).clozeText ?? ""}
                blanks={(question as QuestionShape & { blanks?: { id: string; options: string[] }[] }).blanks ?? []}
                onSubmit={handleSubmit}
              />
            )}
            {question.type === "highlight" && (
              <Highlight
                sentenceParts={(question as QuestionShape & { sentenceParts?: string[] }).sentenceParts ?? []}
                onSubmit={handleSubmit}
              />
            )}
            {question.type === "dragdrop" && (
              <DragDrop
                chips={(question as QuestionShape & { chips?: string[] }).chips ?? []}
                zones={(question as QuestionShape & { zones?: string[] }).zones ?? []}
                onSubmit={handleSubmit}
              />
            )}
            {question.type === "matrix" && (
              <Matrix
                rows={(question as QuestionShape & { rows?: string[] }).rows ?? []}
                columns={(question as QuestionShape & { columns?: string[] }).columns ?? []}
                onSubmit={handleSubmit}
              />
            )}
            {question.type === "trend" && (
              <Trend
                rows={
                  (question as QuestionShape & {
                    trendRows?: { metric: string; t1: string; t2: string; t3: string }[];
                  }).trendRows ?? []
                }
                options={(question as QuestionShape & { options?: string[] }).options ?? []}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </Card>
        {feedback ? (
          <Card>
            <p className="font-ui text-xs">FEEDBACK</p>
            <p className="text-sm">{feedback}</p>
          </Card>
        ) : null}
      </div>
      <Card>
        <p className="font-ui text-xs">LIVE SCORES</p>
        <p className="mt-2 text-sm">CJMM + Lasater scorebars scaffolded for live updates.</p>
      </Card>
    </div>
  );
}
