import { NextResponse } from "next/server";
import { KLAR_KNOWLEDGE } from "../klar-knowledge";

export const dynamic = "force-dynamic";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const SYSTEM_INSTRUCTION = `You are a knowledgeable AI assistant on Dominik Benger's interactive job application for KLAR. You help visitors understand Dominik's background, the business analysis, and strategic prototypes.

${KLAR_KNOWLEDGE}

RULES:
- Answer based ONLY on the context above — do not invent information
- Be conversational, specific, and concise (1-2 short paragraphs max)
- Use concrete details (projects, metrics, tools) woven naturally into responses
- When asked about KLAR, reference the business analysis and competitive landscape
- When asked about fit, connect specific Dominik skills to specific KLAR needs
- If asked about something not in the context, say so honestly
- Output PLAIN TEXT only — no markdown, no asterisks, no formatting markers`;

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
          temperature: 0.6,
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
