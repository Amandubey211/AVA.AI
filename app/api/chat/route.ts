import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "edge";

const API_TIMEOUT = 15000; // 15 seconds

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT);

  try {
    const body = await req.json();
    const {
      messages,
      systemPrompt,
    }: { messages: UIMessage[]; systemPrompt: string } = body;

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
      abortSignal: controller.signal,
    });

    result.usage.then((usage) => {
      console.log("Usage:", { totalTokens: usage.totalTokens });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[CHAT_API_TIMEOUT] Request aborted after ${API_TIMEOUT}ms`
      );
      // Return a specific timeout error response to the client
      return new Response(
        "The AI is taking too long to respond. Please try again.",
        {
          status: 504, // 504 Gateway Timeout is a fitting status code
        }
      );
    }

    console.error("[CHAT_API_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(`Internal Server Error: ${errorMessage}`, {
      status: 500,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
