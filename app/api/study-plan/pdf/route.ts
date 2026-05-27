import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";

export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  title: { fontSize: 20, marginBottom: 12 },
  section: { marginBottom: 10 },
  item: { marginBottom: 6 },
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
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

  const { data: session } = await supabase
    .from("sessions")
    .select("study_plan,session_type,completed_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const plan = (session.study_plan as
    | { summary?: string; studyPlan?: { topic: string; detail: string }[] }
    | null) ?? { summary: "", studyPlan: [] };

  const doc = createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(Text, { style: styles.title }, "Kairos NGN Study Plan"),
      createElement(
        View,
        { style: styles.section },
        createElement(Text, null, `Session Type: ${session.session_type}`),
        createElement(
          Text,
          null,
          `Date: ${new Date(session.completed_at).toLocaleDateString()}`
        )
      ),
      createElement(
        View,
        { style: styles.section },
        createElement(Text, null, "Summary"),
        createElement(Text, null, plan.summary ?? "No summary available.")
      ),
      createElement(
        View,
        { style: styles.section },
        createElement(Text, null, "Action Plan"),
        ...(plan.studyPlan ?? []).map((item, idx) =>
          createElement(
            Text,
            { key: `${item.topic}-${idx}`, style: styles.item },
            `${idx + 1}. ${item.topic}: ${item.detail}`
          )
        )
      )
    )
  );

  const buffer = await renderToBuffer(doc);
  const bytes = new Uint8Array(buffer);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="kairos-study-plan-${sessionId}.pdf"`,
    },
  });
}
