import { NextResponse } from "next/server";

export const runtime = "edge";

const TTS_API_TIMEOUT = 10000; // 10 seconds for TTS

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TTS_API_TIMEOUT);

  try {
    const { text } = await req.json();

    if (!text) {
      return new NextResponse("Missing text in request body", { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
        // Pass the abort signal to the fetch call
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ElevenLabs API Error:", errorBody);
      return new NextResponse("Failed to generate audio from ElevenLabs", {
        status: response.status,
      });
    }

    return new NextResponse(response.body, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[TTS_API_TIMEOUT] Request aborted after ${TTS_API_TIMEOUT}ms`
      );
      return new NextResponse("TTS generation took too long.", {
        status: 504,
      });
    }
    console.error("[TTS_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
