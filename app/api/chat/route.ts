// app/api/chat/route.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

// We can remove the edge runtime for this non-streaming approach
// export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !systemPrompt) {
      return new NextResponse("Missing messages or systemPrompt", {
        status: 400,
      });
    }

    // --- Use generateText to get the full response at once ---
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages,
    });

    // --- Return the response as a simple JSON object ---
    // The AI SDK `Message` format expects a role and content
    return NextResponse.json({ role: "assistant", content: text });
  } catch (error) {
    console.error("[CHAT_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
