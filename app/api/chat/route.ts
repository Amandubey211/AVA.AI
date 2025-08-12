// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Full request body received:", JSON.stringify(body, null, 2));

    const {
      messages,
      systemPrompt,
    }: { messages: UIMessage[]; systemPrompt: string } = body;

    console.log("Extracted systemPrompt:", systemPrompt);
    console.log("Extracted messages:", messages);

    if (!messages || !systemPrompt) {
      return new Response("Missing messages or systemPrompt in request body", {
        status: 400,
      });
    }

    const modelMessages = convertToModelMessages(messages ?? []);

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages: modelMessages,
    });

    result.usage.then((usage) => {
      console.log("Usage:", {
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[CHAT_API_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(`Internal Server Error: ${errorMessage}`, {
      status: 500,
    });
  }
}
