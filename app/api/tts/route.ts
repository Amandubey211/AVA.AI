// app/api/tts/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();
    if (!text) {
      return new NextResponse("Missing text in request body", { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = voiceId || "21m00Tcm4TlvDq8ikWAM";

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
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API failed with status ${response.status}`);
    }

    // --- SIMPLIFIED: Just return the audio stream ---
    return new NextResponse(response.body, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("[TTS_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
