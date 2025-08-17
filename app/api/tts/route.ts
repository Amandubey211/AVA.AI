// app/api/tts/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

// --- SIMULATED VISEME GENERATION ---
// This function simulates a professional lip-sync tool by generating a timed array of mouth shapes.
// Each inner array is [timestamp_in_ms, viseme_id].
function generateDummyVisemes(text: string) {
  const visemes: [number, number][] = [];
  let time = 50; // Start time in ms
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    let visemeId;
    // Map characters to viseme IDs (0-21). This is a simplified mapping.
    switch (char) {
      case "a":
      case "i":
        visemeId = 1;
        break; // viseme_aa
      case "e":
        visemeId = 4;
        break; // viseme_E
      case "o":
      case "u":
        visemeId = 3;
        break; // viseme_ou
      case "f":
      case "v":
        visemeId = 7;
        break; // viseme_FF
      case "t":
      case "d":
      case "s":
        visemeId = 8;
        break; // viseme_DD
      case "k":
      case "g":
      case "c":
        visemeId = 9;
        break; // viseme_kk
      case "n":
        visemeId = 10;
        break; // viseme_nn
      case "r":
        visemeId = 11;
        break; // viseme_RR
      case "p":
      case "b":
      case "m":
        visemeId = 15;
        break; // viseme_pp
      default:
        visemeId = 0;
        break; // viseme_sil (silence)
    }

    if (visemeId !== 0) {
      visemes.push([time, visemeId]);
      time += 80; // Advance time for each sound (80ms is a reasonable default)
    }
  }
  return visemes;
}

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();
    if (!text) {
      return new NextResponse("Missing text in request body", { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default voice

    // 1. Generate the viseme data from the text.
    const visemes = generateDummyVisemes(text);

    // 2. Fetch the audio from ElevenLabs.
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

    // 3. Create a new response, streaming the audio in the body
    //    and sending our viseme data in the custom `X-Visemes` header.
    const headers = new Headers({ "Content-Type": "audio/mpeg" });
    headers.set("X-Visemes", JSON.stringify(visemes));

    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error("[TTS_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
