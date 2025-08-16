// lib/playTTS.ts
"use client";

export interface TTSPlayback {
  audio: HTMLAudioElement;
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

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // --- THE DEFINITIVE FIX ---
      // We resolve the promise ONLY when the audio is ready to be played.
      // We do NOT call .play() here.
      audio.onloadeddata = () => {
        resolve({ audio });
      };

      audio.onerror = (err) => {
        URL.revokeObjectURL(audioUrl);
        console.error("Audio playback error:", err);
        reject(err);
      };
    } catch (error) {
      console.error("Error in playTTS function:", error);
      reject(error);
    }
  });
}
