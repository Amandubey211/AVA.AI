// lib/playTTS.ts
"use client";

export interface TTSPlayback {
  audio: HTMLAudioElement;
  visemes: [number, number][];
}

export function playTTS(
  text: string,
  ttsVoiceId: string
): Promise<TTSPlayback> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: ttsVoiceId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`TTS API failed with status ${response.status}`);
      }

      const visemesHeader = response.headers.get("X-Visemes");
      const visemes: [number, number][] = visemesHeader
        ? JSON.parse(visemesHeader)
        : []; // Default to an empty array if the header is missing

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // We resolve the promise as soon as the audio metadata is loaded and it's ready to be played.
      audio.onloadeddata = () => {
        // Resolve with both the audio object and the extracted viseme data.
        resolve({ audio, visemes });
      };

      audio.onerror = (err) => {
        URL.revokeObjectURL(audioUrl); // Clean up the object URL on error
        console.error("Audio playback error:", err);
        reject(err);
      };
    } catch (error) {
      console.error("Error in playTTS function:", error);
      reject(error);
    }
  });
}
