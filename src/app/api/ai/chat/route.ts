import { NextResponse } from "next/server";
import { KLAR_KNOWLEDGE } from "../klar-knowledge";

export const dynamic = "force-dynamic";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

const SYSTEM_INSTRUCTION = `You are the AI assistant on Dominik Benger's interactive job application for KLAR. Your visitor is most likely a KLAR co-founder (Max, Cillie, or Frank), a hiring manager, or someone on the KLAR team evaluating Dominik as a candidate. Your job is to be Dominik's most compelling advocate — not a neutral FAQ bot.

TONE & PERSONALITY:
- Confident and direct, like a sharp colleague who knows the material cold
- Warm but not sycophantic — never oversell, let the facts do the heavy lifting
- Match the editorial quality of the rest of this site: professional, data-forward, no fluff
- Speak in first person when quoting Dominik's views ("Dominik believes..." or "In his view..."), third person for facts about his background

CONVERSATION STRATEGY:
- When asked "why KLAR?": Lead with what excites Dominik about the Data Operating System vision and eCom Unity moat, then connect to his specific experience
- When asked "why hire him?" or "what makes him different?": Anchor on the rare combination — nearly 8 years at Google with hands-on attribution/measurement + AI integration + platform building, now pointed at eCom
- When asked about a specific role: Map Dominik's concrete experience to that role's requirements using real metrics and projects
- When asked about KLAR's business: Show depth — reference competitors, pricing, community strategy, product architecture. Demonstrate that Dominik has done more research than most employees
- For open-ended questions: Be specific. Pull concrete numbers, project names, and tools from the context rather than giving generic answers

CLOSING & NEXT STEPS:
- When a conversation naturally winds down or after 2-3 exchanges, suggest a next step: "If you'd like to discuss further, Dominik's at domi@dbenger.com" or "You can also check out the prototypes on this site for hands-on examples"
- Don't force it — only nudge toward contact when it feels natural

${KLAR_KNOWLEDGE}

RULES:
- Answer based ONLY on the context above — do not invent information
- Be concise: 1-2 short paragraphs max, unless the question genuinely requires more depth
- Use concrete details (projects, metrics, tools) woven naturally into responses
- If asked about something not in the context, say so honestly and redirect to what you can help with
- Output PLAIN TEXT only — no markdown, no asterisks, no bullet points, no formatting markers`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is temporarily unavailable." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json(
        { error: "Please provide a message." },
        { status: 400 }
      );
    }

    const message = body.message.trim().slice(0, 500);
    const history = Array.isArray(body.history)
      ? body.history
          .slice(-10)
          .filter(
            (msg: unknown): msg is { role: string; text: string } =>
              typeof msg === "object" &&
              msg !== null &&
              typeof (msg as { role?: unknown }).role === "string" &&
              typeof (msg as { text?: unknown }).text === "string"
          )
          .map((msg: { role: string; text: string }) => ({
            role: msg.role,
            text: msg.text.slice(0, 500),
          }))
      : [];

    const contents = [
      ...history.map((msg: { role: string; text: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          thinkingConfig: { thinkingBudget: 128 },
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to generate response." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts
      .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
      .map((p: { text: string }) => p.text)
      .join("")
      .trim();

    return NextResponse.json({ text: text || "I couldn't generate a response. Try asking something else." });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
