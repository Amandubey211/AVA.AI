// lib/playTTS.ts
let lastAudio: HTMLAudioElement | null = null;

export async function playTTS(text: string) {
  try {
    if (lastAudio) {
      lastAudio.pause();
      lastAudio.src = "";
      lastAudio = null;
    }

    console.log("[playTTS] Starting fetch for text:", text);

    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS API error:", errorText);
      return;
    }

    const audioBlob = await response.blob();
    console.log("[playTTS] Received audio blob of size:", audioBlob.size);

    if (audioBlob.size < 1000) {
      console.error("Warning: audio blob size suspiciously small.");
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    lastAudio = audio;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        console.log("[playTTS] Audio playback ended");
        resolve();
      };
      audio.onerror = (e) => {
        console.error("[playTTS] Audio error", e);
        reject(e);
      };
      audio.onloadeddata = () => {
        console.log("[playTTS] Audio data loaded, starting playback");
        audio.play().catch(reject);
      };
    });

    URL.revokeObjectURL(audioUrl);
  } catch (e) {
    console.error("[playTTS] Exception:", e);
  }
}
